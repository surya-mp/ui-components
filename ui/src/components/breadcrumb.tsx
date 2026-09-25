export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[hsl(var(--rui-muted-foreground))]">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <a
                className="hover:text-[hsl(var(--rui-foreground))]"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
