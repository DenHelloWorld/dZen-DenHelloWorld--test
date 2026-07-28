import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

jest.mock('@/store/Providers', () => {
  function MockProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <div data-testid="providers">{children}</div>;
  }
  return MockProviders;
});

describe('RootLayout', () => {
  it('renders providers with children', async () => {
    const el = await RootLayout({
      children: <span>content</span>,
      params: Promise.resolve({ lang: 'en' }),
    });
    render(el);
    expect(screen.getByTestId('providers')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('sets lang attribute', async () => {
    const el = await RootLayout({ children: null, params: Promise.resolve({ lang: 'ru' }) });
    render(el);
    expect(document.documentElement).toHaveAttribute('lang', 'ru');
  });
});
