'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useDeleteProductMutation, useGetProductsQuery, type ProductListItem } from '@/store/api';
import { formatDateLong, formatDateShort } from '@/lib/format';
import { extractApiErrorMessage } from '@/lib/api-error';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import { useLocalStorageValue } from '@/hooks/useLocalStorageValue';
import { t, type Locale } from '@/lib/i18n';
import { SELECTED_PRODUCT_STORAGE_KEY } from '@/lib/storage-keys';
import DeleteConfirmModal from '../_components/DeleteConfirmModal';
import CurrencyPrices from '../_components/CurrencyPrices';
import SplitPanelLayout from '../_components/SplitPanelLayout';
import ProductDetailPanel from './ProductDetailPanel';
import { buildProductTypeStats } from './chart-data';
import styles from './Products.module.scss';

const ProductsChart = dynamic(() => import('./ProductsChart'), {
  ssr: false,
  loading: () => (
    <div className="spinner-border" role="status">
      <span className="visually-hidden" />
    </div>
  ),
});

interface ProductsViewProps {
  initialProducts: ProductListItem[];
  lang: Locale;
  initialType?: string;
}

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
  initialType = '',
}: ProductsViewProps): React.JSX.Element {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(() => {
    const knownTypes = new Set(initialProducts.map((product) => product.type));
    return initialType && knownTypes.has(initialType) ? initialType : '';
  });
  const { data: fetchedProducts, isFetching } = useGetProductsQuery(selectedType || undefined);
  /**
   * Switching to a type with no cached fetch yet leaves `fetchedProducts`
   * undefined for a moment — rather than blanking the list to a spinner,
   * keep showing the last-known list (stale-while-revalidate) and surface
   * `isFetching` as a small inline indicator instead. Updating state
   * directly during render (not in an effect) is the React-endorsed way to
   * mirror a prop/query result without an extra render pass.
   */
  const [lastProducts, setLastProducts] = useState(initialProducts);
  if (fetchedProducts && fetchedProducts !== lastProducts) {
    setLastProducts(fetchedProducts);
  }
  const products = fetchedProducts ?? lastProducts;
  const [selectedId, setSelectedId] = useLocalStorageValue<number | null>(
    SELECTED_PRODUCT_STORAGE_KEY,
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteProduct, { isLoading: isDeleting, error: deleteError, reset: resetDelete }] =
    useDeleteProductMutation();
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartMetric, setChartMetric] = useState<'count' | 'price'>('count');
  const chartData = useMemo(() => buildProductTypeStats(initialProducts), [initialProducts]);

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

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
    setSelectedId(null);

    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('type', value);
    } else {
      params.delete('type');
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
  };

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

  const selectedProduct = products.find((product) => product.id === selectedId) ?? null;
  const pendingDeleteProduct = products.find((product) => product.id === pendingDeleteId) ?? null;

  return (
    <div className={styles.products}>
      <div className={styles.products__header}>
        <h1 className={styles.products__title}>
          <i className="bi bi-box-seam me-2" aria-hidden="true" />
          {t('products.title', lang)}{' '}
          <span className={styles['products__title-count']}>/ {products.length}</span>
          {isFetching ? (
            <span
              className="spinner-border spinner-border-sm text-secondary ms-2"
              role="status"
              aria-label={t('common.loading', lang)}
            />
          ) : null}
        </h1>

        <div className={styles.products__filter}>
          <label htmlFor="product-type" className={styles['products__filter-label']}>
            {t('products.filter_type', lang)}
          </label>
          <select
            id="product-type"
            className={styles['products__filter-select']}
            value={selectedType}
            onChange={(event) => handleTypeChange(event.target.value)}
          >
            <option value="">{t('products.all_types', lang)}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`${styles['products__chart-toggle']} ${
              isChartOpen ? styles['products__chart-toggle--active'] : ''
            }`}
            aria-expanded={isChartOpen}
            onClick={() => setIsChartOpen((open) => !open)}
          >
            <i className="bi bi-bar-chart-line me-1" aria-hidden="true" />
            {t('products.chart.toggle', lang)}
          </button>
        </div>
      </div>

      {isChartOpen ? (
        <div className={styles['products__chart-card']}>
          <div className={styles['products__chart-metrics']} role="group">
            <button
              type="button"
              className={`${styles['products__chart-metric']} ${
                chartMetric === 'count' ? styles['products__chart-metric--active'] : ''
              }`}
              onClick={() => setChartMetric('count')}
            >
              {t('products.chart.metric_count', lang)}
            </button>
            <button
              type="button"
              className={`${styles['products__chart-metric']} ${
                chartMetric === 'price' ? styles['products__chart-metric--active'] : ''
              }`}
              onClick={() => setChartMetric('price')}
            >
              {t('products.chart.metric_price', lang)}
            </button>
          </div>
          <ProductsChart data={chartData} metric={chartMetric} lang={lang} />
        </div>
      ) : null}

      {products.length === 0 ? (
        <p className={styles['products__empty']}>{t('products.no_results', lang)}</p>
      ) : (
        <SplitPanelLayout
          list={
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
                    <CurrencyPrices prices={product.prices} />
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
          }
          panel={
            selectedProduct ? (
              <ProductDetailPanel
                product={selectedProduct}
                onClose={() => setSelectedId(null)}
                lang={lang}
              />
            ) : null
          }
        />
      )}

      {pendingDeleteProduct ? (
        <DeleteConfirmModal
          lang={lang}
          confirmMessageKey="products.delete_confirm"
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
