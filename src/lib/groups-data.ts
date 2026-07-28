import { prisma } from '@/lib/prisma';

export interface GroupAvgPrice {
  symbol: string;
  value: number;
}

export interface ProductGroup {
  type: string;
  count: number;
  avgPrices: GroupAvgPrice[];
}

export async function fetchProductGroups(): Promise<ProductGroup[]> {
  const products = await prisma.products.findMany({
    select: {
      type: true,
      prices: { select: { value: true, symbol: true } },
    },
  });

  const byType = new Map<string, { count: number; totals: Map<string, number> }>();

  for (const product of products) {
    const entry = byType.get(product.type) ?? { count: 0, totals: new Map<string, number>() };
    entry.count += 1;
    for (const price of product.prices) {
      const total = entry.totals.get(price.symbol) ?? 0;
      entry.totals.set(price.symbol, total + price.value.toNumber());
    }
    byType.set(product.type, entry);
  }

  return Array.from(byType.entries())
    .map(([type, { count, totals }]) => ({
      type,
      count,
      avgPrices: Array.from(totals.entries()).map(([symbol, total]) => ({
        symbol,
        value: total / count,
      })),
    }))
    .sort((a, b) => b.count - a.count);
}
