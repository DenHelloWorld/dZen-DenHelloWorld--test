'use client';

import { useGetOrderQuery } from '@/store/api';
import { formatDateLong, formatCurrency } from '@/lib/format';
import styles from './Orders.module.scss';

interface OrderDetailPanelProps {
  orderId: number;
  onClose: () => void;
}

export default function OrderDetailPanel({
  orderId,
  onClose,
}: OrderDetailPanelProps): React.JSX.Element {
  const { data: order, isLoading, error } = useGetOrderQuery(orderId);

  return (
    <div key={orderId} className={styles.orders__panel}>
      <button
        type="button"
        className={styles['orders__panel-close']}
        onClick={onClose}
        aria-label="Close"
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>

      {isLoading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}

      {error ? <div className="alert alert-danger">Failed to load order</div> : null}

      {order ? (
        <>
          <h2 className={styles['orders__panel-title']} title={order.title}>
            {order.title}
          </h2>
          <p className={styles['orders__panel-meta']}>
            {formatDateLong(order.createdAt)} · {order.products.length} products
          </p>

          <p className={styles['orders__panel-total']}>
            <span className={styles['orders__panel-total-label']}>Total:</span>
            <span className={styles['orders__panel-total-values']}>
              {order.totals.map((total) => (
                <span key={total.symbol}>{formatCurrency(total.value, total.symbol)}</span>
              ))}
            </span>
          </p>

          <ul className={styles['orders__panel-products']}>
            {order.products.map((product) => (
              <li key={product.id} className={styles['orders__panel-product']}>
                <span className={styles['orders__panel-product-info']}>
                  <span className={styles['orders__panel-product-title']} title={product.title}>
                    {product.title}
                  </span>
                  <span className={styles['orders__panel-product-type']}>{product.type}</span>
                </span>
                <span className={styles['orders__panel-product-price']}>
                  {product.prices.map((price) => (
                    <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
