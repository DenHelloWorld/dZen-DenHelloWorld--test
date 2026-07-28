import { render } from '@testing-library/react';
import RootPage from './page';

const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('RootPage', () => {
  it('redirects to /ru', async () => {
    try {
      render(await RootPage());
    } catch {
      // redirect throws
    }
    expect(mockRedirect).toHaveBeenCalledWith('/ru');
  });
});
