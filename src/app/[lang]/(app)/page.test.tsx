import { render } from '@testing-library/react';
import AppIndexPage from './page';

const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('AppIndexPage', () => {
  it('redirects to /en/orders', async () => {
    try {
      render(await AppIndexPage({ params: Promise.resolve({ lang: 'en' }) }));
    } catch {
      // redirect throws
    }
    expect(mockRedirect).toHaveBeenCalledWith('/en/orders');
  });

  it('redirects to /ru/orders', async () => {
    try {
      render(await AppIndexPage({ params: Promise.resolve({ lang: 'ru' }) }));
    } catch {
      // redirect throws
    }
    expect(mockRedirect).toHaveBeenCalledWith('/ru/orders');
  });
});
