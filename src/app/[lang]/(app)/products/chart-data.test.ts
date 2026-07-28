import { buildProductTypeStats } from './chart-data';
import type { ProductListItem } from '@/store/api';

function makeProduct(
  overrides: Partial<ProductListItem> & {
    type: string;
    prices?: { symbol: string; value: number }[];
  },
): ProductListItem {
  return {
    id: 1,
    title: 'Test',
    serialNumber: null,
    isNew: true,
    photo: null,
    specification: null,
    guaranteeStart: null,
    guaranteeEnd: null,
    orderTitle: 'Order',
    ...overrides,
    prices: overrides.prices ?? [{ symbol: 'USD', value: 100, isDefault: true }],
  };
}

describe('buildProductTypeStats', () => {
  it('groups a single product by type', () => {
    const products = [
      makeProduct({ type: 'TV', prices: [{ symbol: 'USD', value: 200, isDefault: true }] }),
    ];
    const stats = buildProductTypeStats(products);
    expect(stats).toEqual([{ type: 'TV', count: 1, avgPriceUsd: 200 }]);
  });

  it('groups multiple products of the same type', () => {
    const products = [
      makeProduct({ type: 'TV', prices: [{ symbol: 'USD', value: 100, isDefault: true }] }),
      makeProduct({ type: 'TV', prices: [{ symbol: 'USD', value: 200, isDefault: true }] }),
    ];
    const stats = buildProductTypeStats(products);
    expect(stats).toEqual([{ type: 'TV', count: 2, avgPriceUsd: 150 }]);
  });

  it('separates different types', () => {
    const products = [
      makeProduct({ id: 1, type: 'TV', prices: [{ symbol: 'USD', value: 100, isDefault: true }] }),
      makeProduct({
        id: 2,
        type: 'Laptop',
        prices: [{ symbol: 'USD', value: 1000, isDefault: true }],
      }),
    ];
    const stats = buildProductTypeStats(products);
    expect(stats).toHaveLength(2);
    expect(stats.find((s) => s.type === 'TV')).toEqual({ type: 'TV', count: 1, avgPriceUsd: 100 });
    expect(stats.find((s) => s.type === 'Laptop')).toEqual({
      type: 'Laptop',
      count: 1,
      avgPriceUsd: 1000,
    });
  });

  it('sorts by count descending', () => {
    const products = [
      makeProduct({ id: 1, type: 'A', prices: [{ symbol: 'USD', value: 10, isDefault: true }] }),
      makeProduct({ id: 2, type: 'B', prices: [{ symbol: 'USD', value: 10, isDefault: true }] }),
      makeProduct({ id: 3, type: 'B', prices: [{ symbol: 'USD', value: 10, isDefault: true }] }),
      makeProduct({ id: 4, type: 'C', prices: [{ symbol: 'USD', value: 10, isDefault: true }] }),
      makeProduct({ id: 5, type: 'C', prices: [{ symbol: 'USD', value: 10, isDefault: true }] }),
      makeProduct({ id: 6, type: 'C', prices: [{ symbol: 'USD', value: 10, isDefault: true }] }),
    ];
    const stats = buildProductTypeStats(products);
    expect(stats[0].type).toBe('C');
    expect(stats[1].type).toBe('B');
    expect(stats[2].type).toBe('A');
  });

  it('rounds avgPriceUsd to 2 decimal places', () => {
    const products = [
      makeProduct({ type: 'TV', prices: [{ symbol: 'USD', value: 100, isDefault: true }] }),
      makeProduct({ type: 'TV', prices: [{ symbol: 'USD', value: 33, isDefault: true }] }),
    ];
    const stats = buildProductTypeStats(products);
    expect(stats[0].avgPriceUsd).toBe(66.5);
  });

  it('treats missing USD price as 0', () => {
    const products = [
      makeProduct({ type: 'TV', prices: [{ symbol: 'UAH', value: 100, isDefault: true }] }),
    ];
    const stats = buildProductTypeStats(products);
    expect(stats).toEqual([{ type: 'TV', count: 1, avgPriceUsd: 0 }]);
  });

  it('returns an empty array for no products', () => {
    expect(buildProductTypeStats([])).toEqual([]);
  });
});
