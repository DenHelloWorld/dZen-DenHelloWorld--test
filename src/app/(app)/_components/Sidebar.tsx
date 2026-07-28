'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/orders', label: 'Orders', icon: 'bi-receipt' },
  { href: '/groups', label: 'Groups', icon: 'bi-diagram-3' },
  { href: '/products', label: 'Products', icon: 'bi-box-seam' },
  { href: '/users', label: 'Users', icon: 'bi-people' },
  { href: '/settings', label: 'Settings', icon: 'bi-gear' },
];

export default function Sidebar(): React.JSX.Element {
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
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.sidebar__link} ${isActive ? styles['sidebar__link--active'] : ''}`}
            >
              <i className={`bi ${item.icon} ${styles['sidebar__link-icon']}`} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
