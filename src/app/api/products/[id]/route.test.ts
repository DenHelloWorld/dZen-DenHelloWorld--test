/**
 * @jest-environment node
 */
import { DELETE } from './route';

const mockDelete = jest.fn();

jest.mock('@/lib/prisma', () => ({
  prisma: { products: { delete: (...args: unknown[]) => mockDelete(...args) } },
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

describe('DELETE /api/products/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for invalid id', async () => {
    const res = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 when product not found', async () => {
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
