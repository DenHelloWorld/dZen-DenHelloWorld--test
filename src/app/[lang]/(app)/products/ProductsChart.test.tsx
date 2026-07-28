import { render } from '@testing-library/react';
import ProductsChart from './ProductsChart';

global.ResizeObserver = class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};

const mockData = [
  { type: 'Electronic', count: 5, avgPriceUsd: 100 },
  { type: 'Furniture', count: 3, avgPriceUsd: 200 },
];

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

jest.mock(
  './Products.module.scss',
  () => ({
    'products__chart-container': 'chart-container',
  }),
  { virtual: true },
);

describe('ProductsChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProductsChart data={mockData} metric="count" lang="en" />);
    expect(container.querySelector('.chart-container')).toBeInTheDocument();
  });
});
