import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export const PageShell = ({
  as: Component = 'main',
  className,
  ...props
}: ComponentPropsWithoutRef<'main'> & { as?: 'main' | 'div' }) => (
  <Component
    className={cn(
      'min-h-screen min-w-0 bg-[hsl(var(--rui-background))] text-[hsl(var(--rui-foreground))]',
      className,
    )}
    {...props}
  />
);
