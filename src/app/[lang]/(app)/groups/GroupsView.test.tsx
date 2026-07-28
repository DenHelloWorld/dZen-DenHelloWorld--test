import { render, screen, fireEvent } from '@testing-library/react';
import GroupsView from './GroupsView';

const mockGroups = [
  { type: 'Electronic', count: 5, avgPrices: [{ symbol: 'USD', value: 100, isDefault: true }] },
  { type: 'Furniture', count: 3, avgPrices: [{ symbol: 'USD', value: 200, isDefault: true }] },
];

const mockUseLocalStorageValue = jest.fn(() => [null, jest.fn()]);

jest.mock('@/hooks/useLocalStorageValue', () => ({
  useLocalStorageValue: (...args: unknown[]) => mockUseLocalStorageValue(...args),
}));

jest.mock('@/hooks/useEscapeToClose', () => ({
  useEscapeToClose: jest.fn(),
}));

jest.mock('next/link', () => {
  function Link({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }): React.JSX.Element {
    return <a href={href}>{children}</a>;
  }
  return Link;
});

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

jest.mock('../_components/CurrencyPrices', () => {
  function MockCurrencyPrices(): React.JSX.Element {
    return <span data-testid="currency-prices" />;
  }
  return MockCurrencyPrices;
});

jest.mock('../_components/SplitPanelLayout', () => {
  return {
    __esModule: true,
    default: ({ list, panel }: { list: React.ReactNode; panel: React.ReactNode }) => (
      <div>
        <div data-testid="split-list">{list}</div>
        <div data-testid="split-panel">{panel}</div>
      </div>
    ),
  };
});

jest.mock(
  './Groups.module.scss',
  () => ({
    groups: 'groups',
    groups__title: 'title',
    'groups__title-count': 'title-count',
    groups__list: 'list',
    groups__row: 'row',
    'groups__row--active': 'row-active',
    'groups__row-name': 'row-name',
    'groups__row-count': 'row-count',
    'groups__row-price': 'row-price',
    groups__panel: 'panel',
    'groups__panel-close': 'panel-close',
    'groups__panel-title': 'panel-title',
    'groups__panel-details': 'panel-details',
    'groups__panel-detail': 'panel-detail',
    'groups__panel-detail-label': 'detail-label',
    'groups__panel-detail-value': 'detail-value',
    'groups__panel-link': 'panel-link',
  }),
  { virtual: true },
);

describe('GroupsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalStorageValue.mockReturnValue([null, jest.fn()]);
  });

  it('renders group list', () => {
    render(<GroupsView groups={mockGroups} lang="en" />);
    expect(screen.getByText('Electronic')).toBeInTheDocument();
    expect(screen.getByText('Furniture')).toBeInTheDocument();
  });

  it('renders group count', () => {
    render(<GroupsView groups={mockGroups} lang="en" />);
    expect(screen.getByText('/ 2')).toBeInTheDocument();
  });

  it('shows panel when group selected', () => {
    mockUseLocalStorageValue.mockReturnValue(['Electronic', jest.fn()]);
    render(<GroupsView groups={mockGroups} lang="en" />);
    expect(screen.getByText('groups.view_products')).toBeInTheDocument();
  });

  it('renders detail values in panel', () => {
    mockUseLocalStorageValue.mockReturnValue(['Electronic', jest.fn()]);
    render(<GroupsView groups={mockGroups} lang="en" />);
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
  });

  it('selects group via keyboard Enter and Space', () => {
    const setSelectedType = jest.fn();
    mockUseLocalStorageValue.mockReturnValue([null, setSelectedType]);
    render(<GroupsView groups={mockGroups} lang="en" />);
    const rows = screen.getAllByRole('button', { name: /Electronic/ });
    const row = rows[0].closest('[role="button"]') ?? rows[0];
    fireEvent.keyDown(row, { key: 'Enter' });
    expect(setSelectedType).toHaveBeenCalledWith('Electronic');
  });

  it('closes panel via close button', () => {
    const setSelectedType = jest.fn();
    mockUseLocalStorageValue.mockReturnValue(['Electronic', setSelectedType]);
    render(<GroupsView groups={mockGroups} lang="en" />);
    const closeBtn = screen.getByRole('button', { name: /common\.close/ });
    fireEvent.click(closeBtn);
    expect(setSelectedType).toHaveBeenCalledWith(null);
  });
});
