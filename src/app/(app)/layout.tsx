import Sidebar from './_components/Sidebar';
import TopMenu from './_components/TopMenu';
import styles from './layout.module.scss';

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <div className={styles['app-layout']}>
      <TopMenu />
      <div className={styles['app-layout__body']}>
        <Sidebar />
        <main className={styles['app-layout__content']}>{children}</main>
      </div>
    </div>
  );
}
