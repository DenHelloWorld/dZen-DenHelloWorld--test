import { render, screen } from '@testing-library/react';
import AppLayout from './layout';

jest.mock('./_components/TopMenu', () => {
  function MockTopMenu(): React.JSX.Element {
    return <div data-testid="top-menu" />;
  }
  return MockTopMenu;
});
jest.mock('./_components/Sidebar', () => {
  function MockSidebar(): React.JSX.Element {
    return <div data-testid="sidebar" />;
  }
  return MockSidebar;
});
jest.mock('./_components/PageTransition', () => {
  function MockPageTransition({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <div data-testid="page-transition">{children}</div>;
  }
  return MockPageTransition;
});

jest.mock(
  './layout.module.scss',
  () => ({
    'app-layout': 'app-layout',
    'app-layout__body': 'body',
    'app-layout__content': 'content',
  }),
  { virtual: true },
);

describe('AppLayout', () => {
  it('renders TopMenu, Sidebar, and PageTransition', async () => {
    const el = await AppLayout({
      children: <span>page</span>,
      params: Promise.resolve({ lang: 'en' }),
    });
    render(el);
    expect(screen.getByTestId('top-menu')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('page-transition')).toBeInTheDocument();
  });

  it('passes children through PageTransition', async () => {
    const el = await AppLayout({
      children: <span>hello</span>,
      params: Promise.resolve({ lang: 'en' }),
    });
    render(el);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
