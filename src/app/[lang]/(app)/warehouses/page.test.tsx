import { render, screen } from '@testing-library/react';
import WarehousesPage from './page';

jest.mock('@/lib/warehouses-data', () => ({
  fetchWarehousesList: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        name: { en: 'Main', ru: 'Главный' },
        address: { en: '123 St', ru: 'ул. 123' },
        lat: 55,
        lng: 37,
      },
    ]),
  ),
}));

jest.mock('./WarehousesView', () => {
  function MockWarehousesView({
    lang,
    warehouses,
  }: {
    lang: string;
    warehouses: unknown[];
  }): React.JSX.Element {
    return (
      <div data-testid="warehouses-view">
        {lang}:{warehouses.length}
      </div>
    );
  }
  return MockWarehousesView;
});

describe('WarehousesPage', () => {
  it('renders WarehousesView with fetched data', async () => {
    const el = await WarehousesPage({ params: Promise.resolve({ lang: 'en' }) });
    render(el);
    expect(screen.getByTestId('warehouses-view')).toHaveTextContent('en:1');
  });
});
