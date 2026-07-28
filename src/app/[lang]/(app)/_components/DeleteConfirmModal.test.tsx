import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmModal from './DeleteConfirmModal';

jest.mock('@/hooks/useFocusTrap', () => ({
  useFocusTrap: () => ({ current: document.createElement('div') }),
}));

jest.mock(
  './ConfirmModal.module.scss',
  () => ({
    'confirm-modal__backdrop': 'backdrop',
    'confirm-modal__dialog': 'dialog',
    'confirm-modal__content': 'content',
    'confirm-modal__body': 'body',
    'confirm-modal__header': 'header',
    'confirm-modal__title': 'title',
    'confirm-modal__text': 'text',
    'confirm-modal__error': 'error',
    'confirm-modal__footer': 'footer',
    'confirm-modal__cancel': 'cancel',
    'confirm-modal__confirm': 'confirm',
    'confirm-modal__confirm--primary': 'confirm--primary',
  }),
  { virtual: true },
);

jest.mock(
  './DeleteConfirmModal.module.scss',
  () => ({
    'delete-modal__item-title': 'item-title',
  }),
  { virtual: true },
);

describe('DeleteConfirmModal', () => {
  let defaultProps: ReturnType<typeof makeProps>;

  function makeProps(): {
    lang: 'ru';
    confirmMessageKey: string;
    title: string;
    isDeleting: boolean;
    onCancel: jest.Mock;
    onConfirm: jest.Mock;
  } {
    return {
      lang: 'ru' as const,
      confirmMessageKey: 'orders.delete_confirm',
      title: 'Test Order',
      isDeleting: false,
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
    };
  }

  beforeEach(() => {
    defaultProps = makeProps();
  });

  it('renders the translated modal title', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Подтверждение удаления')).toBeInTheDocument();
  });

  it('renders the translated confirm message', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Вы уверены, что хотите удалить этот приход?')).toBeInTheDocument();
  });

  it('renders the item title', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Test Order')).toBeInTheDocument();
  });

  it('renders cancel and delete buttons with translated labels', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Отмена')).toBeInTheDocument();
    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  it('calls onCancel when cancel is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Отмена'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when delete is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Удалить'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isDeleting is true', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting />);
    expect(screen.getByText('Отмена')).toBeDisabled();
    expect(screen.getByText('Удалить')).toBeDisabled();
  });

  it('shows error message when provided', () => {
    render(<DeleteConfirmModal {...defaultProps} errorMessage="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders with en locale', () => {
    render(
      <DeleteConfirmModal
        {...defaultProps}
        lang="en"
        confirmMessageKey="products.delete_confirm"
      />,
    );
    expect(screen.getByText('Delete confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this product?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
