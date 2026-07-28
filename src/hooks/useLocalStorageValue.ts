'use client';

import { useSyncExternalStore } from 'react';

function eventNameFor(key: string): string {
  return `local-storage-change:${key}`;
}

/**
 * Persists a JSON-serializable value under a localStorage key and keeps
 * every consumer of that key in sync — across tabs via the native `storage`
 * event, and within the same tab via a custom event (localStorage writes
 * don't emit `storage` in the writing tab). `getServerSnapshot` always
 * returns `fallback`, so SSR output matches the pre-hydration client render;
 * the real value applies in the client-only re-render React schedules right
 * after.
 */
export function useLocalStorageValue<T>(key: string, fallback: T): [T, (value: T | null) => void] {
  const eventName = eventNameFor(key);

  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener(eventName, callback);
      window.addEventListener('storage', callback);
      return () => {
        window.removeEventListener(eventName, callback);
        window.removeEventListener('storage', callback);
      };
    },
    () => {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    () => fallback,
  );

  const setValue = (next: T | null): void => {
    if (next === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(next));
    }
    window.dispatchEvent(new Event(eventName));
  };

  return [value, setValue];
}
