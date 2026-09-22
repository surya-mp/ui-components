import { type ReactNode } from 'react';
import { Button } from './forms';
import { cn } from '../lib/utils';

export function Alert({
  title,
  children,
  variant = 'default',
  className,
}: {
  title?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
}) {
  const color =
    variant === 'destructive'
      ? 'border-[hsl(var(--rui-destructive))] bg-[hsl(var(--rui-destructive-background))] text-[hsl(var(--rui-destructive-text))]'
      : variant === 'success'
        ? 'border-[hsl(var(--rui-success))] bg-[hsl(var(--rui-success-background))] text-[hsl(var(--rui-success-foreground))]'
        : 'border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-muted))]';
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[var(--rui-radius)] border p-3 text-sm',
        color,
        className,
      )}
    >
      {title && <strong className="block">{title}</strong>}
      {children}
    </div>
  );
}
export function Toast({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
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
      {action}
    </div>
  );
}
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
      'rounded-[var(--rui-radius)] border border-dashed border-[hsl(var(--rui-border))] p-10 text-center',
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
export const ErrorState = ({
  title = 'Something went wrong',
  onRetry,
  className,
}: {
  title?: ReactNode;
  onRetry?: () => void;
  className?: string;
}) => (
  <Alert title={title} variant="destructive" className={className}>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        Try again
      </Button>
    )}
  </Alert>
);
export const LoadingState = ({
  label = 'Loading',
  className,
}: {
  label?: string;
  className?: string;
}) => (
  <div
    role="status"
    className={cn(
      'flex items-center gap-2 p-4 text-sm text-[hsl(var(--rui-muted-foreground))]',
      className,
    )}
  >
    <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
    {label}
  </div>
);
