import { redirect } from 'next/navigation';

export default async function AppIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<never> {
  const { lang } = await params;
  redirect(`/${lang}/orders`);
}
