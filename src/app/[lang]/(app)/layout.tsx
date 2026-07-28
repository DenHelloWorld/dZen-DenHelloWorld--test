import Sidebar from './_components/Sidebar';
import TopMenu from './_components/TopMenu';
import PageTransition from './_components/PageTransition';
import type { Locale } from '@/lib/i18n';
import styles from './layout.module.scss';

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const locale = lang as Locale;
  return (
    <div className={styles['app-layout']}>
      <TopMenu lang={locale} />
      <div className={styles['app-layout__body']}>
        <Sidebar lang={locale} />
        <main className={styles['app-layout__content']}>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
