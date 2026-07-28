import { formatCurrency, formatDateLong, formatDateShort } from './format';

describe('formatDateShort', () => {
  it('formats as day.month for the ru locale', () => {
    expect(formatDateShort('2026-03-05T00:00:00.000Z', 'ru')).toBe('05.03');
  });

  it('formats as day/month for the en locale', () => {
    expect(formatDateShort('2026-03-05T00:00:00.000Z', 'en')).toBe('05/03');
  });

  it('defaults to the en locale when none is given', () => {
    expect(formatDateShort('2026-03-05T00:00:00.000Z')).toBe('05/03');
  });
});

describe('formatDateLong', () => {
  it('formats a full date for the ru locale', () => {
    expect(formatDateLong('2026-03-05T00:00:00.000Z', 'ru')).toBe('05 мар. 2026 г.');
  });

  it('formats a full date for the en locale', () => {
    expect(formatDateLong('2026-03-05T00:00:00.000Z', 'en')).toBe('Mar 05, 2026');
  });
});

describe('formatCurrency', () => {
  it('renders USD with a leading dollar sign and 2 decimals', () => {
    expect(formatCurrency(125, 'USD')).toBe('$125.00');
  });

  it('renders other currencies with a trailing symbol', () => {
    expect(formatCurrency(3250, 'UAH')).toBe('3250.00 UAH');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(100.456, 'USD')).toBe('$100.46');
  });
});
