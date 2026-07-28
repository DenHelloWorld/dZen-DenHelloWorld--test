import type { Metadata } from 'next';
import { fetchProductGroups } from '@/lib/groups-data';
import GroupsView from './GroupsView';
import type { Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Groups — Orders & Products',
};

export const dynamic = 'force-dynamic';

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const groups = await fetchProductGroups();

  return <GroupsView groups={groups} lang={lang as Locale} />;
}
