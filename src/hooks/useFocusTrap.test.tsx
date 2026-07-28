import { render, screen, fireEvent } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

function TrapWrapper({ id }: { id?: string }): React.JSX.Element {
  const ref = useFocusTrap<HTMLDivElement>();
  return (
    <div ref={ref} data-testid={id ?? 'trap'}>
      <button>First</button>
      <button>Second</button>
      <button>Third</button>
    </div>
  );
}

function EmptyTrapWrapper(): React.JSX.Element {
  const ref = useFocusTrap<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="empty">
      <div>Not focusable</div>
    </div>
  );
}

describe('useFocusTrap', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('focuses the first focusable element on mount', () => {
    render(<TrapWrapper />);
    expect(document.activeElement?.textContent).toBe('First');
  });

  it('cycles forward: Tab on last element focuses the first', () => {
    render(<TrapWrapper />);
    const buttons = screen.getAllByRole('button');
    buttons[2].focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('cycles backward: Shift+Tab on first element focuses the last', () => {
    render(<TrapWrapper />);
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('does nothing on Tab when there are no focusable elements', () => {
    render(<EmptyTrapWrapper />);
    document.body.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(document.body);
  });

  it('restores focus to the previously focused element on unmount', () => {
    const previous = document.createElement('button');
    previous.textContent = 'Previous';
    document.body.append(previous);
    previous.focus();

    const { unmount } = render(<TrapWrapper />);
    expect(document.activeElement?.textContent).toBe('First');
    unmount();
    expect(document.activeElement).toBe(previous);
    previous.remove();
  });
});
