import { type ReactNode } from 'react';
import { Section, Stack } from '@sypra-ui/ui';
import { AuditLogViewer } from '../widgets/audit-log-viewer';
import type { AuditLogEntry } from '../widgets/audit-log-item';

export function AuditLogPage({
  title = 'Activity log',
  description = 'Review important activity in this account or workspace.',
  entries,
  onLoadMore,
  loading,
  children,
}: {
  title?: ReactNode;
  description?: ReactNode;
  entries: AuditLogEntry[];
  onLoadMore?: () => void | Promise<void>;
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <Stack gap={6}>
      <Section title={title} description={description}>
        <AuditLogViewer
          entries={entries}
          onLoadMore={onLoadMore}
          loading={loading}
        />
      </Section>
      {children}
    </Stack>
  );
}
