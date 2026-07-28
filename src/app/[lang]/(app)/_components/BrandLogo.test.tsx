import { render, screen } from '@testing-library/react';
import BrandLogo from './BrandLogo';

jest.mock(
  './BrandLogo.module.scss',
  () => ({
    brand: 'brand',
    brand__icon: 'brand__icon',
  }),
  { virtual: true },
);

describe('BrandLogo', () => {
  it('renders INVENTORY text', () => {
    render(<BrandLogo />);
    expect(screen.getByText('INVENTORY')).toBeInTheDocument();
  });

  it('renders shield icon', () => {
    render(<BrandLogo />);
    expect(document.querySelector('.bi-shield-fill-check')).toBeInTheDocument();
  });
});
