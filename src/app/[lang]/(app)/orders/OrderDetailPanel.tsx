'use client';

import { useGetOrderQuery } from '@/store/api';
import { formatDateLong, formatCurrency } from '@/lib/format';
import { t, type Locale } from '@/lib/i18n';
import styles from './Orders.module.scss';

interface OrderDetailPanelProps {
  orderId: number;
  onClose: () => void;
  lang: Locale;
}

export default function OrderDetailPanel({
  orderId,
  onClose,
  lang,
}: OrderDetailPanelProps): React.JSX.Element {
  const { data: order, isLoading, error } = useGetOrderQuery(orderId);

  return (
    <div key={orderId} className={styles.orders__panel}>
      <button
        type="button"
        className={styles['orders__panel-close']}
        onClick={onClose}
        aria-label={t('common.close', lang)}
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>

      {isLoading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('common.loading', lang)}</span>
        </div>
      ) : null}

      {error ? <div className="alert alert-danger">{t('orders.panel_error', lang)}</div> : null}

      {order ? (
        <>
          <h2 className={styles['orders__panel-title']} title={order.title}>
            {order.title}
          </h2>
          <p className={styles['orders__panel-meta']}>
            {formatDateLong(order.createdAt, lang)} · {order.products.length}{' '}
            {t(order.products.length === 1 ? 'orders.product' : 'orders.products', lang)}
          </p>

          <p className={styles['orders__panel-total']}>
            <span className={styles['orders__panel-total-label']}>
              {t('orders.panel_total', lang)}
            </span>
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
