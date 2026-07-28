'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t, type Locale } from '@/lib/i18n';
import styles from './Sidebar.module.scss';

interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/orders', labelKey: 'nav.orders', icon: 'bi-receipt' },
  { href: '/groups', labelKey: 'nav.groups', icon: 'bi-diagram-3' },
  { href: '/products', labelKey: 'nav.products', icon: 'bi-box-seam' },
  { href: '/users', labelKey: 'nav.users', icon: 'bi-people' },
  { href: '/settings', labelKey: 'nav.settings', icon: 'bi-gear' },
];

export default function Sidebar({ lang }: { lang: Locale }): React.JSX.Element {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__avatar}>
        <i className={`bi bi-person-circle ${styles['sidebar__avatar-icon']}`} aria-hidden="true" />
        <span className={styles['sidebar__avatar-gear']}>
          <i className="bi bi-gear-fill" aria-hidden="true" />
        </span>
      </div>

      <nav className={styles.sidebar__nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(`/${lang}${item.href}`);
          return (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              className={`${styles.sidebar__link} ${isActive ? styles['sidebar__link--active'] : ''}`}
            >
              <i className={`bi ${item.icon} ${styles['sidebar__link-icon']}`} aria-hidden="true" />
              {t(item.labelKey, lang)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
