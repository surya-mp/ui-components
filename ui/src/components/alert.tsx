import type { ReactNode } from 'react';
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
      {title && <strong className="mb-1 block">{title}</strong>}
      {children}
    </div>
  );
}
