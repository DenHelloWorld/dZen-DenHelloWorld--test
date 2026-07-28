export function formatDateShort(iso: string, locale = 'en'): string {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function formatDateLong(iso: string, locale = 'en'): string {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(value: number, symbol: string): string {
  if (symbol === 'USD') {
    return `$${value.toFixed(2)}`;
  }
  return `${value.toFixed(2)} ${symbol}`;
}
