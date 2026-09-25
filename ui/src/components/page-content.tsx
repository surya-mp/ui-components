import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export const PageContent = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('py-6', className)} {...props} />
);
