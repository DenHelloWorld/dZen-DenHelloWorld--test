import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailPanel from './ProductDetailPanel';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  type: 'Electronic',
  serialNumber: 'SN-001',
  isNew: true,
  photo: null,
  specification: 'Specs here',
  guaranteeStart: '2024-01-01',
  guaranteeEnd: '2025-01-01',
  orderTitle: 'Order #1',
  prices: [{ symbol: 'USD', value: 100, isDefault: true }],
};

jest.mock('@/lib/format', () => ({
  formatDateLong: jest.fn(() => 'Jan 1, 2024'),
  formatCurrency: jest.fn((value) => `$${value}`),
}));

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

jest.mock(
  './Products.module.scss',
  () => ({
    products__panel: 'panel',
    'products__panel-close': 'close',
    'products__panel-title': 'title',
    'products__panel-meta': 'meta',
    'products__panel-details': 'details',
    'products__panel-detail': 'detail',
    'products__panel-detail-label': 'detail-label',
    'products__panel-detail-value': 'detail-value',
    'products__panel-total': 'total',
    'products__panel-total-label': 'total-label',
    'products__panel-total-values': 'total-values',
  }),
  { virtual: true },
);

describe('ProductDetailPanel', () => {
  it('renders product details', () => {
    render(<ProductDetailPanel product={mockProduct} onClose={jest.fn()} lang="en" />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/Electronic/)).toBeInTheDocument();
  });

  it('renders serial number', () => {
    render(<ProductDetailPanel product={mockProduct} onClose={jest.fn()} lang="en" />);
    expect(screen.getByText('SN-001')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<ProductDetailPanel product={mockProduct} onClose={onClose} lang="en" />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows dash when serial is null', () => {
    render(
      <ProductDetailPanel
        product={{ ...mockProduct, serialNumber: null }}
        onClose={jest.fn()}
        lang="en"
      />,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('shows used label when product is not new', () => {
    render(
      <ProductDetailPanel
        product={{ ...mockProduct, isNew: false }}
        onClose={jest.fn()}
        lang="en"
      />,
    );
    expect(screen.getByText('products.used')).toBeInTheDocument();
  });
});
