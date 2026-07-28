import Sidebar from './_components/Sidebar';
import TopMenu from './_components/TopMenu';
import PageTransition from './_components/PageTransition';
import styles from './layout.module.scss';

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <div className={styles['app-layout']}>
      <TopMenu />
      <div className={styles['app-layout__body']}>
        <Sidebar />
        <main className={styles['app-layout__content']}>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
