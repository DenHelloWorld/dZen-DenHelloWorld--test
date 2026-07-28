import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from './page';

const mockPush = jest.fn();
const mockSwitchLocale = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ lang: 'en' })),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

jest.mock('@/hooks/useEscapeToClose', () => ({
  useEscapeToClose: jest.fn(),
}));

jest.mock('@/lib/i18n', () => ({
  switchLocale: (...args: unknown[]) => mockSwitchLocale(...args),
  t: jest.fn((key: string) => key),
}));

jest.mock('@/lib/storage-keys', () => ({
  SELECTED_ORDER_STORAGE_KEY: 'selectedOrder',
  SELECTED_PRODUCT_STORAGE_KEY: 'selectedProduct',
  SELECTED_WAREHOUSE_STORAGE_KEY: 'selectedWarehouse',
  SELECTED_GROUP_STORAGE_KEY: 'selectedGroup',
}));

jest.mock('../_components/ConfirmModal', () => {
  function MockConfirmModal({
    onConfirm,
    onCancel,
    children,
  }: {
    onConfirm: () => void;
    onCancel: () => void;
    children: React.ReactNode;
  }): React.JSX.Element {
    return (
      <div data-testid="confirm-modal">
        <button data-testid="modal-confirm" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="modal-cancel" onClick={onCancel}>
          Cancel
        </button>
        {children}
      </div>
    );
  }
  return MockConfirmModal;
});

jest.mock(
  './Settings.module.scss',
  () => ({
    settings: 'settings',
    settings__title: 'title',
    settings__card: 'card',
    settings__label: 'label',
    'settings__storage-row': 'storage-row',
    'settings__storage-label': 'storage-label',
    'settings__reset-button': 'reset-button',
  }),
  { virtual: true },
);

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders title', () => {
    render(<SettingsPage />);
    expect(screen.getByText('settings.title')).toBeInTheDocument();
  });

  it('renders locale buttons', () => {
    render(<SettingsPage />);
    expect(screen.getByText('settings.lang.ru')).toBeInTheDocument();
    expect(screen.getByText('settings.lang.en')).toBeInTheDocument();
  });

  it('calls switchLocale on locale button click', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByText('settings.lang.ru'));
    expect(mockSwitchLocale).toHaveBeenCalled();
  });

  it('shows confirm modal on reset click', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByText('settings.reset_storage'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('clears localStorage on confirm reset', () => {
    localStorage.setItem('selectedOrder', '1');
    render(<SettingsPage />);
    fireEvent.click(screen.getByText('settings.reset_storage'));
    fireEvent.click(screen.getByTestId('modal-confirm'));
    expect(localStorage.getItem('selectedOrder')).toBeNull();
  });

  it('closes modal on cancel', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByText('settings.reset_storage'));
    fireEvent.click(screen.getByTestId('modal-cancel'));
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });
});
