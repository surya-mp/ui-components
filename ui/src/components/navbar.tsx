import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export function Navbar({
  brand,
  children,
  className,
  label = 'Main navigation',
}: {
  brand?: ReactNode;
  children?: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex min-h-14 min-w-0 items-center justify-between gap-3 border-b border-[hsl(var(--rui-border))] px-4',
        className,
      )}
    >
      {brand}
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </nav>
  );
}
