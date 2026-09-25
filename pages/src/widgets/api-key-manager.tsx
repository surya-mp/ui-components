'use client';
import { useState, type ReactNode } from 'react';
import { Button, EmptyState, Section, Stack } from '@sypra-ui/ui';
import { ApiKeyCard } from './api-key-card';
import { CreateApiKeyDialog } from './create-api-key-dialog';
import type {
  ApiKey,
  ApiKeyCreateValues,
  CreatedApiKey,
} from './settings-types';
export type ApiKeyManagerProps = {
  keys: ApiKey[];
  loading?: boolean;
  onCreate?: (
    values: ApiKeyCreateValues,
  ) => CreatedApiKey | void | Promise<CreatedApiKey | void>;
  onRevoke?: (id: string) => void | Promise<void>;
  actions?: { create?: boolean; revoke?: boolean };
  children?: ReactNode;
};
export function ApiKeyManager({
  keys,
  loading,
  onCreate,
  onRevoke,
  actions,
  children,
}: ApiKeyManagerProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const visibleActions = { create: true, revoke: true, ...actions };
  return (
    <Section
      title="API keys"
      description="Create keys for programmatic access."
    >
      {visibleActions.create && onCreate && (
        <div className="flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>Create API key</Button>
        </div>
      )}
      <Stack>
        {keys.length ? (
          keys.map((key) => (
            <ApiKeyCard
              key={key.id}
              apiKey={key}
              action={
                visibleActions.revoke && onRevoke ? (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={loading}
                    onClick={() => void onRevoke(key.id)}
                  >
                    Revoke
                  </Button>
                ) : undefined
              }
            />
          ))
        ) : (
          <EmptyState
            title="No API keys"
            description="Create one when you need programmatic access."
          />
        )}
      </Stack>
      {children}
      {visibleActions.create && onCreate && (
        <CreateApiKeyDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreate={onCreate}
        />
      )}
    </Section>
  );
}
