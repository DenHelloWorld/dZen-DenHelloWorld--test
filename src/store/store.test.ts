import { makeStore } from './store';

describe('makeStore', () => {
  it('creates a store with the api reducer', () => {
    const store = makeStore();
    expect(store.getState().api).toBeDefined();
  });

  it('returns a store with dispatch', () => {
    const store = makeStore();
    expect(typeof store.dispatch).toBe('function');
  });
});
