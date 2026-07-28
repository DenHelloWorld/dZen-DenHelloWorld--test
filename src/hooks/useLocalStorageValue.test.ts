import { renderHook, act } from '@testing-library/react';
import { useLocalStorageValue } from './useLocalStorageValue';

// Mock useSyncExternalStore to avoid React 19 strict snapshot caching warnings
jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useSyncExternalStore: (
      subscribe: (cb: () => void) => () => void,
      getSnapshot: () => unknown,
      getServerSnapshot?: () => unknown,
    ) => {
      try {
        return getSnapshot();
      } catch {
        return getServerSnapshot?.();
      }
    },
  };
});

describe('useLocalStorageValue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the fallback when localStorage has no value', () => {
    const { result } = renderHook(() => useLocalStorageValue('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns the parsed value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorageValue('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('returns the fallback when localStorage has invalid JSON', () => {
    localStorage.setItem('test-key', '{invalid');
    const { result } = renderHook(() => useLocalStorageValue('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('stores a JSON-stringified value via setValue', () => {
    const { result } = renderHook(() => useLocalStorageValue('test-key', ''));
    act(() => {
      result.current[1]('new-value');
    });
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('removes the key when setValue is called with null', () => {
    localStorage.setItem('test-key', JSON.stringify('value'));
    const { result } = renderHook(() => useLocalStorageValue('test-key', ''));
    act(() => {
      result.current[1](null);
    });
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('stores objects correctly', () => {
    const obj = { a: 1, b: 'hello' };
    const { result } = renderHook(() =>
      useLocalStorageValue<{ a: number; b: string } | null>('obj-key', null),
    );
    act(() => {
      result.current[1](obj);
    });
    expect(JSON.parse(localStorage.getItem('obj-key')!)).toEqual(obj);
  });

  it('dispatches a custom event on setValue', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    const { result } = renderHook(() => useLocalStorageValue('ev-key', ''));
    act(() => {
      result.current[1]('val');
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'local-storage-change:ev-key' }),
    );
  });
});
