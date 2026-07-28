'use client';

import { t, type Locale } from '@/lib/i18n';
import ConfirmModal from './ConfirmModal';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  lang: Locale;
  confirmMessageKey: string;
  title: string;
  isDeleting: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  lang,
  confirmMessageKey,
  title,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps): React.JSX.Element {
  return (
    <ConfirmModal
      title={t('delete.modal.title', lang)}
      cancelLabel={t('common.cancel', lang)}
      confirmLabel={t('common.delete', lang)}
      confirmIcon="bi-trash"
      confirmVariant="danger"
      isProcessing={isDeleting}
      errorMessage={errorMessage}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <p>{t(confirmMessageKey, lang)}</p>
      <p className={styles['delete-modal__item-title']}>{title}</p>
    </ConfirmModal>
  );
}
