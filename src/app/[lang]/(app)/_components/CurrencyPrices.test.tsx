import { render, screen } from '@testing-library/react';
import CurrencyPrices from './CurrencyPrices';

describe('CurrencyPrices', () => {
  it('renders a single price', () => {
    render(<CurrencyPrices prices={[{ symbol: 'USD', value: 125 }]} />);
    expect(screen.getByText('$125.00')).toBeInTheDocument();
  });

  it('renders multiple prices', () => {
    render(
      <CurrencyPrices
        prices={[
          { symbol: 'USD', value: 125 },
          { symbol: 'UAH', value: 3250 },
        ]}
      />,
    );
    expect(screen.getByText('$125.00')).toBeInTheDocument();
    expect(screen.getByText('3250.00 UAH')).toBeInTheDocument();
  });

  it('renders nothing when prices array is empty', () => {
    const { container } = render(<CurrencyPrices prices={[]} />);
    expect(container.textContent).toBe('');
  });
});
