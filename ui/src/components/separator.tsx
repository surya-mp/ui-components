import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
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
