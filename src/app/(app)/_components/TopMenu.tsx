'use client';

import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import styles from './TopMenu.module.scss';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4001';

function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function TopMenu(): React.JSX.Element {
  const [now, setNow] = useState<Date | null>(null);
  const [activeTabs, setActiveTabs] = useState<number | null>(null);

  useEffect(() => {
    const tick = (): void => setNow(new Date());
    const timer = setInterval(tick, 1000);
    const seed = setTimeout(tick, 0);
    return () => {
      clearInterval(timer);
      clearTimeout(seed);
    };
  }, []);

  useEffect(() => {
    const socket: Socket = io(WS_URL);
    socket.on('active-tabs', (count: number) => setActiveTabs(count));
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <header className={styles['top-menu']}>
      <div className={styles['top-menu__brand']}>
        <i className="bi bi-shield-fill-check" aria-hidden="true" />
        <span>INVENTORY</span>
      </div>

      <div className={styles['top-menu__status']}>
        <span className={styles['top-menu__counter']} title="Active tabs">
          <i className="bi bi-people-fill" aria-hidden="true" />
          {activeTabs ?? '—'}
        </span>

        {now ? (
          <div className={styles['top-menu__clock']}>
            <span className={styles['top-menu__weekday']}>{formatWeekday(now)}</span>
            <span className={styles['top-menu__date']}>
              {formatDate(now)}
              <i className="bi bi-clock" aria-hidden="true" />
              {formatTime(now)}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
