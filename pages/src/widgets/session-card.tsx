import type { ReactNode } from 'react';
import { Badge, Card, SettingRow } from '@sypra-ui/ui';
import type { Session } from './settings-types';
export function SessionCard({
  session,
  current,
  action,
}: {
  session: Session;
  current?: boolean;
  action?: ReactNode;
}) {
  return (
    <Card>
      <SettingRow
        title={
          <>
            {session.device} {current && <Badge>Current</Badge>}
          </>
        }
        description={[session.location, session.lastActive]
          .filter(Boolean)
          .join(' · ')}
        action={action}
      />
    </Card>
  );
}
