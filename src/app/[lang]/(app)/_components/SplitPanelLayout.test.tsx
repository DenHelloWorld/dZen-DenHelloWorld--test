import { render, screen } from '@testing-library/react';
import SplitPanelLayout from './SplitPanelLayout';

// Mock SCSS module so class lookups resolve to predictable strings
jest.mock(
  './SplitPanelLayout.module.scss',
  () => ({
    layout: 'layout',
    'layout--panel-open': 'layout--panel-open',
    'panel-wrap': 'panel-wrap',
    'panel-wrap--open': 'panel-wrap--open',
  }),
  { virtual: true },
);

describe('SplitPanelLayout', () => {
  it('renders the list content', () => {
    render(<SplitPanelLayout list={<div>List content</div>} panel={null} />);
    expect(screen.getByText('List content')).toBeInTheDocument();
  });

  it('renders the panel content when provided', () => {
    render(<SplitPanelLayout list={<div>List</div>} panel={<div>Panel content</div>} />);
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('does not render panel content when panel is null', () => {
    render(<SplitPanelLayout list={<div>List</div>} panel={null} />);
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
  });

  it('applies --panel-open class when panel is provided', () => {
    const { container } = render(
      <SplitPanelLayout list={<div>List</div>} panel={<div>Panel</div>} />,
    );
    const layoutDiv = container.firstElementChild;
    expect(layoutDiv?.className).toContain('layout--panel-open');
  });

  it('does not apply --panel-open class when panel is null', () => {
    const { container } = render(<SplitPanelLayout list={<div>List</div>} panel={null} />);
    const layoutDiv = container.firstElementChild;
    expect(layoutDiv?.className).not.toContain('layout--panel-open');
  });
});
