import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from './ConfirmModal';

// Mock the focus trap hook to avoid dealing with refs in test
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

describe('ConfirmModal', () => {
  let defaultProps: ReturnType<typeof makeProps>;

  function makeProps(): {
    title: string;
    cancelLabel: string;
    confirmLabel: string;
    onCancel: jest.Mock;
    onConfirm: jest.Mock;
    children: React.JSX.Element;
  } {
    return {
      title: 'Delete item?',
      cancelLabel: 'Cancel',
      confirmLabel: 'Delete',
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      children: <p>Are you sure?</p>,
    };
  }

  beforeEach(() => {
    defaultProps = makeProps();
  });

  it('renders the title', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete item?')).toBeInTheDocument();
  });

  it('renders cancel and confirm buttons', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows error message when provided', () => {
    render(<ConfirmModal {...defaultProps} errorMessage="Something failed" />);
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('disables buttons when isProcessing is true', () => {
    render(<ConfirmModal {...defaultProps} isProcessing />);
    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Delete')).toBeDisabled();
  });

  it('renders confirm icon when confirmIcon is provided', () => {
    render(<ConfirmModal {...defaultProps} confirmIcon="bi-trash" />);
    expect(document.querySelector('.bi-trash')).toBeInTheDocument();
  });

  it('applies primary variant class when confirmVariant is primary', () => {
    render(<ConfirmModal {...defaultProps} confirmVariant="primary" />);
    const confirmBtn = screen.getByText('Delete');
    expect(confirmBtn.className).toContain('confirm--primary');
  });

  it('sets aria-modal on the dialog', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
