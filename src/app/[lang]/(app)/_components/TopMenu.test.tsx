import { render, screen, fireEvent, act } from '@testing-library/react';
import TopMenu from './TopMenu';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockSocket = { on: jest.fn(), disconnect: jest.fn() };
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket),
}));

const mockSwitchLocale = jest.fn();
jest.mock('@/lib/i18n', () => ({
  switchLocale: (...args: unknown[]) => mockSwitchLocale(...args),
  t: jest.fn((key: string) => key),
}));

jest.mock('./BrandLogo', () => {
  function MockBrandLogo(): React.JSX.Element {
    return <div data-testid="brand-logo" />;
  }
  return MockBrandLogo;
});

jest.mock(
  './TopMenu.module.scss',
  () => ({
    'top-menu': 'top-menu',
    'top-menu__brand': 'brand',
    'top-menu__status': 'status',
    'top-menu__counter': 'counter',
    'top-menu__clock': 'clock',
    'top-menu__weekday': 'weekday',
    'top-menu__date': 'date',
  }),
  { virtual: true },
);

describe('TopMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders brand logo and locale buttons', () => {
    render(<TopMenu lang="en" />);
    expect(screen.getByTestId('brand-logo')).toBeInTheDocument();
    expect(screen.getByText('RU')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('shows clock after first tick', () => {
    render(<TopMenu lang="en" />);
    expect(screen.queryByText(/\d{2}:\d{2}:\d{2}/)).not.toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('connects to socket and displays active tabs', () => {
    render(<TopMenu lang="en" />);
    expect(mockSocket.on).toHaveBeenCalledWith('active-tabs', expect.any(Function));
    const callback = mockSocket.on.mock.calls.find(([e]) => e === 'active-tabs')?.[1];
    act(() => {
      callback?.(5);
    });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows dash when active tabs is null', () => {
    render(<TopMenu lang="en" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('highlights the active locale button', () => {
    render(<TopMenu lang="en" />);
    expect(screen.getByText('EN')).toHaveClass('btn-success');
    expect(screen.getByText('RU')).toHaveClass('btn-outline-secondary');
  });

  it('calls switchLocale with correct lang on button click', () => {
    render(<TopMenu lang="en" />);
    fireEvent.click(screen.getByText('RU'));
    expect(mockSwitchLocale).toHaveBeenCalledWith(expect.any(Object), 'en', 'ru');
    fireEvent.click(screen.getByText('EN'));
    expect(mockSwitchLocale).toHaveBeenCalledWith(expect.any(Object), 'en', 'en');
  });

  it('cleans up interval and socket on unmount', () => {
    const { unmount } = render(<TopMenu lang="en" />);
    unmount();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
