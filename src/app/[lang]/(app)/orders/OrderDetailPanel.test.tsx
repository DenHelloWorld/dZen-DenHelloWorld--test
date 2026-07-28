import { render, screen, fireEvent } from '@testing-library/react';
import OrderDetailPanel from './OrderDetailPanel';

const mockOrder = {
  id: 1,
  title: 'Order #1',
  description: 'Test order',
  createdAt: '2024-01-15T00:00:00Z',
  totals: [{ symbol: 'USD', value: 100 }],
  products: [
    {
      id: 1,
      title: 'Product A',
      type: 'Electronic',
      serialNumber: null,
      isNew: true,
      photo: null,
      specification: null,
      guaranteeStart: null,
      guaranteeEnd: null,
      prices: [{ symbol: 'USD', value: 50, isDefault: true }],
    },
  ],
};

let mockQuery: { data: typeof mockOrder | null; isLoading: boolean; error: Error | null } = {
  data: mockOrder,
  isLoading: false,
  error: null,
};

jest.mock('@/store/api', () => ({
  useGetOrderQuery: jest.fn(() => mockQuery),
}));

jest.mock('@/lib/format', () => ({
  formatDateLong: jest.fn(() => 'Jan 15, 2024'),
}));

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

jest.mock(
  './Orders.module.scss',
  () => ({
    orders__panel: 'panel',
    'orders__panel-close': 'close',
    'orders__panel-title': 'title',
    'orders__panel-meta': 'meta',
    'orders__panel-total': 'total',
    'orders__panel-total-label': 'total-label',
    'orders__panel-total-values': 'total-values',
    'orders__panel-products': 'products',
    'orders__panel-product': 'product',
    'orders__panel-product-info': 'product-info',
    'orders__panel-product-title': 'product-title',
    'orders__panel-product-type': 'product-type',
    'orders__panel-product-price': 'product-price',
  }),
  { virtual: true },
);

jest.mock('../_components/CurrencyPrices', () => {
  function MockCurrencyPrices(): React.JSX.Element {
    return <span data-testid="currency-prices" />;
  }
  return MockCurrencyPrices;
});

describe('OrderDetailPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = { data: mockOrder, isLoading: false, error: null };
  });

  it('renders order title', () => {
    render(<OrderDetailPanel orderId={1} onClose={jest.fn()} lang="en" />);
    expect(screen.getByText('Order #1')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    mockQuery = { data: null, isLoading: true, error: null };
    render(<OrderDetailPanel orderId={1} onClose={jest.fn()} lang="en" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockQuery = { data: null, isLoading: false, error: new Error('fail') };
    render(<OrderDetailPanel orderId={1} onClose={jest.fn()} lang="en" />);
    expect(screen.getByText('orders.panel_error')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<OrderDetailPanel orderId={1} onClose={onClose} lang="en" />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
});
