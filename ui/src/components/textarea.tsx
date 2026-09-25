import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export const Textarea = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'textarea'>) => (
  <textarea
    className={cn(
      'rui-focus min-h-24 min-w-0 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-[hsl(var(--rui-muted-foreground))] focus:bg-[hsl(var(--rui-card))] disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);
