import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export function Sidebar({
  children,
  className,
  label = 'Sidebar',
}: {
  children?: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <aside
      aria-label={label}
      className={cn(
        'w-60 shrink-0 border-r border-[hsl(var(--rui-border))] p-3',
        className,
      )}
    >
      {children}
    </aside>
  );
}
