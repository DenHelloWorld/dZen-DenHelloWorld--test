import { render, screen } from '@testing-library/react';
import Providers from './Providers';

describe('Providers', () => {
  it('renders children', () => {
    render(
      <Providers>
        <div>Child</div>
      </Providers>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
