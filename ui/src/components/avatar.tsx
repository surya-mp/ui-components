import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export function Avatar({
  src,
  alt = '',
  fallback,
  className,
}: {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[hsl(var(--rui-muted))] text-sm font-medium',
        className,
      )}
    >
      {src ? (
        <img className="size-full object-cover" src={src} alt={alt} />
      ) : (
        (fallback ?? alt.slice(0, 2).toUpperCase())
      )}
    </span>
  );
}
