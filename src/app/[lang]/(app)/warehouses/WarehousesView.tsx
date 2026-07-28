'use client';

import dynamic from 'next/dynamic';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import { useLocalStorageValue } from '@/hooks/useLocalStorageValue';
import type { WarehouseLocation } from '@/lib/warehouses-data';
import { t, type Locale } from '@/lib/i18n';
import { SELECTED_WAREHOUSE_STORAGE_KEY } from '@/lib/storage-keys';
import SplitPanelLayout from '../_components/SplitPanelLayout';
import styles from './Warehouses.module.scss';

const WarehouseMap = dynamic(() => import('./WarehouseMap'), {
  ssr: false,
  loading: () => (
    <div className="spinner-border" role="status">
      <span className="visually-hidden" />
    </div>
  ),
});

interface WarehousesViewProps {
  warehouses: WarehouseLocation[];
  lang: Locale;
}

export default function WarehousesView({
  warehouses,
  lang,
}: WarehousesViewProps): React.JSX.Element {
  const [selectedId, setSelectedId] = useLocalStorageValue<number | null>(
    SELECTED_WAREHOUSE_STORAGE_KEY,
    null,
  );
  const selectedWarehouse = warehouses.find((warehouse) => warehouse.id === selectedId) ?? null;

  useEscapeToClose([{ isOpen: selectedId !== null, onDismiss: () => setSelectedId(null) }]);

  return (
    <div className={styles.warehouses}>
      <h1 className={styles.warehouses__title}>
        <i className="bi bi-geo-alt me-2" aria-hidden="true" />
        {t('warehouses.title', lang)}{' '}
        <span className={styles['warehouses__title-count']}>/ {warehouses.length}</span>
      </h1>

      <SplitPanelLayout
        list={
          <ul className={styles.warehouses__list}>
            {warehouses.map((warehouse) => (
              <li
                key={warehouse.id}
                className={`${styles.warehouses__row} ${
                  selectedId === warehouse.id ? styles['warehouses__row--active'] : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(warehouse.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    event.preventDefault();
                    setSelectedId(warehouse.id);
                  }
                }}
              >
                <span className={styles['warehouses__row-name']}>{warehouse.name[lang]}</span>
                <span className={styles['warehouses__row-address']}>
                  <i className="bi bi-signpost" aria-hidden="true" />
                  {warehouse.address[lang]}
                </span>
              </li>
            ))}
          </ul>
        }
        panel={
          selectedWarehouse ? (
            <div key={selectedWarehouse.id} className={styles.warehouses__panel}>
              <button
                type="button"
                className={styles['warehouses__panel-close']}
                onClick={() => setSelectedId(null)}
                aria-label={t('common.close', lang)}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>

              <h2 className={styles['warehouses__panel-title']}>{selectedWarehouse.name[lang]}</h2>
              <p className={styles['warehouses__panel-address']}>
                <i className="bi bi-signpost me-1" aria-hidden="true" />
                {selectedWarehouse.address[lang]}
              </p>

              <p className={styles['warehouses__panel-map-label']}>{t('warehouses.map', lang)}</p>
              <div className={styles['warehouses__panel-map']}>
                <WarehouseMap warehouse={selectedWarehouse} lang={lang} />
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}
