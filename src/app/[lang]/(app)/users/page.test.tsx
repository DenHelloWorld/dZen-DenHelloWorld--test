import { render, screen } from '@testing-library/react';
import UsersPage from './page';

jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => key),
}));

describe('UsersPage', () => {
  it('renders title', async () => {
    const el = await UsersPage({ params: Promise.resolve({ lang: 'en' }) });
    render(el);
    expect(screen.getByText('users.title')).toBeInTheDocument();
  });
});
