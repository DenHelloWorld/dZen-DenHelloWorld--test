import { render, screen } from '@testing-library/react';
import ProductsPage from './page';

jest.mock('@/lib/products-data', () => ({
  fetchProductsList: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: 'P1',
        type: 'E',
        serialNumber: null,
        isNew: true,
        photo: null,
        specification: null,
        guaranteeStart: null,
        guaranteeEnd: null,
        orderTitle: 'O1',
        prices: [{ symbol: 'USD', value: 100, isDefault: true }],
      },
    ]),
  ),
}));

jest.mock('./ProductsView', () => {
  function MockProductsView({
    lang,
    initialProducts,
  }: {
    lang: string;
    initialProducts: unknown[];
  }): React.JSX.Element {
    return (
      <div data-testid="products-view">
        {lang}:{initialProducts.length}
      </div>
    );
  }
  return MockProductsView;
});

describe('ProductsPage', () => {
  it('renders ProductsView with fetched data', async () => {
    const el = await ProductsPage({
      params: Promise.resolve({ lang: 'en' }),
      searchParams: Promise.resolve({}),
    });
    render(el);
    expect(screen.getByTestId('products-view')).toHaveTextContent('en:1');
  });

  it('passes initialType from searchParams', async () => {
    const el = await ProductsPage({
      params: Promise.resolve({ lang: 'en' }),
      searchParams: Promise.resolve({ type: 'E' }),
    });
    render(el);
    expect(screen.getByTestId('products-view')).toBeInTheDocument();
  });
});
