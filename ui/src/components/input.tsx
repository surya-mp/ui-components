import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';
export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'rui-focus h-10 min-w-0 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-transparent px-3 text-sm transition-colors placeholder:text-[hsl(var(--rui-muted-foreground))] focus:bg-[hsl(var(--rui-card))] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);
