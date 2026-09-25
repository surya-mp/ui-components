import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';
export const Radio = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="radio"
    className={cn(
      'rui-focus size-4 accent-[hsl(var(--rui-primary))]',
      className,
    )}
    {...props}
  />
);
