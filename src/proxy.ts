import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/jwt';

const LOCALES = ['ru', 'en'];
const DEFAULT_LOCALE = 'ru';
const LOCALE_COOKIE = 'locale';
const PUBLIC_API_PREFIX = '/api/auth/login';

function getLocale(request: NextRequest): string {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved === 'ru' || saved === 'en') return saved;
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang?.startsWith('ru')) return 'ru';
  return DEFAULT_LOCALE;
}

function parseLocale(pathname: string): { locale: string; rest: string } | null {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return { locale, rest: '/' };
    if (pathname.startsWith(`/${locale}/`))
      return { locale, rest: pathname.slice(locale.length + 1) };
  }
  return null;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Static files & API — skip
  if (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/')
  ) {
    if (pathname.startsWith('/api/') && pathname !== PUBLIC_API_PREFIX) {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      const session = token ? await verifySessionToken(token) : null;
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Locale detection
  const parsed = parseLocale(pathname);

  if (parsed === null) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const { locale, rest } = parsed;

  // Auth redirects
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (rest === '/login') {
    if (session) {
      request.nextUrl.pathname = `/${locale}/orders`;
      return NextResponse.redirect(request.nextUrl);
    }
    return NextResponse.next();
  }

  if (session) {
    return NextResponse.next();
  }

  request.nextUrl.pathname = `/${locale}/login`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
