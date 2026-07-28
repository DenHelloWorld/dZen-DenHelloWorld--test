'use client';

import { useMemo, useState } from 'react';
import { useGetProductsQuery, type ProductListItem } from '@/store/api';
import { formatDateLong, formatDateShort, formatCurrency } from '@/lib/format';
import styles from './Products.module.scss';

interface ProductsViewProps {
  initialProducts: ProductListItem[];
}

function formatGuaranteeShort(product: ProductListItem): string {
  if (!product.guaranteeStart || !product.guaranteeEnd) {
    return '—';
  }
  return `${formatDateShort(product.guaranteeStart)} – ${formatDateShort(product.guaranteeEnd)}`;
}

function formatGuaranteeLong(product: ProductListItem): string {
  if (!product.guaranteeStart || !product.guaranteeEnd) {
    return 'No warranty data';
  }
  return `${formatDateLong(product.guaranteeStart)} – ${formatDateLong(product.guaranteeEnd)}`;
}

export default function ProductsView({ initialProducts }: ProductsViewProps): React.JSX.Element {
  const [selectedType, setSelectedType] = useState('');
  const { data: fetchedProducts } = useGetProductsQuery(selectedType || undefined);
  const products = fetchedProducts ?? (selectedType === '' ? initialProducts : undefined);

  const types = useMemo(
    () => Array.from(new Set(initialProducts.map((product) => product.type))).sort(),
    [initialProducts],
  );

  return (
    <div className={styles.products}>
      <div className={styles.products__header}>
        <h1 className={styles.products__title}>
          Products{' '}
          <span className={styles['products__title-count']}>/ {products?.length ?? '…'}</span>
        </h1>

        <div className={styles.products__filter}>
          <label htmlFor="product-type" className={styles['products__filter-label']}>
            Type
          </label>
          <select
            id="product-type"
            className={styles['products__filter-select']}
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {products ? (
        <ul className={styles.products__list}>
          {products.map((product) => (
            <li key={product.id} className={styles.products__row}>
              <span className={styles['products__row-title']} title={product.title}>
                {product.title}
              </span>

              <span className={styles['products__row-type']}>{product.type}</span>

              <span className={styles['products__row-guarantee']}>
                <small>{formatGuaranteeShort(product)}</small>
                <span>{formatGuaranteeLong(product)}</span>
              </span>

              <span className={styles['products__row-price']}>
                {product.prices.map((price) => (
                  <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
                ))}
              </span>

              <span className={styles['products__row-order']} title={product.orderTitle}>
                <i className="bi bi-box-seam" aria-hidden="true" />
                {product.orderTitle}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
}
