import type { ReactNode } from 'react';
import type { MarketingLink } from './marketing-types';
export function MarketingHeader({
  brand,
  links,
  actions,
}: {
  brand: ReactNode;
  links?: MarketingLink[];
  actions?: ReactNode;
}) {
  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3">
      <strong>{brand}</strong>
      {(links?.length || actions) && (
        <div className="flex flex-wrap items-center gap-3">
          {links?.length ? (
            <nav
              aria-label="Main navigation"
              className="flex flex-wrap gap-3 text-sm"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rui-focus text-[hsl(var(--rui-muted-foreground))] hover:text-[hsl(var(--rui-foreground))]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
          {actions}
        </div>
      )}
    </header>
  );
}
