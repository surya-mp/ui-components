import type { ReactNode } from 'react';
import { Container, PageContent, PageHeader, PageShell } from '@sypra-ui/ui';
import { FeatureGrid } from '../widgets/feature-grid';
import { Footer } from '../widgets/marketing-footer';
import { MarketingHeader } from '../widgets/marketing-header';
import type {
  MarketingFeature,
  MarketingLink,
} from '../widgets/marketing-types';
import { Hero } from '../widgets/hero';

export function LandingPage({
  brand,
  header,
  hero,
  features,
  children,
  as,
  sections,
}: {
  brand: ReactNode;
  header?: { links?: MarketingLink[]; actions?: ReactNode };
  hero?: {
    title: ReactNode;
    description: ReactNode;
    primaryAction?: ReactNode;
    secondaryAction?: ReactNode;
  };
  features?: MarketingFeature[];
  children?: ReactNode;
  as?: 'main' | 'div';
  sections?: {
    header?: boolean;
    hero?: boolean;
    features?: boolean;
    footer?: boolean;
  };
}) {
  const visibleSections = {
    header: true,
    hero: true,
    features: true,
    footer: true,
    ...sections,
  };
  return (
    <PageShell as={as}>
      <Container>
        {visibleSections.header && (
          <MarketingHeader brand={brand} {...header} />
        )}
        {visibleSections.hero && hero && <Hero {...hero} />}
        {visibleSections.features && features && (
          <FeatureGrid features={features} />
        )}
        {children}
        {visibleSections.footer && <Footer brand={brand} />}
      </Container>
    </PageShell>
  );
}
export function SettingsPageDemo({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <Container className="py-8">
        <PageHeader title="Settings" description="Manage your account." />
        <PageContent>{children}</PageContent>
      </Container>
    </PageShell>
  );
}
