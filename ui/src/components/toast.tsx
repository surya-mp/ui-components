import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export function Toast({
  title,
  description,
  action,
  onDismiss,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        'flex max-w-sm items-start gap-4 rounded-[var(--rui-radius)] border border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-4 shadow-lg',
        className,
      )}
    >
      <div className="flex-1">
        <strong className="text-sm">{title}</strong>
        {description && (
          <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{action}</div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss notification"
          className="rui-focus -mr-1 -mt-1 shrink-0 rounded px-1 text-[hsl(var(--rui-muted-foreground))] hover:text-[hsl(var(--rui-foreground))]"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
}
