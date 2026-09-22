import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../lib/utils';

type ChildrenProps = { children?: ReactNode; className?: string };
export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-[calc(var(--rui-radius)+.15rem)] border border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-5 shadow-sm transition-shadow',
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'mb-4 flex min-w-0 items-start justify-between gap-3 [&>:first-child]:min-w-0',
        className,
      )}
      {...props}
    />
  );
}
export function CardTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cn('font-semibold leading-5', className)} {...props} />;
}
export function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        'mt-1 break-words text-sm leading-5 text-[hsl(var(--rui-muted-foreground))]',
        className,
      )}
      {...props}
    />
  );
}
export function Badge({
  className,
  variant = 'default',
  ...props
}: ChildrenProps & {
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
      {props.children}
    </span>
  );
}
export function Avatar({
  src,
  alt = '',
  fallback,
  className,
}: {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[hsl(var(--rui-muted))] text-sm font-medium',
        className,
      )}
    >
      {src ? (
        <img className="size-full object-cover" src={src} alt={alt} />
      ) : (
        (fallback ?? alt.slice(0, 2).toUpperCase())
      )}
    </span>
  );
}
export const Separator = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    role="separator"
    className={cn('h-px w-full bg-[hsl(var(--rui-border))]', className)}
    {...props}
  />
);
export const Skeleton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'animate-pulse rounded bg-[hsl(var(--rui-muted))]',
      className,
    )}
    {...props}
  />
);
export function Progress({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={className}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--rui-muted))]">
        <div
          className="h-full rounded-full bg-[hsl(var(--rui-primary))] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
