import type { ReactNode } from 'react';
import { Badge } from '@sypra-ui/ui';
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
    <section className="py-16 text-center sm:py-24">
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
