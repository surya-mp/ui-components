import { type ReactNode } from 'react';
import { CardDescription, CardTitle } from '@sypra-ui/ui';

export type AuditLogEntry = {
  id: string;
  action: ReactNode;
  occurredAt: ReactNode;
  actor?: ReactNode;
  resource?: ReactNode;
  description?: ReactNode;
};

export function AuditLogItem({ entry }: { entry: AuditLogEntry }) {
  return (
    <div className="border-b border-[hsl(var(--rui-border))] p-4 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <CardTitle>{entry.action}</CardTitle>
        <time className="text-xs text-[hsl(var(--rui-muted-foreground))]">
          {entry.occurredAt}
        </time>
      </div>
      {(entry.actor || entry.resource || entry.description) && (
        <CardDescription>
          {[entry.actor, entry.resource, entry.description]
            .filter(Boolean)
            .map((part, index) => (
              <span key={index}>
                {index > 0 && ' · '}
                {part}
              </span>
            ))}
        </CardDescription>
      )}
    </div>
  );
}
