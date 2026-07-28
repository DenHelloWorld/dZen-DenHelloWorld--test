import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));
jest.mock('next/link', () => {
  function MockLink({
    children,
    href,
    className,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }): React.JSX.Element {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return MockLink;
});

jest.mock(
  './Sidebar.module.scss',
  () => ({
    sidebar: 'sidebar',
    sidebar__avatar: 'avatar',
    'sidebar__avatar-icon': 'avatar-icon',
    'sidebar__avatar-gear': 'avatar-gear',
    sidebar__nav: 'nav',
    sidebar__link: 'link',
    'sidebar__link--active': 'link-active',
    'sidebar__link-icon': 'link-icon',
  }),
  { virtual: true },
);

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/en/orders');
  });

  it('renders all nav items', () => {
    render(<Sidebar lang="en" />);
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Warehouses')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active link', () => {
    render(<Sidebar lang="en" />);
    const ordersLink = screen.getByText('Orders').closest('a');
    expect(ordersLink?.className).toContain('link-active');
  });

  it('does not highlight inactive links', () => {
    render(<Sidebar lang="en" />);
    const productsLink = screen.getByText('Products').closest('a');
    expect(productsLink?.className).not.toContain('link-active');
  });

  it('renders translated nav items for ru locale', () => {
    mockUsePathname.mockReturnValue('/ru/orders');
    render(<Sidebar lang="ru" />);
    expect(screen.getByText('Приходы')).toBeInTheDocument();
  });
});
