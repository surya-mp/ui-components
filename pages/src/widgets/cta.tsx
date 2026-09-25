import type { ReactNode } from 'react';
export function CTA({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action: ReactNode;
}) {
  return (
    <section className="rounded-[calc(var(--rui-radius)+.2rem)] bg-[hsl(var(--rui-primary))] px-5 py-10 text-center text-[hsl(var(--rui-primary-foreground))] sm:px-8 sm:py-14">
      <h2 className="text-3xl font-bold">{title}</h2>
      {description && <p className="mt-3 opacity-85">{description}</p>}
      <div className="mt-6">{action}</div>
    </section>
  );
}
