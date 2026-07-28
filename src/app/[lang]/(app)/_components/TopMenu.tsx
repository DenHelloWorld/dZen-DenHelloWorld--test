'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, type Socket } from 'socket.io-client';
import { t, type Locale } from '@/lib/i18n';
import BrandLogo from './BrandLogo';
import styles from './TopMenu.module.scss';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4001';

function formatWeekday(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long' });
}

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function TopMenu({ lang }: { lang: Locale }): React.JSX.Element {
  const [now, setNow] = useState<Date | null>(null);
  const [activeTabs, setActiveTabs] = useState<number | null>(null);
  const router = useRouter();

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

  const switchLocale = (newLocale: Locale): void => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    const pathname = window.location.pathname.replace(`/${lang}/`, `/${newLocale}/`);
    router.push(pathname);
  };

  return (
    <header className={styles['top-menu']}>
      <div className={styles['top-menu__brand']}>
        <BrandLogo />
      </div>

      <div className={styles['top-menu__status']}>
        <span className={styles['top-menu__counter']} title={t('topmenu.active_tabs', lang)}>
          <i className="bi bi-people-fill" aria-hidden="true" />
          {activeTabs ?? '—'}
        </span>

        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className={`btn btn-sm ${lang === 'ru' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => switchLocale('ru')}
          >
            RU
          </button>
          <button
            type="button"
            className={`btn btn-sm ${lang === 'en' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => switchLocale('en')}
          >
            EN
          </button>
        </div>

        {now ? (
          <div className={styles['top-menu__clock']}>
            <span className={styles['top-menu__weekday']}>{formatWeekday(now, lang)}</span>
            <span className={styles['top-menu__date']}>
              {formatDate(now, lang)}
              <i className="bi bi-clock" aria-hidden="true" />
              {formatTime(now)}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
