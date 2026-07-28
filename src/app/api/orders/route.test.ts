/**
 * @jest-environment node
 */
import { GET } from './route';

const mockFetchOrdersList = jest.fn();

jest.mock('@/lib/orders-data', () => ({
  fetchOrdersList: (...args: unknown[]) => mockFetchOrdersList(...args),
}));

describe('GET /api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns orders list', async () => {
    const orders = [
      {
        id: 1,
        title: 'O1',
        productsCount: 3,
        createdAt: '2024-01-01T00:00:00Z',
        totals: [{ symbol: 'USD', value: 100 }],
      },
    ];
    mockFetchOrdersList.mockResolvedValue(orders);
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(orders);
  });

  it('returns empty array when no orders', async () => {
    mockFetchOrdersList.mockResolvedValue([]);
    const res = await GET();
    const json = await res.json();
    expect(json).toEqual([]);
  });
});
