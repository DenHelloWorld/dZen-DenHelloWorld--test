/**
 * @jest-environment node
 */
import { POST } from './route';

const mockFindUnique = jest.fn();
const mockCompare = jest.fn();
const mockSignToken = jest.fn((..._args: unknown[]) => 'signed-token');

jest.mock('@/lib/prisma', () => ({
  prisma: { users: { findUnique: (...args: unknown[]) => mockFindUnique(...args) } },
}));

jest.mock('bcryptjs', () => ({
  compare: (...args: unknown[]) => mockCompare(...args),
}));

jest.mock('@/lib/jwt', () => ({
  signSessionToken: (...args: unknown[]) => mockSignToken(...args),
  getSessionCookieOptions: jest.fn(() => ({
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 7200,
  })),
  SESSION_COOKIE_NAME: 'session',
}));

function mockRequest(body: unknown): Request {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when username is missing', async () => {
    const res = await POST(mockRequest({ password: 'demo' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Username and password are required');
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(mockRequest({ username: 'demo' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when body is not JSON', async () => {
    const req = new Request('http://localhost/api/auth/login', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 401 when user not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const res = await POST(mockRequest({ username: 'demo', password: 'demo' }));
    expect(res.status).toBe(401);
  });

  it('returns 401 when password is wrong', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, username: 'demo', password_hash: 'hash' });
    mockCompare.mockResolvedValue(false);
    const res = await POST(mockRequest({ username: 'demo', password: 'wrong' }));
    expect(res.status).toBe(401);
  });

  it('returns 200 and sets cookie on success', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, username: 'demo', password_hash: 'hash' });
    mockCompare.mockResolvedValue(true);
    const res = await POST(mockRequest({ username: 'demo', password: 'demo' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.username).toBe('demo');
  });
});
