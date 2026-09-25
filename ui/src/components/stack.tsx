import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export const Stack = ({
  gap = 4,
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { gap?: 1 | 2 | 3 | 4 | 6 | 8 }) => (
  <div
    className={cn(
      'flex flex-col',
      {
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
      }[gap],
      className,
    )}
    {...props}
  />
);
