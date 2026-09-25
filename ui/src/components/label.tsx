import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export const Label = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'label'>) => (
  <label
    className={cn('mb-1.5 block text-sm font-medium', className)}
    {...props}
  />
);
