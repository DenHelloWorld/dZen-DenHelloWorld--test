'use client';

import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  entityLabel: string;
  title: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  entityLabel,
  title,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps): React.JSX.Element {
  return (
    <>
      <div className={styles['delete-modal__backdrop']} />
      <div className={styles['delete-modal__dialog']} role="dialog" aria-modal="true">
        <div className={styles['delete-modal__content']}>
          <div className={styles['delete-modal__body']}>
            <div className={styles['delete-modal__text']}>
              <p>Are you sure you want to delete this {entityLabel}?</p>
              <p className={styles['delete-modal__item-title']}>{title}</p>
            </div>
            <div className={styles['delete-modal__footer']}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
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
