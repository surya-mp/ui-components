import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export function Badge({
  className,
  variant = 'default',
  children,
}: {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}) {
  const variants = {
    default: 'bg-[hsl(var(--rui-secondary))]',
    success:
      'bg-[hsl(var(--rui-success-background))] text-[hsl(var(--rui-success-foreground))]',
    warning:
      'bg-[hsl(var(--rui-warning-background))] text-[hsl(var(--rui-warning-foreground))]',
    destructive:
      'bg-[hsl(var(--rui-destructive-background))] text-[hsl(var(--rui-destructive-text))]',
    outline: 'border border-[hsl(var(--rui-border))]',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
