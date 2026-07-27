import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Sign in — Orders & Products',
};

export default function LoginPage(): React.JSX.Element {
  return (
    <main className={styles['login-page']}>
      <div className={styles['login-page__card']}>
        <h1 className={styles['login-page__title']}>Orders &amp; Products</h1>
        <LoginForm />
      </div>
    </main>
  );
}
