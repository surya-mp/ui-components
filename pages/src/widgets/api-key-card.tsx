import type { ReactNode } from 'react';
import { Card, SettingRow } from '@sypra-ui/ui';
import type { ApiKey } from './settings-types';
export function ApiKeyCard({
  apiKey,
  action,
}: {
  apiKey: ApiKey;
  action?: ReactNode;
}) {
  return (
    <Card>
      <SettingRow
        title={apiKey.name}
        description={
          <>
            <code>{apiKey.prefix}••••••••</code> · Created {apiKey.createdAt}
            {apiKey.lastUsedAt
              ? ` · Last used ${apiKey.lastUsedAt}`
              : ' · Never used'}
            {apiKey.expiresAt && ` · Expires ${apiKey.expiresAt}`}
          </>
        }
        action={action}
      />
    </Card>
  );
}
