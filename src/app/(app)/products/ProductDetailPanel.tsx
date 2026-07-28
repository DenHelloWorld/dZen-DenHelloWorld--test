'use client';

import type { ProductListItem } from '@/store/api';
import { formatDateLong, formatCurrency } from '@/lib/format';
import styles from './Products.module.scss';

interface ProductDetailPanelProps {
  product: ProductListItem;
  onClose: () => void;
}

export default function ProductDetailPanel({
  product,
  onClose,
}: ProductDetailPanelProps): React.JSX.Element {
  return (
    <div className={styles['products__panel']}>
      <button
        type="button"
        className={styles['products__panel-close']}
        onClick={onClose}
        aria-label="Close"
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>

      <h2 className={styles['products__panel-title']}>{product.title}</h2>
      <p className={styles['products__panel-meta']}>
        {product.type} · Order: {product.orderTitle}
      </p>

      <dl className={styles['products__panel-details']}>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>Serial number</dt>
          <dd className={styles['products__panel-detail-value']}>{product.serialNumber ?? '—'}</dd>
        </div>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>Condition</dt>
          <dd className={styles['products__panel-detail-value']}>
            {product.isNew ? 'New' : 'Used'}
          </dd>
        </div>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>Specification</dt>
          <dd className={styles['products__panel-detail-value']}>{product.specification ?? '—'}</dd>
        </div>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>Guarantee</dt>
          <dd className={styles['products__panel-detail-value']}>
            {product.guaranteeStart && product.guaranteeEnd
              ? `${formatDateLong(product.guaranteeStart)} – ${formatDateLong(product.guaranteeEnd)}`
              : '—'}
          </dd>
        </div>
      </dl>

      <p className={styles['products__panel-total']}>
        <span className={styles['products__panel-total-label']}>Price:</span>
        <span className={styles['products__panel-total-values']}>
          {product.prices.map((price) => (
            <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
          ))}
        </span>
      </p>
    </div>
  );
}
