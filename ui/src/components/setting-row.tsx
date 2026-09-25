import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { CardDescription } from './card-description';
import { CardTitle } from './card-title';
export function SettingRow({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {action}
    </div>
  );
}
