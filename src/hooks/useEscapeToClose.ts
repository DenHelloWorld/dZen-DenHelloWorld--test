'use client';

import { useEffect } from 'react';

interface DismissibleLayer {
  isOpen: boolean;
  onDismiss: () => void;
}

/**
 * Closes the first open layer on Escape. Pass layers most-specific-first
 * (e.g. a confirm modal before the panel it's nested inside of) so Escape
 * dismisses one thing at a time instead of everything at once.
 */
export function useEscapeToClose(layers: DismissibleLayer[]): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') {
        return;
      }

      const topLayer = layers.find((layer) => layer.isOpen);
      topLayer?.onDismiss();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });
}
