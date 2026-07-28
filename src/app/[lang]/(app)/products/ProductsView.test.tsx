import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsView from './ProductsView';

const mockInitialProducts = [
  {
    id: 1,
    title: 'Product A',
    type: 'Electronic',
    serialNumber: 'SN-001',
    isNew: true,
    photo: null,
    specification: 'Spec',
    guaranteeStart: '2024-01-01',
    guaranteeEnd: '2025-01-01',
    orderTitle: 'Order #1',
    prices: [{ symbol: 'USD', value: 100, isDefault: true }],
  },
  {
    id: 2,
    title: 'Product B',
    type: 'Furniture',
    serialNumber: null,
    isNew: false,
    photo: null,
    specification: null,
    guaranteeStart: null,
    guaranteeEnd: null,
    orderTitle: 'Order #2',
    prices: [{ symbol: 'USD', value: 200, isDefault: true }],
  },
];

const mockRouterReplace = jest.fn();
const mockSetSelectedId = jest.fn();
const mockUseLocalStorageValue = jest.fn((..._args: unknown[]): [unknown, jest.Mock] => [
  null,
  mockSetSelectedId,
]);

let mockQuery = { data: null, isFetching: false };
const mockDeleteTrigger = jest.fn(() => ({ data: { success: true } }));
const mockDeleteReset = jest.fn();
const mockDeleteMutation = [
  mockDeleteTrigger,
  { isLoading: false, error: null, reset: mockDeleteReset },
];

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: mockRouterReplace })),
}));

jest.mock('@/store/api', () => ({
  useGetProductsQuery: jest.fn(() => mockQuery),
  useDeleteProductMutation: jest.fn(() => mockDeleteMutation),
}));

jest.mock('@/hooks/useLocalStorageValue', () => ({
  useLocalStorageValue: (...args: unknown[]) => mockUseLocalStorageValue(...args),
}));

jest.mock('@/hooks/useEscapeToClose', () => ({
  useEscapeToClose: jest.fn(),
}));

jest.mock('@/lib/format', () => ({
  formatDateShort: jest.fn(() => '01/01'),
  formatDateLong: jest.fn(() => 'Jan 1, 2024'),
}));

jest.mock('@/lib/api-error', () => ({
  extractApiErrorMessage: jest.fn(() => 'Error'),
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
jest.mock('./ProductDetailPanel', () => {
  function MockProductDetailPanel(): React.JSX.Element {
    return <div data-testid="product-detail" />;
  }
  return MockProductDetailPanel;
});
jest.mock('./ProductsChart', () => {
  function MockProductsChart(): React.JSX.Element {
    return <div data-testid="products-chart" />;
  }
  return MockProductsChart;
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
  return {
    __esModule: true,
    default: MockSplitPanelLayout,
  };
});

jest.mock(
  './Products.module.scss',
  () => ({
    products: 'products',
    products__header: 'header',
    products__title: 'title',
    'products__title-count': 'title-count',
    products__filter: 'filter',
    'products__filter-label': 'filter-label',
    'products__filter-select': 'filter-select',
    'products__chart-toggle': 'chart-toggle',
    'products__chart-toggle--active': 'chart-toggle-active',
    'products__chart-card': 'chart-card',
    'products__chart-metrics': 'chart-metrics',
    'products__chart-metric': 'chart-metric',
    'products__chart-metric--active': 'chart-metric-active',
    'products__chart-container': 'chart-container',
    products__list: 'list',
    products__row: 'row',
    'products__row--active': 'row-active',
    'products__row-title': 'row-title',
    'products__row-type': 'row-type',
    'products__row-guarantee': 'row-guarantee',
    'products__row-guarantee--compact': 'row-guarantee-compact',
    'products__row-price': 'row-price',
    'products__row-order': 'row-order',
    'products__row-delete': 'row-delete',
    products__empty: 'empty',
  }),
  { virtual: true },
);

describe('ProductsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = { data: null, isFetching: false };
    mockUseLocalStorageValue.mockReturnValue([null, mockSetSelectedId]);
  });

  it('renders product list', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });

  it('renders products count', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    expect(screen.getByText('/ 2')).toBeInTheDocument();
  });

  it('renders type in filter dropdown', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    expect(screen.getAllByText(/Electronic/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Furniture/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows detail panel when product is selected', () => {
    mockUseLocalStorageValue.mockReturnValue([1, mockSetSelectedId]);
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  it('shows chart toggle button', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    expect(screen.getByText('products.chart.toggle')).toBeInTheDocument();
  });

  it('shows chart card with metric buttons when toggled', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    fireEvent.click(screen.getByText('products.chart.toggle'));
    expect(screen.getByText('products.chart.metric_count')).toBeInTheDocument();
    expect(screen.getByText('products.chart.metric_price')).toBeInTheDocument();
  });

  it('selects metric in chart card', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    fireEvent.click(screen.getByText('products.chart.toggle'));
    fireEvent.click(screen.getByText('products.chart.metric_price'));
  });

  it('selects product via keyboard Enter', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    const rows = screen.getAllByRole('button', { name: /Delete/ });
    const row = rows[0].closest('[role="button"]') ?? rows[0];
    fireEvent.keyDown(row, { key: 'Enter' });
    expect(mockSetSelectedId).toHaveBeenCalledWith(1);
  });

  it('selects product via keyboard Space', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    const rows = screen.getAllByRole('button', { name: /Delete/ });
    const row = rows[0].closest('[role="button"]') ?? rows[0];
    fireEvent.keyDown(row, { key: ' ' });
    expect(mockSetSelectedId).toHaveBeenCalledWith(1);
  });

  it('changes type filter', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    fireEvent.change(screen.getByLabelText('products.filter_type'), {
      target: { value: 'Furniture' },
    });
    expect(mockRouterReplace).toHaveBeenCalled();
  });

  it('shows empty message when no products', () => {
    render(<ProductsView initialProducts={[]} lang="en" />);
    expect(screen.getByText('products.no_results')).toBeInTheDocument();
  });

  it('shows delete confirm when delete clicked', () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/ });
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByTestId('delete-confirm')).toBeInTheDocument();
  });

  it('calls confirm delete and closes modal', async () => {
    render(<ProductsView initialProducts={mockInitialProducts} lang="en" />);
    fireEvent.click(screen.getAllByRole('button', { name: /Delete/ })[0]);
    fireEvent.click(screen.getByTestId('confirm-delete'));
    await waitFor(() => {
      expect(screen.queryByTestId('delete-confirm')).not.toBeInTheDocument();
    });
  });
});
