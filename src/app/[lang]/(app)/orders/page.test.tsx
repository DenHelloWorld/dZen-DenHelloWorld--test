import { render, screen } from '@testing-library/react';
import OrdersPage from './page';

jest.mock('@/lib/orders-data', () => ({
  fetchOrdersList: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: 'O1',
        productsCount: 3,
        createdAt: '2024-01-15T00:00:00Z',
        totals: [{ symbol: 'USD', value: 100 }],
      },
    ]),
  ),
}));

jest.mock('./OrdersView', () => {
  function MockOrdersView({
    lang,
    initialOrders,
  }: {
    lang: string;
    initialOrders: unknown[];
  }): React.JSX.Element {
    return (
      <div data-testid="orders-view">
        {lang}:{initialOrders.length}
      </div>
    );
  }
  return MockOrdersView;
});

describe('OrdersPage', () => {
  it('renders OrdersView with fetched data', async () => {
    const el = await OrdersPage({ params: Promise.resolve({ lang: 'en' }) });
    render(el);
    expect(screen.getByTestId('orders-view')).toHaveTextContent('en:1');
  });
});
