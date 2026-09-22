import DocsPage from '../../../components/docs-page';

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <DocsPage section={section} />;
}
