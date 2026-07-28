'use client';

import Link from 'next/link';
import { useEscapeToClose } from '@/hooks/useEscapeToClose';
import { useLocalStorageValue } from '@/hooks/useLocalStorageValue';
import type { ProductGroup } from '@/lib/groups-data';
import { t, type Locale } from '@/lib/i18n';
import { SELECTED_GROUP_STORAGE_KEY } from '@/lib/storage-keys';
import CurrencyPrices from '../_components/CurrencyPrices';
import SplitPanelLayout from '../_components/SplitPanelLayout';
import styles from './Groups.module.scss';

interface GroupsViewProps {
  groups: ProductGroup[];
  lang: Locale;
}

export default function GroupsView({ groups, lang }: GroupsViewProps): React.JSX.Element {
  const [selectedType, setSelectedType] = useLocalStorageValue<string | null>(
    SELECTED_GROUP_STORAGE_KEY,
    null,
  );
  const selectedGroup = groups.find((group) => group.type === selectedType) ?? null;

  useEscapeToClose([{ isOpen: selectedType !== null, onDismiss: () => setSelectedType(null) }]);

  return (
    <div className={styles.groups}>
      <h1 className={styles.groups__title}>
        <i className="bi bi-diagram-3 me-2" aria-hidden="true" />
        {t('groups.title', lang)}{' '}
        <span className={styles['groups__title-count']}>/ {groups.length}</span>
      </h1>

      <SplitPanelLayout
        list={
          <ul className={styles.groups__list}>
            {groups.map((group) => (
              <li
                key={group.type}
                className={`${styles.groups__row} ${
                  selectedType === group.type ? styles['groups__row--active'] : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedType(group.type)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    event.preventDefault();
                    setSelectedType(group.type);
                  }
                }}
              >
                <span className={styles['groups__row-name']}>{group.type}</span>
                <span className={styles['groups__row-count']}>
                  <i className="bi bi-box-seam" aria-hidden="true" />
                  {group.count}
                </span>
                <span className={styles['groups__row-price']}>
                  <CurrencyPrices prices={group.avgPrices} />
                </span>
              </li>
            ))}
          </ul>
        }
        panel={
          selectedGroup ? (
            <div key={selectedGroup.type} className={styles.groups__panel}>
              <button
                type="button"
                className={styles['groups__panel-close']}
                onClick={() => setSelectedType(null)}
                aria-label={t('common.close', lang)}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>

              <h2 className={styles['groups__panel-title']}>{selectedGroup.type}</h2>

              <dl className={styles['groups__panel-details']}>
                <div className={styles['groups__panel-detail']}>
                  <dt className={styles['groups__panel-detail-label']}>
                    {t('groups.count', lang)}
                  </dt>
                  <dd className={styles['groups__panel-detail-value']}>{selectedGroup.count}</dd>
                </div>
                <div className={styles['groups__panel-detail']}>
                  <dt className={styles['groups__panel-detail-label']}>
                    {t('groups.avg_price', lang)}
                  </dt>
                  <dd className={`${styles['groups__panel-detail-value']} d-flex flex-column`}>
                    <CurrencyPrices prices={selectedGroup.avgPrices} />
                  </dd>
                </div>
              </dl>

              <Link
                href={`/${lang}/products?type=${encodeURIComponent(selectedGroup.type)}`}
                className={styles['groups__panel-link']}
              >
                {t('groups.view_products', lang)}
                <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
              </Link>
            </div>
          ) : null
        }
      />
    </div>
  );
}
