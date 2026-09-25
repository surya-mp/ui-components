import { cn } from '../lib/utils';
export function Progress({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={className}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--rui-muted))]">
        <div
          className={cn(
            'h-full rounded-full bg-[hsl(var(--rui-primary))] transition-all',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
