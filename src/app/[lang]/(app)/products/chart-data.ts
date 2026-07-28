import type { ProductListItem } from '@/store/api';

export interface ProductTypeStat {
  type: string;
  count: number;
  avgPriceUsd: number;
}

export function buildProductTypeStats(products: ProductListItem[]): ProductTypeStat[] {
  const byType = new Map<string, { count: number; usdTotal: number }>();

  for (const product of products) {
    const entry = byType.get(product.type) ?? { count: 0, usdTotal: 0 };
    entry.count += 1;
    const usdPrice = product.prices.find((price) => price.symbol === 'USD');
    entry.usdTotal += usdPrice?.value ?? 0;
    byType.set(product.type, entry);
  }

  return Array.from(byType.entries())
    .map(([type, { count, usdTotal }]) => ({
      type,
      count,
      avgPriceUsd: Math.round((usdTotal / count) * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count);
}
