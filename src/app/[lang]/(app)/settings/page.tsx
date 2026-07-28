'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import { switchLocale, t, type Locale } from '@/lib/i18n';
import {
  SELECTED_ORDER_STORAGE_KEY,
  SELECTED_PRODUCT_STORAGE_KEY,
  SELECTED_WAREHOUSE_STORAGE_KEY,
  SELECTED_GROUP_STORAGE_KEY,
} from '@/lib/storage-keys';
import ConfirmModal from '../_components/ConfirmModal';
import styles from './Settings.module.scss';

const RESETTABLE_STORAGE_KEYS = [
  SELECTED_ORDER_STORAGE_KEY,
  SELECTED_PRODUCT_STORAGE_KEY,
  SELECTED_WAREHOUSE_STORAGE_KEY,
  SELECTED_GROUP_STORAGE_KEY,
];

export default function SettingsPage(): React.JSX.Element {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const locale = (params.lang as Locale) || 'ru';
  const [isResetting, setIsResetting] = useState(false);

  useEscapeToClose([{ isOpen: isResetting, onDismiss: () => setIsResetting(false) }]);

  const handleResetStorage = (): void => {
    RESETTABLE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setIsResetting(false);
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
            onClick={() => switchLocale(router, locale, 'ru')}
          >
            {t('settings.lang.ru', locale)}
          </button>
          <button
            type="button"
            className={`btn btn-sm flex-fill ${locale === 'en' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => switchLocale(router, locale, 'en')}
          >
            {t('settings.lang.en', locale)}
          </button>
        </div>
      </div>

      <div className={`${styles.settings__card} mt-3`}>
        <div className={styles['settings__storage-row']}>
          <span className={styles['settings__storage-label']}>
            <i className="bi bi-clock-history me-1" aria-hidden="true" />
            {t('settings.storage', locale)}
          </span>
          <button
            type="button"
            className={styles['settings__reset-button']}
            onClick={() => setIsResetting(true)}
          >
            <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
            {t('settings.reset_storage', locale)}
          </button>
        </div>
      </div>

      {isResetting ? (
        <ConfirmModal
          title={t('settings.reset_storage_title', locale)}
          cancelLabel={t('common.cancel', locale)}
          confirmLabel={t('common.reset', locale)}
          confirmIcon="bi-arrow-counterclockwise"
          confirmVariant="primary"
          onCancel={() => setIsResetting(false)}
          onConfirm={handleResetStorage}
        >
          <p className="mb-0">{t('settings.reset_storage_confirm', locale)}</p>
        </ConfirmModal>
      ) : null}
    </div>
  );
}
