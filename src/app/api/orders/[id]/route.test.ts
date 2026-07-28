/**
 * @jest-environment node
 */
import { GET, DELETE } from './route';

const mockFindUnique = jest.fn();
const mockDelete = jest.fn();
const mockSumTotals = jest.fn((..._args: unknown[]) => [{ symbol: 'USD', value: 100 }]);

jest.mock('@/lib/prisma', () => ({
  prisma: {
    orders: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
  },
}));

jest.mock('@/lib/order-currency', () => ({
  sumTotalsByCurrency: (...args: unknown[]) => mockSumTotals(...args),
}));

jest.mock('@/generated/prisma/client', () => {
  class MockPrismaError extends Error {
    code: string;
    constructor(message: string, { code }: { code: string; clientVersion: string }) {
      super(message);
      this.code = code;
      this.name = 'PrismaClientKnownRequestError';
    }
  }
  return { Prisma: { PrismaClientKnownRequestError: MockPrismaError } };
});

describe('GET /api/orders/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for invalid id', async () => {
    const res = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 for zero id', async () => {
    const res = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '0' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 when order not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const res = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res.status).toBe(404);
  });

  it('returns order detail', async () => {
    const now = new Date();
    mockFindUnique.mockResolvedValue({
      id: 1,
      title: 'Order 1',
      description: 'Desc',
      created_at: now,
      products: [
        {
          id: 10,
          title: 'P1',
          type: 'E',
          serial_number: 'S1',
          is_new: true,
          photo: null,
          specification: 'Spec',
          guarantee_start: new Date('2024-01-01'),
          guarantee_end: new Date('2025-01-01'),
          prices: [{ symbol: 'USD', value: { toNumber: () => 100 }, is_default: true }],
        },
      ],
    });
    const res = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe(1);
    expect(json.title).toBe('Order 1');
    expect(json.products).toHaveLength(1);
    expect(json.products[0].prices[0].value).toBe(100);
  });
});

describe('DELETE /api/orders/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for invalid id', async () => {
    const res = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 when order not found', async () => {
    const { Prisma } = await import('@/generated/prisma/client');
    mockDelete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '7.9.1',
      }),
    );
    const res = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res.status).toBe(404);
  });

  it('returns 200 on successful delete', async () => {
    mockDelete.mockResolvedValue({ id: 1 });
    const res = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('rethrows unknown errors', async () => {
    mockDelete.mockRejectedValue(new Error('DB error'));
    await expect(
      DELETE(new Request('http://localhost'), { params: Promise.resolve({ id: '1' }) }),
    ).rejects.toThrow('DB error');
  });
});
