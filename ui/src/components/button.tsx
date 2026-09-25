import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

const styles = {
  primary:
    'bg-[hsl(var(--rui-primary))] text-[hsl(var(--rui-primary-foreground))] shadow-sm hover:opacity-90 hover:shadow',
  secondary:
    'bg-[hsl(var(--rui-secondary))] text-[hsl(var(--rui-secondary-foreground))] hover:opacity-80',
  outline:
    'border border-[hsl(var(--rui-border))] bg-transparent shadow-sm hover:bg-[hsl(var(--rui-accent))]',
  ghost: 'bg-transparent hover:bg-[hsl(var(--rui-accent))]',
  destructive:
    'bg-[hsl(var(--rui-destructive))] text-[hsl(var(--rui-destructive-foreground))] hover:opacity-90',
} as const;
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof styles;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const padding =
    size === 'sm'
      ? 'h-8 px-3 text-sm'
      : size === 'lg'
        ? 'h-11 px-5 text-base'
        : 'h-10 px-4 text-sm';
  return (
    <button
      className={cn(
        'rui-focus inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--rui-radius)] font-medium transition-[background-color,box-shadow,transform] active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
        padding,
        styles[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}{' '}
      {children}
    </button>
  );
}
