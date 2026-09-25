import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export const PageHeader = ({
  as: Heading = 'h1',
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <header
    className={cn(
      'flex flex-wrap items-start justify-between gap-4 border-b border-[hsl(var(--rui-border))] pb-5',
      className,
    )}
  >
    <div className="min-w-0">
      <Heading className="text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
          {description}
        </p>
      )}
    </div>
    {actions}
  </header>
);
