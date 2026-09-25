import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/utils';
export const Select = ({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'rui-focus h-10 min-w-0 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-[hsl(var(--rui-background))] px-3 text-sm',
      className,
    )}
    {...props}
  >
    {children}
  </select>
);
