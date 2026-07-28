'use client';

import { useState } from 'react';
import { useDeleteOrderMutation, useGetOrdersQuery, type OrderListItem } from '@/store/api';
import { formatDateLong, formatDateShort, formatCurrency } from '@/lib/format';
import { extractApiErrorMessage } from '@/lib/api-error';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import OrderDetailPanel from './OrderDetailPanel';
import DeleteConfirmModal from '../_components/DeleteConfirmModal';
import styles from './Orders.module.scss';

interface OrdersViewProps {
  initialOrders: OrderListItem[];
}

export default function OrdersView({ initialOrders }: OrdersViewProps): React.JSX.Element {
  const { data: fetchedOrders } = useGetOrdersQuery();
  const orders = fetchedOrders ?? initialOrders;
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
        Orders <span className={styles['orders__title-count']}>/ {orders.length}</span>
      </h1>

      <div className={styles.orders__layout}>
        <ul
          className={`${styles.orders__list} ${
            selectedId !== null ? styles['orders__list--split'] : ''
          }`}
        >
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
                {order.productsCount} products
              </span>

              <span className={styles['orders__row-dates']}>
                <small>{formatDateShort(order.createdAt)}</small>
                <span>{formatDateLong(order.createdAt)}</span>
              </span>

              <span className={styles['orders__row-totals']}>
                {order.totals.map((total) => (
                  <span key={total.symbol}>{formatCurrency(total.value, total.symbol)}</span>
                ))}
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

        {selectedId !== null ? (
          <OrderDetailPanel orderId={selectedId} onClose={() => setSelectedId(null)} />
        ) : null}
      </div>

      {pendingDeleteOrder ? (
        <DeleteConfirmModal
          entityLabel="order"
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
