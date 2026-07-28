/**
 * @jest-environment node
 */
import { GET } from './route';

const mockFetchProductsList = jest.fn();

jest.mock('@/lib/products-data', () => ({
  fetchProductsList: (...args: unknown[]) => mockFetchProductsList(...args),
}));

describe('GET /api/products', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns products list', async () => {
    const products = [{ id: 1, title: 'P1', type: 'E' }];
    mockFetchProductsList.mockResolvedValue(products);
    const res = await GET(new Request('http://localhost/api/products'));
    const json = await res.json();
    expect(json).toEqual(products);
  });

  it('passes type filter param', async () => {
    mockFetchProductsList.mockResolvedValue([]);
    await GET(new Request('http://localhost/api/products?type=Electronic'));
    expect(mockFetchProductsList).toHaveBeenCalledWith('Electronic');
  });

  it('calls without type when no filter', async () => {
    mockFetchProductsList.mockResolvedValue([]);
    await GET(new Request('http://localhost/api/products'));
    expect(mockFetchProductsList).toHaveBeenCalledWith(undefined);
  });
});
