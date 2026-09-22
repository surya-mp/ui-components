import { type ReactNode } from 'react';
import {
  Badge,
  Card,
  CardDescription,
  CardTitle,
  Container,
  PageContent,
  PageHeader,
  PageShell,
} from '@sypra-ui/ui';

export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <section className="py-20 text-center sm:py-28">
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-[hsl(var(--rui-muted-foreground))]">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {primaryAction}
        {secondaryAction}
      </div>
    </section>
  );
}
export function FeatureGrid({
  features,
}: {
  features: Array<{ title: string; description: string; icon?: ReactNode }>;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title}>
          {feature.icon && (
            <div className="mb-3 text-[hsl(var(--rui-primary))]">
              {feature.icon}
            </div>
          )}
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </Card>
      ))}
    </section>
  );
}
export function FAQ({
  items,
}: {
  items: Array<{ question: string; answer: ReactNode }>;
}) {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      {items.map((item) => (
        <Card key={item.question}>
          <CardTitle>{item.question}</CardTitle>
          <CardDescription>{item.answer}</CardDescription>
        </Card>
      ))}
    </section>
  );
}
export function CTA({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action: ReactNode;
}) {
  return (
    <section className="rounded-[calc(var(--rui-radius)+.2rem)] bg-[hsl(var(--rui-primary))] px-6 py-14 text-center text-[hsl(var(--rui-primary-foreground))]">
      <h2 className="text-3xl font-bold">{title}</h2>
      {description && <p className="mt-3 opacity-85">{description}</p>}
      <div className="mt-6">{action}</div>
    </section>
  );
}
export function Footer({
  brand,
  links,
}: {
  brand: ReactNode;
  links?: Array<{ label: string; href: string }>;
}) {
  return (
    <footer className="mt-16 border-t border-[hsl(var(--rui-border))] py-8 text-sm text-[hsl(var(--rui-muted-foreground))]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <strong className="text-[hsl(var(--rui-foreground))]">{brand}</strong>
        <div className="flex gap-4">
          {links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[hsl(var(--rui-foreground))]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
export function LandingPage({
  brand,
  hero,
  features,
  children,
  as,
}: {
  brand: ReactNode;
  hero: {
    title: ReactNode;
    description: ReactNode;
    primaryAction?: ReactNode;
    secondaryAction?: ReactNode;
  };
  features?: Array<{ title: string; description: string; icon?: ReactNode }>;
  children?: ReactNode;
  as?: 'main' | 'div';
}) {
  return (
    <PageShell as={as}>
      <Container>
        <header className="flex h-16 items-center justify-between">
          <strong>{brand}</strong>
        </header>
        <Hero {...hero} />
        {features && <FeatureGrid features={features} />}
        {children}
        <Footer brand={brand} />
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
