import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';
export function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn(
        'mt-1 break-words text-sm leading-5 text-[hsl(var(--rui-muted-foreground))]',
        className,
      )}
      {...props}
    />
  );
}
