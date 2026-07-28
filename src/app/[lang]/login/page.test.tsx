import { render, screen } from '@testing-library/react';
import LoginPage from './page';

jest.mock('./LoginForm', () => {
  function MockLoginForm({ lang }: { lang: string }): React.JSX.Element {
    return <div data-testid="login-form">{lang}</div>;
  }
  return MockLoginForm;
});
jest.mock('../(app)/_components/BrandLogo', () => {
  function MockBrandLogo(): React.JSX.Element {
    return <div data-testid="brand-logo" />;
  }
  return MockBrandLogo;
});

jest.mock(
  './page.module.scss',
  () => ({
    'login-page': 'login-page',
    'login-page__card': 'card',
    'login-page__title': 'title',
  }),
  { virtual: true },
);

describe('LoginPage', () => {
  it('renders BrandLogo and LoginForm', async () => {
    const el = await LoginPage({ params: Promise.resolve({ lang: 'en' }) });
    render(el);
    expect(screen.getByTestId('brand-logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('passes locale to LoginForm', async () => {
    const el = await LoginPage({ params: Promise.resolve({ lang: 'ru' }) });
    render(el);
    expect(screen.getByTestId('login-form')).toHaveTextContent('ru');
  });
});
