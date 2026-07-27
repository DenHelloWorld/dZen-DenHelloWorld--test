'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/orders', label: 'Orders' },
  { href: '/groups', label: 'Groups' },
  { href: '/products', label: 'Products' },
  { href: '/users', label: 'Users' },
  { href: '/settings', label: 'Settings' },
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
