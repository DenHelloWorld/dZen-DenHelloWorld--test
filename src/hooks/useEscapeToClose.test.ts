import { renderHook } from '@testing-library/react';
import { useEscapeToClose } from './useEscapeToClose';

describe('useEscapeToClose', () => {
  it('calls onDismiss on the first open layer when Escape is pressed', () => {
    const onDismiss1 = jest.fn();
    const onDismiss2 = jest.fn();
    const layers = [
      { isOpen: false, onDismiss: onDismiss1 },
      { isOpen: true, onDismiss: onDismiss2 },
    ];

    renderHook(() => useEscapeToClose(layers));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(onDismiss1).not.toHaveBeenCalled();
    expect(onDismiss2).toHaveBeenCalledTimes(1);
  });

  it('does nothing when no layer is open', () => {
    const onDismiss = jest.fn();
    renderHook(() => useEscapeToClose([{ isOpen: false, onDismiss }]));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores non-Escape keys', () => {
    const onDismiss = jest.fn();
    renderHook(() => useEscapeToClose([{ isOpen: true, onDismiss }]));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('picks the first open layer (most-specific-first)', () => {
    const firstDismiss = jest.fn();
    const secondDismiss = jest.fn();
    const layers = [
      { isOpen: true, onDismiss: firstDismiss },
      { isOpen: true, onDismiss: secondDismiss },
    ];

    renderHook(() => useEscapeToClose(layers));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(firstDismiss).toHaveBeenCalledTimes(1);
    expect(secondDismiss).not.toHaveBeenCalled();
  });

  it('removes the event listener on unmount', () => {
    const onDismiss = jest.fn();
    const { unmount } = renderHook(() => useEscapeToClose([{ isOpen: true, onDismiss }]));
    unmount();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
