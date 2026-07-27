import type { Prisma } from '@/generated/prisma/client';

export interface CurrencyTotal {
  symbol: string;
  value: number;
}

type ProductWithPrices = Prisma.productsGetPayload<{ include: { prices: true } }>;

export function sumTotalsByCurrency(products: ProductWithPrices[]): CurrencyTotal[] {
  const totals = new Map<string, number>();

  for (const product of products) {
    for (const price of product.prices) {
      totals.set(price.symbol, (totals.get(price.symbol) ?? 0) + price.value.toNumber());
    }
  }

  return Array.from(totals, ([symbol, value]) => ({ symbol, value }));
}
