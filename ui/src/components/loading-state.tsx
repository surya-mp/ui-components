import { cn } from '../lib/utils';
export const LoadingState = ({
  label = 'Loading',
  className,
}: {
  label?: string;
  className?: string;
}) => (
  <div
    role="status"
    className={cn(
      'flex items-center gap-2 p-4 text-sm text-[hsl(var(--rui-muted-foreground))]',
      className,
    )}
  >
    <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
    {label}
  </div>
);
