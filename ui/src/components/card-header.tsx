import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
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
