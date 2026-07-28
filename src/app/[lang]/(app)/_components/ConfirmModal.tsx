'use client';

import type { ReactNode } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  title: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmIcon?: string;
  confirmVariant?: 'danger' | 'primary';
  isProcessing?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export default function ConfirmModal({
  title,
  cancelLabel,
  confirmLabel,
  confirmIcon,
  confirmVariant = 'danger',
  isProcessing = false,
  errorMessage,
  onCancel,
  onConfirm,
  children,
}: ConfirmModalProps): React.JSX.Element {
  const dialogRef = useFocusTrap<HTMLDivElement>();

  return (
    <>
      <div className={styles['confirm-modal__backdrop']} />
      <div
        ref={dialogRef}
        className={styles['confirm-modal__dialog']}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles['confirm-modal__content']}>
          <div className={styles['confirm-modal__body']}>
            <div className={styles['confirm-modal__header']}>
              <h2 className={styles['confirm-modal__title']}>{title}</h2>
            </div>
            <div className={styles['confirm-modal__text']}>
              {children}
              {errorMessage ? (
                <div className={styles['confirm-modal__error']} role="alert">
                  {errorMessage}
                </div>
              ) : null}
            </div>
            <div className={styles['confirm-modal__footer']}>
              <button
                type="button"
                className={styles['confirm-modal__cancel']}
                onClick={onCancel}
                disabled={isProcessing}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={
                  styles[
                    confirmVariant === 'primary'
                      ? 'confirm-modal__confirm--primary'
                      : 'confirm-modal__confirm'
                  ]
                }
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {confirmIcon ? <i className={`bi ${confirmIcon}`} aria-hidden="true" /> : null}{' '}
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
