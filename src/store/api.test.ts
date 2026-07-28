/**
 * @jest-environment node
 */
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

/**
 * fetchBaseQuery's baseUrl ('/api') is relative, which real browsers and jsdom
 * resolve against the page origin — but Node's native Request has no such
 * context and rejects relative URLs outright. Resolving against a fixed
 * origin before delegating to the real Request class keeps everything else
 * (Headers, Response, fetch semantics) spec-accurate with zero hand-rolled
 * polyfill.
 */
class TestRequest extends Request {
  constructor(input: string | URL | Request, init?: RequestInit) {
    const resolved =
      typeof input === 'string' && input.startsWith('/') ? `http://localhost${input}` : input;
    super(resolved, init);
  }
}

beforeEach(() => {
  global.Request = TestRequest as unknown as typeof Request;
  global.fetch = jest.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    const isList = /\/api\/(orders|products)$/.test(url);
    const body = isList ? '[]' : JSON.stringify({ success: true });
    return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } });
  }) as jest.Mock;
});

describe('api', () => {
  it('has the correct reducerPath', () => {
    expect(api.reducerPath).toBe('api');
  });

  it('defines all expected endpoints', () => {
    expect(Object.keys(api.endpoints).sort()).toEqual([
      'deleteOrder',
      'deleteProduct',
      'getOrder',
      'getOrders',
      'getProducts',
      'login',
    ]);
  });

  it('exposes hooks for all endpoints', () => {
    expect(typeof api.endpoints.login.useMutation).toBe('function');
    expect(typeof api.endpoints.deleteOrder.useMutation).toBe('function');
    expect(typeof api.endpoints.deleteProduct.useMutation).toBe('function');
    expect(typeof api.endpoints.getOrders.useQuery).toBe('function');
    expect(typeof api.endpoints.getOrder.useQuery).toBe('function');
    expect(typeof api.endpoints.getProducts.useQuery).toBe('function');
  });

  it('executes login endpoint', async () => {
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (gdm) => gdm().concat(api.middleware),
    });
    const result = await store.dispatch(
      api.endpoints.login.initiate({ username: 'demo', password: 'demo' }),
    );
    expect(result.data).toEqual({ success: true });
  });

  it('executes getOrders endpoint', async () => {
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (gdm) => gdm().concat(api.middleware),
    });
    const result = await store.dispatch(api.endpoints.getOrders.initiate());
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('executes getOrder endpoint', async () => {
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (gdm) => gdm().concat(api.middleware),
    });
    const result = await store.dispatch(api.endpoints.getOrder.initiate(42));
    expect(result.data).toEqual({ success: true });
  });

  it('executes deleteOrder endpoint', async () => {
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (gdm) => gdm().concat(api.middleware),
    });
    const result = await store.dispatch(api.endpoints.deleteOrder.initiate(1));
    expect(result.data).toEqual({ success: true });
  });

  it('executes getProducts endpoint', async () => {
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (gdm) => gdm().concat(api.middleware),
    });
    const result = await store.dispatch(api.endpoints.getProducts.initiate(undefined));
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('executes deleteProduct endpoint', async () => {
    const store = configureStore({
      reducer: { [api.reducerPath]: api.reducer },
      middleware: (gdm) => gdm().concat(api.middleware),
    });
    const result = await store.dispatch(api.endpoints.deleteProduct.initiate(5));
    expect(result.data).toEqual({ success: true });
  });
});
