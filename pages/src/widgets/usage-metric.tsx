import type { ReactNode } from 'react';
export function UsageMetric({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="rounded bg-[hsl(var(--rui-muted))] p-3">
      <strong className="block">{value}</strong>
      <span className="text-[hsl(var(--rui-muted-foreground))]">{label}</span>
    </div>
  );
}
