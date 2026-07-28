'use client';

import { useMemo, useState } from 'react';
import { useDeleteProductMutation, useGetProductsQuery, type ProductListItem } from '@/store/api';
import { formatDateLong, formatDateShort, formatCurrency } from '@/lib/format';
import { extractApiErrorMessage } from '@/lib/api-error';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import { useLocalStorageValue } from '@/hooks/useLocalStorageValue';
import { t, type Locale } from '@/lib/i18n';
import DeleteConfirmModal from '../_components/DeleteConfirmModal';
import ProductDetailPanel from './ProductDetailPanel';
import styles from './Products.module.scss';

interface ProductsViewProps {
  initialProducts: ProductListItem[];
  lang: Locale;
}

const SELECTED_PRODUCT_STORAGE_KEY = 'products-last-selected-id';

function formatGuaranteeShort(product: ProductListItem, lang: Locale): string {
  if (!product.guaranteeStart || !product.guaranteeEnd) {
    return '—';
  }
  return `${formatDateShort(product.guaranteeStart, lang)} – ${formatDateShort(product.guaranteeEnd, lang)}`;
}

function formatGuaranteeLong(product: ProductListItem, lang: Locale): string {
  if (!product.guaranteeStart || !product.guaranteeEnd) {
    return t('products.no_warranty', lang);
  }
  return `${formatDateLong(product.guaranteeStart, lang)} – ${formatDateLong(product.guaranteeEnd, lang)}`;
}

export default function ProductsView({
  initialProducts,
  lang,
}: ProductsViewProps): React.JSX.Element {
  const [selectedType, setSelectedType] = useState('');
  const { data: fetchedProducts } = useGetProductsQuery(selectedType || undefined);
  const products = fetchedProducts ?? (selectedType === '' ? initialProducts : undefined);
  const [selectedId, setSelectedId] = useLocalStorageValue<number | null>(
    SELECTED_PRODUCT_STORAGE_KEY,
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteProduct, { isLoading: isDeleting, error: deleteError, reset: resetDelete }] =
    useDeleteProductMutation();

  /**
   * While unfiltered, derive the option list from the freshest fetch so a
   * just-deleted last-of-a-type product drops out of the dropdown; while a
   * filter is active there's no unfiltered fetch to read from, so fall back
   * to the SSR snapshot.
   */
  const productsForTypes =
    selectedType === '' ? (fetchedProducts ?? initialProducts) : initialProducts;
  const types = useMemo(
    () => Array.from(new Set(productsForTypes.map((product) => product.type))).sort(),
    [productsForTypes],
  );

  useEscapeToClose([
    { isOpen: pendingDeleteId !== null, onDismiss: () => setPendingDeleteId(null) },
    { isOpen: selectedId !== null, onDismiss: () => setSelectedId(null) },
  ]);

  const handleConfirmDelete = async (): Promise<void> => {
    if (pendingDeleteId === null || isDeleting) {
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
          <i className="bi bi-box-seam me-2" aria-hidden="true" />
          {t('products.title', lang)}{' '}
          <span className={styles['products__title-count']}>/ {products?.length ?? '…'}</span>
        </h1>

        <div className={styles.products__filter}>
          <label htmlFor="product-type" className={styles['products__filter-label']}>
            {t('products.filter_type', lang)}
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
            <option value="">{t('products.all_types', lang)}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {products ? (
        <div className={styles.products__layout} key={selectedType || 'all'}>
          <ul className={styles.products__list}>
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
                  <small>{formatGuaranteeShort(product, lang)}</small>
                  {selectedId === null ? <span>{formatGuaranteeLong(product, lang)}</span> : null}
                </span>

                <span className={styles['products__row-price']}>
                  {product.prices.map((price) => (
                    <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
                  ))}
                </span>

                {selectedId === null ? (
                  <span className={styles['products__row-order']} title={product.orderTitle}>
                    <i className="bi bi-receipt" aria-hidden="true" />
                    {t('products.panel_order', lang)} {product.orderTitle}
                  </span>
                ) : null}

                <button
                  type="button"
                  className={styles['products__row-delete']}
                  onClick={(event) => {
                    event.stopPropagation();
                    resetDelete();
                    setPendingDeleteId(product.id);
                  }}
                  aria-label={`Delete ${product.title}`}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div
            className={`${styles['products__panel-wrap']} ${selectedId !== null ? styles['products__panel-wrap--open'] : ''}`}
          >
            {selectedProduct ? (
              <ProductDetailPanel
                product={selectedProduct}
                onClose={() => setSelectedId(null)}
                lang={lang}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('common.loading', lang)}</span>
        </div>
      )}

      {pendingDeleteProduct ? (
        <DeleteConfirmModal
          entityLabel="product"
          title={pendingDeleteProduct.title}
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
