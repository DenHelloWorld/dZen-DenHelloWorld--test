'use client';

import type { SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/api';
import { t, type Locale } from '@/lib/i18n';
import styles from './form.module.scss';

interface LoginFormProps {
  lang: Locale;
}

export default function LoginForm({ lang }: LoginFormProps): React.JSX.Element {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const username = String(data.get('username') ?? '');
    const password = String(data.get('password') ?? '');

    const result = await login({ username, password });

    if ('data' in result) {
      router.push(`/${lang}/orders`);
      router.refresh();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.form__field}>
        <label htmlFor="username" className={styles.form__label}>
          {t('login.username', lang)} <span className="text-danger">*</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className={styles.form__input}
          required
          autoComplete="username"
        />
      </div>

      <div className={styles.form__field}>
        <label htmlFor="password" className={styles.form__label}>
          {t('login.password', lang)} <span className="text-danger">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.form__input}
          required
          minLength={3}
          autoComplete="current-password"
        />
      </div>

      <label
        className={`${styles.form__alert} ${!error ? styles['form__alert--hidden'] : ''}`}
        role="alert"
      >
        {error ? t('login.invalid_credentials', lang) : ' '}
      </label>

      <button type="submit" className={styles.form__button} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className={styles.form__spinner} aria-hidden="true" />
            {t('login.signing_in', lang)}
          </>
        ) : (
          <>
            <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true" />
            {t('login.sign_in', lang)}
          </>
        )}
      </button>
    </form>
  );
}
