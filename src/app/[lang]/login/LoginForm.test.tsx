import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

jest.mock('@/store/api', () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false, error: null }],
}));

jest.mock(
  './form.module.scss',
  () => ({
    form: 'form',
    form__field: 'field',
    form__label: 'label',
    form__input: 'input',
    form__alert: 'alert',
    'form__alert--hidden': 'alert-hidden',
    form__button: 'button',
    form__spinner: 'spinner',
  }),
  { virtual: true },
);

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders username and password fields', () => {
    render(<LoginForm lang="en" />);
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginForm lang="en" />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders translated labels for ru locale', () => {
    render(<LoginForm lang="ru" />);
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('calls login and redirects on success', async () => {
    mockLogin.mockResolvedValue({ data: { username: 'demo' } });
    render(<LoginForm lang="en" />);

    fireEvent.change(screen.getByLabelText(/Username/), { target: { value: 'demo' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'demo' } });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'demo', password: 'demo' });
      expect(mockPush).toHaveBeenCalledWith('/en/orders');
    });
  });
});
