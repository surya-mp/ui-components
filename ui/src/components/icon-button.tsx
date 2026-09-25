import { cn } from '../lib/utils';
import { Button, type ButtonProps } from './button';
export function IconButton({
  children,
  'aria-label': label,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn('size-10 px-0', className)}
      aria-label={label}
      {...props}
    >
      {children}
    </Button>
  );
}
