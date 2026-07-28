import { formatCurrency } from '@/lib/format';

interface CurrencyPricesProps {
  prices: { symbol: string; value: number }[];
}

export default function CurrencyPrices({ prices }: CurrencyPricesProps): React.JSX.Element {
  return (
    <>
      {prices.map((price) => (
        <span key={price.symbol}>{formatCurrency(price.value, price.symbol)}</span>
      ))}
    </>
  );
}
