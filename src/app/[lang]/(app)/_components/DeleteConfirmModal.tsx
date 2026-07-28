'use client';

import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  entityLabel: string;
  title: string;
  isDeleting: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  entityLabel,
  title,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps): React.JSX.Element {
  const dialogRef = useFocusTrap<HTMLDivElement>();

  return (
    <>
      <div className={styles['delete-modal__backdrop']} />
      <div
        ref={dialogRef}
        className={styles['delete-modal__dialog']}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles['delete-modal__content']}>
          <div className={styles['delete-modal__body']}>
            <div className={styles['delete-modal__text']}>
              <p>Are you sure you want to delete this {entityLabel}?</p>
              <p className={styles['delete-modal__item-title']}>{title}</p>
              {errorMessage ? (
                <div className={styles['delete-modal__error']} role="alert">
                  {errorMessage}
                </div>
              ) : null}
            </div>
            <div className={styles['delete-modal__footer']}>
              <button
                type="button"
                className={styles['delete-modal__cancel']}
                onClick={onCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles['delete-modal__confirm']}
                onClick={onConfirm}
                disabled={isDeleting}
              >
                <i className="bi bi-trash" aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
