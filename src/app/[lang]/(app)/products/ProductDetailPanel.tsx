'use client';

import type { ProductListItem } from '@/store/api';
import { formatDateLong, formatCurrency } from '@/lib/format';
import { t, type Locale } from '@/lib/i18n';
import styles from './Products.module.scss';

interface ProductDetailPanelProps {
  product: ProductListItem;
  onClose: () => void;
  lang: Locale;
}

export default function ProductDetailPanel({
  product,
  onClose,
  lang,
}: ProductDetailPanelProps): React.JSX.Element {
  return (
    <div key={product.id} className={styles['products__panel']}>
      <button
        type="button"
        className={styles['products__panel-close']}
        onClick={onClose}
        aria-label={t('common.close', lang)}
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>

      <h2 className={styles['products__panel-title']}>{product.title}</h2>
      <p className={styles['products__panel-meta']}>
        {product.type} · <i className="bi bi-receipt" aria-hidden="true" />{' '}
        {t('products.panel_order', lang)} {product.orderTitle}
      </p>

      <dl className={styles['products__panel-details']}>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>{t('products.serial', lang)}</dt>
          <dd className={styles['products__panel-detail-value']}>{product.serialNumber ?? '—'}</dd>
        </div>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>
            {t('products.condition', lang)}
          </dt>
          <dd className={styles['products__panel-detail-value']}>
            {product.isNew ? t('products.new', lang) : t('products.used', lang)}
          </dd>
        </div>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>
            {t('products.specification', lang)}
          </dt>
          <dd className={styles['products__panel-detail-value']}>{product.specification ?? '—'}</dd>
        </div>
        <div className={styles['products__panel-detail']}>
          <dt className={styles['products__panel-detail-label']}>
            {t('products.guarantee', lang)}
          </dt>
          <dd className={styles['products__panel-detail-value']}>
            {product.guaranteeStart && product.guaranteeEnd
              ? `${formatDateLong(product.guaranteeStart, lang)} – ${formatDateLong(product.guaranteeEnd, lang)}`
              : '—'}
          </dd>
        </div>
      </dl>

      <p className={styles['products__panel-total']}>
        <span className={styles['products__panel-total-label']}>{t('products.price', lang)}:</span>
        <span className={styles['products__panel-total-values']}>
          {product.prices.map((price) => (
            <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
          ))}
        </span>
      </p>
    </div>
  );
}
