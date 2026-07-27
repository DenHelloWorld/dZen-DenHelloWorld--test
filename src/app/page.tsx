import styles from './page.module.scss';

export default function Home(): React.JSX.Element {
  return (
    <main className={styles.home}>
      <h1>Orders &amp; Products</h1>
      <p className={styles.home__subtitle}>
        Scaffold in progress — Sidebar/TopMenu and routes land in the next steps.
      </p>
    </main>
  );
}
