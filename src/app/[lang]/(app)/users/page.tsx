import { t, type Locale } from '@/lib/i18n';

export default async function UsersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  return (
    <h1 className="h4">
      <i className="bi bi-people me-2" aria-hidden="true" />
      {t('users.title', lang as Locale)}
    </h1>
  );
}
