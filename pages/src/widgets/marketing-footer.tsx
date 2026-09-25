import type { ReactNode } from 'react';
import type { MarketingLink } from './marketing-types';
export function Footer({
  brand,
  links,
}: {
  brand: ReactNode;
  links?: MarketingLink[];
}) {
  return (
    <footer className="mt-16 border-t border-[hsl(var(--rui-border))] py-8 text-sm text-[hsl(var(--rui-muted-foreground))]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <strong className="text-[hsl(var(--rui-foreground))]">{brand}</strong>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[hsl(var(--rui-foreground))]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
