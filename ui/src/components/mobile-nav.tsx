import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
export function MobileNav({
  children,
  className,
  label = 'Mobile navigation',
}: {
  children?: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-2 sm:hidden',
        className,
      )}
    >
      {children}
    </nav>
  );
}
