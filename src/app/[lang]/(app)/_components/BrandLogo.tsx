import styles from './BrandLogo.module.scss';

export default function BrandLogo(): React.JSX.Element {
  return (
    <span className={styles.brand}>
      <i className={`bi bi-shield-fill-check ${styles.brand__icon}`} aria-hidden="true" />
      <span>INVENTORY</span>
    </span>
  );
}
