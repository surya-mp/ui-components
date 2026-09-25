import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export const EmptyState = ({
  title = 'Nothing here yet',
  description,
  action,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-[var(--rui-radius)] border border-dashed border-[hsl(var(--rui-border))] p-6 text-center sm:p-10',
      className,
    )}
  >
    <h3 className="font-semibold">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
        {description}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
