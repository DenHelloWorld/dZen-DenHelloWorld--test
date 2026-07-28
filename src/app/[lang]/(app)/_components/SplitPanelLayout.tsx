'use client';

import type { ReactNode } from 'react';
import styles from './SplitPanelLayout.module.scss';

interface SplitPanelLayoutProps {
  list: ReactNode;
  panel: ReactNode | null;
}

/**
 * Shared list+detail-panel shell for Orders/Products/Warehouses/Groups: the
 * gap between the two only appears once the panel is actually open — a flex
 * `gap` reserves space even for a zero-width sibling, so it must toggle in
 * step with the panel's own width transition instead of being constant.
 */
export default function SplitPanelLayout({
  list,
  panel,
}: SplitPanelLayoutProps): React.JSX.Element {
  const isOpen = panel !== null;

  return (
    <div className={`${styles.layout} ${isOpen ? styles['layout--panel-open'] : ''}`}>
      {list}
      <div className={`${styles['panel-wrap']} ${isOpen ? styles['panel-wrap--open'] : ''}`}>
        {panel}
      </div>
    </div>
  );
}
