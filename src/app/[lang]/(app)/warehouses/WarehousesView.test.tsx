import { render, screen, fireEvent } from '@testing-library/react';
import WarehousesView from './WarehousesView';

const mockWarehouses = [
  {
    id: 1,
    name: { en: 'Main', ru: 'Главный' },
    address: { en: '123 St', ru: 'ул. 123' },
    lat: 55,
    lng: 37,
  },
  {
    id: 2,
    name: { en: 'Second', ru: 'Второй' },
    address: { en: '456 Ave', ru: 'пр. 456' },
    lat: 56,
    lng: 38,
  },
];

const mockUseLocalStorageValue = jest.fn((..._args: unknown[]): [unknown, jest.Mock] => [
  null,
  jest.fn(),
]);

jest.mock('@/hooks/useLocalStorageValue', () => ({
  useLocalStorageValue: (...args: unknown[]) => mockUseLocalStorageValue(...args),
}));

jest.mock('@/hooks/useEscapeToClose', () => ({
  useEscapeToClose: jest.fn(),
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

jest.mock('leaflet', () => ({
  Icon: { Default: { prototype: {}, mergeOptions: jest.fn() } },
}));

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

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
  './Warehouses.module.scss',
  () => ({
    warehouses: 'warehouses',
    warehouses__title: 'title',
    'warehouses__title-count': 'title-count',
    warehouses__list: 'list',
    warehouses__row: 'row',
    'warehouses__row--active': 'row-active',
    'warehouses__row-name': 'row-name',
    'warehouses__row-address': 'row-address',
    warehouses__panel: 'panel',
    'warehouses__panel-close': 'panel-close',
    'warehouses__panel-title': 'panel-title',
    'warehouses__panel-address': 'panel-address',
    'warehouses__panel-map-label': 'map-label',
    'warehouses__panel-map': 'panel-map',
  }),
  { virtual: true },
);

describe('WarehousesView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalStorageValue.mockReturnValue([null, jest.fn()]);
  });

  it('renders warehouse list', () => {
    render(<WarehousesView warehouses={mockWarehouses} lang="en" />);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders warehouse count', () => {
    render(<WarehousesView warehouses={mockWarehouses} lang="en" />);
    expect(screen.getByText('/ 2')).toBeInTheDocument();
  });

  it('shows panel when warehouse selected', () => {
    mockUseLocalStorageValue.mockReturnValue([1, jest.fn()]);
    render(<WarehousesView warehouses={mockWarehouses} lang="en" />);
    expect(screen.getByText('warehouses.map')).toBeInTheDocument();
  });

  it('shows address in panel', () => {
    mockUseLocalStorageValue.mockReturnValue([1, jest.fn()]);
    render(<WarehousesView warehouses={mockWarehouses} lang="en" />);
    expect(screen.getAllByText('123 St').length).toBeGreaterThanOrEqual(1);
  });

  it('selects warehouse via keyboard Enter', () => {
    const setSelectedId = jest.fn();
    mockUseLocalStorageValue.mockReturnValue([null, setSelectedId]);
    render(<WarehousesView warehouses={mockWarehouses} lang="en" />);
    const rows = screen.getAllByRole('button', { name: /Main/ });
    const row = rows[0].closest('[role="button"]') ?? rows[0];
    fireEvent.keyDown(row, { key: 'Enter' });
    expect(setSelectedId).toHaveBeenCalledWith(1);
  });

  it('closes panel via close button', () => {
    const setSelectedId = jest.fn();
    mockUseLocalStorageValue.mockReturnValue([1, setSelectedId]);
    render(<WarehousesView warehouses={mockWarehouses} lang="en" />);
    const closeBtn = screen.getByRole('button', { name: /common\.close/ });
    fireEvent.click(closeBtn);
    expect(setSelectedId).toHaveBeenCalledWith(null);
  });
});
