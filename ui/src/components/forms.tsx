import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import { cn } from '../lib/utils';

const buttonStyles = {
  primary:
    'bg-[hsl(var(--rui-primary))] text-[hsl(var(--rui-primary-foreground))] hover:opacity-90',
  secondary:
    'bg-[hsl(var(--rui-secondary))] text-[hsl(var(--rui-secondary-foreground))] hover:opacity-80',
  outline:
    'border border-[hsl(var(--rui-border))] bg-transparent hover:bg-[hsl(var(--rui-accent))]',
  ghost: 'bg-transparent hover:bg-[hsl(var(--rui-accent))]',
  destructive:
    'bg-[hsl(var(--rui-destructive))] text-[hsl(var(--rui-destructive-foreground))] hover:opacity-90',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonStyles;
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
        'rui-focus inline-flex items-center justify-center gap-2 rounded-[var(--rui-radius)] font-medium transition disabled:pointer-events-none disabled:opacity-50',
        padding,
        buttonStyles[variant],
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
export function IconButton({
  children,
  'aria-label': label,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn('size-10 px-0', className)}
      aria-label={label}
      {...props}
    >
      {children}
    </Button>
  );
}
export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'rui-focus h-10 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-transparent px-3 text-sm placeholder:text-[hsl(var(--rui-muted-foreground))] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);
export const Textarea = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'textarea'>) => (
  <textarea
    className={cn(
      'rui-focus min-h-24 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-transparent px-3 py-2 text-sm placeholder:text-[hsl(var(--rui-muted-foreground))] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);
export const Label = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'label'>) => (
  <label
    className={cn('mb-1.5 block text-sm font-medium', className)}
    {...props}
  />
);
export const Checkbox = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="checkbox"
    className={cn(
      'rui-focus size-4 accent-[hsl(var(--rui-primary))]',
      className,
    )}
    {...props}
  />
);
export const Radio = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="radio"
    className={cn(
      'rui-focus size-4 accent-[hsl(var(--rui-primary))]',
      className,
    )}
    {...props}
  />
);
export const Switch = ({
  checked,
  onChange,
  disabled,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) => (
  <label
    className={cn(
      'inline-flex cursor-pointer items-center',
      disabled && 'cursor-not-allowed opacity-50',
      className,
    )}
  >
    <input
      type="checkbox"
      className="peer sr-only"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
    <span className="rui-focus h-6 w-11 rounded-full bg-[hsl(var(--rui-muted))] p-0.5 transition peer-checked:bg-[hsl(var(--rui-primary))]">
      <span className="block size-5 rounded-full bg-[hsl(var(--rui-switch-thumb))] transition peer-checked:translate-x-5" />
    </span>
  </label>
);
export const Select = ({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'rui-focus h-10 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-[hsl(var(--rui-background))] px-3 text-sm',
      className,
    )}
    {...props}
  >
    {children}
  </select>
);
