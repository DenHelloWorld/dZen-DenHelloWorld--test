import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrdersView from './OrdersView';

const mockOrders = [
  {
    id: 1,
    title: 'Order #1',
    productsCount: 3,
    createdAt: '2024-01-15T00:00:00Z',
    totals: [{ symbol: 'USD', value: 100 }],
  },
  {
    id: 2,
    title: 'Order #2',
    productsCount: 1,
    createdAt: '2024-02-20T00:00:00Z',
    totals: [{ symbol: 'USD', value: 50 }],
  },
];

let mockQuery = { data: null, isLoading: false, error: null };
const mockDeleteTrigger = jest.fn(() => ({ data: { success: true } }));
const mockDeleteState = { isLoading: false, error: null, reset: jest.fn() };
const mockDeleteMutation = [mockDeleteTrigger, mockDeleteState];

const mockUseLocalStorageValue = jest.fn((..._args: unknown[]): [unknown, jest.Mock] => [
  null,
  jest.fn(),
]);

jest.mock('@/store/api', () => ({
  useGetOrdersQuery: jest.fn(() => mockQuery),
  useDeleteOrderMutation: jest.fn(() => mockDeleteMutation),
}));

jest.mock('@/hooks/useLocalStorageValue', () => ({
  useLocalStorageValue: (...args: unknown[]) => mockUseLocalStorageValue(...args),
}));

jest.mock('@/hooks/useEscapeToClose', () => ({
  useEscapeToClose: jest.fn(),
}));

jest.mock('@/lib/format', () => ({
  formatDateShort: jest.fn(() => '15/01'),
  formatDateLong: jest.fn(() => 'Jan 15, 2024'),
}));

jest.mock('@/lib/api-error', () => ({
  extractApiErrorMessage: jest.fn(() => 'Error message'),
}));

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

jest.mock('../_components/DeleteConfirmModal', () => {
  function MockDeleteConfirmModal({ onConfirm }: { onConfirm: () => void }): React.JSX.Element {
    return (
      <div data-testid="delete-confirm">
        <button data-testid="confirm-delete" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    );
  }
  return MockDeleteConfirmModal;
});
jest.mock('../_components/CurrencyPrices', () => {
  function MockCurrencyPrices(): React.JSX.Element {
    return <span data-testid="currency-prices" />;
  }
  return MockCurrencyPrices;
});

jest.mock('../_components/SplitPanelLayout', () => {
  function MockSplitPanelLayout({
    list,
    panel,
  }: {
    list: React.ReactNode;
    panel: React.ReactNode;
  }): React.JSX.Element {
    return (
      <div>
        <div data-testid="split-list">{list}</div>
        <div data-testid="split-panel">{panel}</div>
      </div>
    );
  }
  return { __esModule: true, default: MockSplitPanelLayout };
});

jest.mock('./OrderDetailPanel', () => {
  function MockOrderDetailPanel(): React.JSX.Element {
    return <div data-testid="order-detail" />;
  }
  return MockOrderDetailPanel;
});

jest.mock(
  './Orders.module.scss',
  () => ({
    orders: 'orders',
    orders__title: 'title',
    'orders__title-count': 'title-count',
    orders__list: 'list',
    orders__row: 'row',
    'orders__row--active': 'row-active',
    'orders__row-title': 'row-title',
    'orders__row-meta': 'row-meta',
    'orders__row-dates': 'row-dates',
    'orders__row-delete': 'row-delete',
  }),
  { virtual: true },
);

describe('OrdersView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = { data: null, isLoading: false, error: null };
    mockUseLocalStorageValue.mockReturnValue([null, jest.fn()]);
  });

  it('renders order list from initial data', () => {
    render(<OrdersView initialOrders={mockOrders} lang="en" />);
    expect(screen.getByText('Order #1')).toBeInTheDocument();
    expect(screen.getByText('Order #2')).toBeInTheDocument();
  });

  it('renders orders count', () => {
    render(<OrdersView initialOrders={mockOrders} lang="en" />);
    expect(screen.getByText('/ 2')).toBeInTheDocument();
  });

  it('shows detail panel when order is selected', () => {
    mockUseLocalStorageValue.mockReturnValue([1, jest.fn()]);
    render(<OrdersView initialOrders={mockOrders} lang="en" />);
    expect(screen.getByTestId('order-detail')).toBeInTheDocument();
  });

  it('shows delete confirm modal when delete clicked', () => {
    render(<OrdersView initialOrders={mockOrders} lang="en" />);
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/ });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByTestId('delete-confirm')).toBeInTheDocument();
  });

  it('confirms delete and closes modal', async () => {
    render(<OrdersView initialOrders={mockOrders} lang="en" />);
    fireEvent.click(screen.getAllByRole('button', { name: /Delete/ })[0]);
    fireEvent.click(screen.getByTestId('confirm-delete'));
    await waitFor(() => {
      expect(screen.queryByTestId('delete-confirm')).not.toBeInTheDocument();
    });
  });

  it('selects order via keyboard Enter', () => {
    render(<OrdersView initialOrders={mockOrders} lang="en" />);
    const rows = screen.getAllByRole('button', { name: /Delete/ });
    const row = rows[0].closest('[role="button"]') ?? rows[0];
    fireEvent.keyDown(row, { key: 'Enter' });
  });
});
