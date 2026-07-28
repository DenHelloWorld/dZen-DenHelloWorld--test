import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import BrandLogo from '../(app)/_components/BrandLogo';
import { type Locale } from '@/lib/i18n';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Sign in — Orders & Products',
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const locale = lang as Locale;
  return (
    <main className={styles['login-page']}>
      <div className={styles['login-page__card']}>
        <h1 className={styles['login-page__title']}>
          <BrandLogo />
        </h1>
        <LoginForm lang={locale} />
      </div>
    </main>
  );
}
