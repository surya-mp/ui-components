import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
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
