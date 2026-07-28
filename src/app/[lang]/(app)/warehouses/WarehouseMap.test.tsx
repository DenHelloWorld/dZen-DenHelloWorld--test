import { render, screen } from '@testing-library/react';
import WarehouseMap from './WarehouseMap';

const mockWarehouse = {
  id: 1,
  name: { en: 'Main Warehouse', ru: 'Главный склад' },
  address: { en: '123 Street', ru: 'ул. 123' },
  lat: 55.7558,
  lng: 37.6173,
};

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
}));

jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
}));

describe('WarehouseMap', () => {
  it('renders map container', () => {
    render(<WarehouseMap warehouse={mockWarehouse} lang="en" />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders warehouse name in popup', () => {
    render(<WarehouseMap warehouse={mockWarehouse} lang="en" />);
    expect(screen.getByText(/Main Warehouse/)).toBeInTheDocument();
  });

  it('renders address for locale', () => {
    render(<WarehouseMap warehouse={mockWarehouse} lang="en" />);
    expect(screen.getByText(/123 Street/)).toBeInTheDocument();
  });
});
