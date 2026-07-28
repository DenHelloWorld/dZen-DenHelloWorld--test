import { render, screen } from '@testing-library/react';
import GroupsPage from './page';

jest.mock('@/lib/groups-data', () => ({
  fetchProductGroups: jest.fn(() =>
    Promise.resolve([
      { type: 'Electronic', count: 5, avgPrices: [{ symbol: 'USD', value: 100, isDefault: true }] },
    ]),
  ),
}));

jest.mock('./GroupsView', () => {
  function MockGroupsView({
    lang,
    groups,
  }: {
    lang: string;
    groups: unknown[];
  }): React.JSX.Element {
    return (
      <div data-testid="groups-view">
        {lang}:{groups.length}
      </div>
    );
  }
  return MockGroupsView;
});

describe('GroupsPage', () => {
  it('renders GroupsView with fetched data', async () => {
    const el = await GroupsPage({ params: Promise.resolve({ lang: 'en' }) });
    render(el);
    expect(screen.getByTestId('groups-view')).toHaveTextContent('en:1');
  });
});
