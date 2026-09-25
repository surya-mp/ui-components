import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export function CardTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cn('font-semibold leading-5', className)} {...props} />;
}
