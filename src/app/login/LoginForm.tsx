'use client';

import type { SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/api';
import styles from './form.module.scss';

export default function LoginForm(): React.JSX.Element {
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
      router.push('/orders');
      router.refresh();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.form__field}>
        <label htmlFor="username" className={styles.form__label}>
          Username <span className="text-danger">*</span>
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
          Password <span className="text-danger">*</span>
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
        {error ? 'Invalid username or password' : ' '}
      </label>

      <button type="submit" className={styles.form__button} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className={styles.form__spinner} aria-hidden="true" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
