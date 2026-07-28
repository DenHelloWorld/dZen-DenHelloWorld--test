'use client';

import { useState } from 'react';
import { useDeleteOrderMutation, useGetOrdersQuery, type OrderListItem } from '@/store/api';
import { formatDateLong, formatDateShort } from '@/lib/format';
import { extractApiErrorMessage } from '@/lib/api-error';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import { useLocalStorageValue } from '@/hooks/useLocalStorageValue';
import { t, type Locale } from '@/lib/i18n';
import { SELECTED_ORDER_STORAGE_KEY } from '@/lib/storage-keys';
import OrderDetailPanel from './OrderDetailPanel';
import DeleteConfirmModal from '../_components/DeleteConfirmModal';
import CurrencyPrices from '../_components/CurrencyPrices';
import SplitPanelLayout from '../_components/SplitPanelLayout';
import styles from './Orders.module.scss';

interface OrdersViewProps {
  initialOrders: OrderListItem[];
  lang: Locale;
}

export default function OrdersView({ initialOrders, lang }: OrdersViewProps): React.JSX.Element {
  const { data: fetchedOrders } = useGetOrdersQuery();
  const orders = fetchedOrders ?? initialOrders;
  const [selectedId, setSelectedId] = useLocalStorageValue<number | null>(
    SELECTED_ORDER_STORAGE_KEY,
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteOrder, { isLoading: isDeleting, error: deleteError, reset: resetDelete }] =
    useDeleteOrderMutation();

  useEscapeToClose([
    { isOpen: pendingDeleteId !== null, onDismiss: () => setPendingDeleteId(null) },
    { isOpen: selectedId !== null, onDismiss: () => setSelectedId(null) },
  ]);

  const handleConfirmDelete = async (): Promise<void> => {
    if (pendingDeleteId === null || isDeleting) {
      return;
    }

    const result = await deleteOrder(pendingDeleteId);

    if ('data' in result) {
      if (selectedId === pendingDeleteId) {
        setSelectedId(null);
      }
      setPendingDeleteId(null);
    }
  };

  const pendingDeleteOrder = orders.find((order) => order.id === pendingDeleteId) ?? null;

  return (
    <div className={styles.orders}>
      <h1 className={styles.orders__title}>
        <i className="bi bi-receipt me-2" aria-hidden="true" />
        {t('orders.title', lang)}{' '}
        <span className={styles['orders__title-count']}>/ {orders.length}</span>
      </h1>

      <SplitPanelLayout
        list={
          <ul className={styles.orders__list}>
            {orders.map((order) => (
              <li
                key={order.id}
                className={`${styles.orders__row} ${
                  selectedId === order.id ? styles['orders__row--active'] : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(order.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    event.preventDefault();
                    setSelectedId(order.id);
                  }
                }}
              >
                <span className={styles['orders__row-title']} title={order.title}>
                  {order.title}
                </span>

                <span className={styles['orders__row-meta']}>
                  <i className="bi bi-box-seam" aria-hidden="true" />
                  {order.productsCount} {t('orders.products', lang)}
                </span>

                <span className={styles['orders__row-dates']}>
                  <small>{formatDateShort(order.createdAt, lang)}</small>
                  <span>{formatDateLong(order.createdAt, lang)}</span>
                </span>

                <span className={styles['orders__row-totals']}>
                  <CurrencyPrices prices={order.totals} />
                </span>

                <button
                  type="button"
                  className={styles['orders__row-delete']}
                  onClick={(event) => {
                    event.stopPropagation();
                    resetDelete();
                    setPendingDeleteId(order.id);
                  }}
                  aria-label={`Delete ${order.title}`}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        }
        panel={
          selectedId !== null ? (
            <OrderDetailPanel
              orderId={selectedId}
              onClose={() => setSelectedId(null)}
              lang={lang}
            />
          ) : null
        }
      />

      {pendingDeleteOrder ? (
        <DeleteConfirmModal
          lang={lang}
          confirmMessageKey="orders.delete_confirm"
          title={pendingDeleteOrder.title}
          isDeleting={isDeleting}
          errorMessage={extractApiErrorMessage(deleteError)}
          onCancel={() => {
            resetDelete();
            setPendingDeleteId(null);
          }}
          onConfirm={() => {
            void handleConfirmDelete();
          }}
        />
      ) : null}
    </div>
  );
}
