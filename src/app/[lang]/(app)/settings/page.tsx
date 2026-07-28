'use client';

import { useParams, useRouter } from 'next/navigation';
import { t, type Locale } from '@/lib/i18n';
import styles from './Settings.module.scss';

export default function SettingsPage(): React.JSX.Element {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const locale = (params.lang as Locale) || 'ru';

  const setLocale = (newLocale: Locale): void => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    const pathname = window.location.pathname.replace(`/${locale}/`, `/${newLocale}/`);
    router.push(pathname);
  };

  return (
    <div className={styles.settings}>
      <h1 className={styles.settings__title}>
        <i className="bi bi-gear me-2" aria-hidden="true" />
        {t('settings.title', locale)}
      </h1>

      <div className={styles.settings__card}>
        <label className={styles.settings__label}>{t('settings.language', locale)}</label>
        <div className="d-flex gap-2">
          <button
            type="button"
            className={`btn btn-sm flex-fill ${locale === 'ru' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setLocale('ru')}
          >
            {t('settings.lang.ru', locale)}
          </button>
          <button
            type="button"
            className={`btn btn-sm flex-fill ${locale === 'en' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setLocale('en')}
          >
            {t('settings.lang.en', locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
