import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export const Section = ({
  title,
  description,
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
}) => (
  <section className={cn('min-w-0 space-y-4', className)}>
    {title && (
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
            {description}
          </p>
        )}
      </div>
    )}
    {children}
  </section>
);
