'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDeleteProductMutation, useGetProductsQuery, type ProductListItem } from '@/store/api';
import { formatDateLong, formatDateShort, formatCurrency } from '@/lib/format';
import DeleteConfirmModal from '../_components/DeleteConfirmModal';
import ProductDetailPanel from './ProductDetailPanel';
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const types = useMemo(
    () => Array.from(new Set(initialProducts.map((product) => product.type))).sort(),
    [initialProducts],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') {
        return;
      }

      if (pendingDeleteId !== null) {
        setPendingDeleteId(null);
      } else if (selectedId !== null) {
        setSelectedId(null);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pendingDeleteId, selectedId]);

  const handleConfirmDelete = async (): Promise<void> => {
    if (pendingDeleteId === null) {
      return;
    }

    const result = await deleteProduct(pendingDeleteId);

    if ('data' in result) {
      if (selectedId === pendingDeleteId) {
        setSelectedId(null);
      }
      setPendingDeleteId(null);
    }
  };

  const selectedProduct = products?.find((product) => product.id === selectedId) ?? null;
  const pendingDeleteProduct = products?.find((product) => product.id === pendingDeleteId) ?? null;

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
            onChange={(event) => {
              setSelectedType(event.target.value);
              setSelectedId(null);
            }}
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
        <div className={styles.products__layout}>
          <ul
            className={`${styles.products__list} ${
              selectedId !== null ? styles['products__list--split'] : ''
            }`}
          >
            {products.map((product) => (
              <li
                key={product.id}
                className={`${styles.products__row} ${
                  selectedId === product.id ? styles['products__row--active'] : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(product.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    event.preventDefault();
                    setSelectedId(product.id);
                  }
                }}
              >
                <span className={styles['products__row-title']} title={product.title}>
                  {product.title}
                </span>

                <span className={styles['products__row-type']}>{product.type}</span>

                <span
                  className={`${styles['products__row-guarantee']} ${
                    selectedId !== null ? styles['products__row-guarantee--compact'] : ''
                  }`}
                >
                  <small>{formatGuaranteeShort(product)}</small>
                  {selectedId === null ? <span>{formatGuaranteeLong(product)}</span> : null}
                </span>

                <span className={styles['products__row-price']}>
                  {product.prices.map((price) => (
                    <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
                  ))}
                </span>

                {selectedId === null ? (
                  <span className={styles['products__row-order']} title={product.orderTitle}>
                    <i className="bi bi-box-seam" aria-hidden="true" />
                    {product.orderTitle}
                  </span>
                ) : null}

                <button
                  type="button"
                  className={styles['products__row-delete']}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPendingDeleteId(product.id);
                  }}
                  aria-label={`Delete ${product.title}`}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          {selectedProduct ? (
            <ProductDetailPanel product={selectedProduct} onClose={() => setSelectedId(null)} />
          ) : null}
        </div>
      ) : (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      {pendingDeleteProduct ? (
        <DeleteConfirmModal
          entityLabel="product"
          title={pendingDeleteProduct.title}
          isDeleting={isDeleting}
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => {
            void handleConfirmDelete();
          }}
        />
      ) : null}
    </div>
  );
}
