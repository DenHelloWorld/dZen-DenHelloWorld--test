import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signSessionToken, getSessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/jwt';

interface LoginRequestBody {
  username?: unknown;
  password?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body: LoginRequestBody | null = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  const user = await prisma.users.findUnique({ where: { username } });
  const isValidPassword = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !isValidPassword) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const token = await signSessionToken({ sub: String(user.id), username: user.username });

  const response = NextResponse.json({ username: user.username });
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return response;
}
