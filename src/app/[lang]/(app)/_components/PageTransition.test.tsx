import { render, screen } from '@testing-library/react';
import PageTransition from './PageTransition';

jest.mock('next/navigation', () => ({
  usePathname: () => '/test',
}));

jest.mock(
  './PageTransition.module.scss',
  () => ({
    'page-transition': 'page-transition',
  }),
  { virtual: true },
);

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
