'use client';

import { usePathname } from 'next/navigation';
import styles from './PageTransition.module.scss';

export default function PageTransition({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div key={pathname} className={styles['page-transition']}>
      {children}
    </div>
  );
}
