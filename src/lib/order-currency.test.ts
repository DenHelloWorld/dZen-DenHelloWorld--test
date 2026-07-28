import { sumTotalsByCurrency } from './order-currency';
import type { Prisma } from '@/generated/prisma/client';

type ProductWithPrices = Prisma.productsGetPayload<{ include: { prices: true } }>;

function mockDecimal(value: number): Prisma.Decimal {
  return { toNumber: () => value } as unknown as Prisma.Decimal;
}

function makeProduct(
  overrides: Omit<Partial<ProductWithPrices>, 'prices'> & {
    id?: number;
    prices: { symbol: string; value: number }[];
  },
): ProductWithPrices {
  return {
    id: 1,
    title: 'Test',
    serialNumber: null,
    isNew: true,
    photo: null,
    specification: null,
    guaranteeStart: null,
    guaranteeEnd: null,
    orderId: 1,
    type: 'TV',
    ...overrides,
    prices: overrides.prices.map((p) => ({
      id: 1,
      productId: 1,
      symbol: p.symbol,
      value: mockDecimal(p.value),
      isDefault: false,
      type: 'integer',
    })),
  } as unknown as ProductWithPrices;
}

describe('sumTotalsByCurrency', () => {
  it('sums prices for a single product', () => {
    const products = [
      makeProduct({
        prices: [
          { symbol: 'USD', value: 100 },
          { symbol: 'UAH', value: 4000 },
        ],
      }),
    ];
    expect(sumTotalsByCurrency(products)).toEqual([
      { symbol: 'USD', value: 100 },
      { symbol: 'UAH', value: 4000 },
    ]);
  });

  it('accumulates prices across multiple products', () => {
    const products = [
      makeProduct({ id: 1, prices: [{ symbol: 'USD', value: 100 }] }),
      makeProduct({ id: 2, prices: [{ symbol: 'USD', value: 50 }] }),
    ];
    expect(sumTotalsByCurrency(products)).toEqual([{ symbol: 'USD', value: 150 }]);
  });

  it('returns empty array for no products', () => {
    expect(sumTotalsByCurrency([])).toEqual([]);
  });

  it('handles multiple currencies across products', () => {
    const products = [
      makeProduct({
        id: 1,
        prices: [
          { symbol: 'USD', value: 100 },
          { symbol: 'UAH', value: 4000 },
        ],
      }),
      makeProduct({ id: 2, prices: [{ symbol: 'UAH', value: 500 }] }),
    ];
    const result = sumTotalsByCurrency(products);
    expect(result.find((r) => r.symbol === 'USD')).toEqual({ symbol: 'USD', value: 100 });
    expect(result.find((r) => r.symbol === 'UAH')).toEqual({ symbol: 'UAH', value: 4500 });
  });
});
