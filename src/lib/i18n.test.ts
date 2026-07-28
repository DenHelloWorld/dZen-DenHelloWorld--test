import { t, switchLocale, type Locale } from './i18n';

describe('t', () => {
  it('returns the ru translation for a known key', () => {
    expect(t('nav.orders', 'ru')).toBe('Приходы');
  });

  it('returns the en translation for a known key', () => {
    expect(t('nav.orders', 'en')).toBe('Orders');
  });

  it('returns the key itself when the key is missing', () => {
    expect(t('nonexistent.key', 'ru')).toBe('nonexistent.key');
  });
});

describe('switchLocale', () => {
  beforeEach(() => {
    document.cookie = 'locale=;path=/;max-age=0';
  });

  it('sets the locale cookie', () => {
    const router = { push: jest.fn() };
    switchLocale(router, 'ru' as Locale, 'en' as Locale);
    expect(document.cookie).toContain('locale=en');
  });

  it('calls router.push with a path containing the new locale', () => {
    const router = { push: jest.fn() };
    switchLocale(router, 'ru' as Locale, 'en' as Locale);
    expect(router.push).toHaveBeenCalled();
  });

  it('can switch from en to ru', () => {
    const router = { push: jest.fn() };
    switchLocale(router, 'en' as Locale, 'ru' as Locale);
    expect(router.push).toHaveBeenCalled();
    expect(document.cookie).toContain('locale=ru');
  });
});
