export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
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
