import { type ReactNode } from 'react';
import { Button, Card, EmptyState } from '@sypra-ui/ui';
import { AuditLogItem, type AuditLogEntry } from './audit-log-item';

export function AuditLogViewer({
  entries,
  onLoadMore,
  loading,
  emptyMessage = 'New account activity will appear here.',
  className,
}: {
  entries: AuditLogEntry[];
  onLoadMore?: () => void | Promise<void>;
  loading?: boolean;
  emptyMessage?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {entries.length ? (
        <Card className="p-0">
          {entries.map((entry) => (
            <AuditLogItem key={entry.id} entry={entry} />
          ))}
        </Card>
      ) : (
        <EmptyState title="No activity yet" description={emptyMessage} />
      )}
      {onLoadMore && entries.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            loading={loading}
            onClick={() => void onLoadMore()}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
