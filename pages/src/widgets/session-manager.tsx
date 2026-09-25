'use client';
import { Button, EmptyState, ScrollArea, Section, Stack } from '@sypra-ui/ui';
import { SessionCard } from './session-card';
import type { Session } from './settings-types';
export function SessionManager({
  sessions,
  currentSessionId,
  loading,
  onRevoke,
  onRevokeAll,
}: {
  sessions: Session[];
  currentSessionId?: string;
  loading?: boolean;
  onRevoke: (id: string) => void | Promise<void>;
  onRevokeAll: () => void | Promise<void>;
}) {
  return (
    <Section
      title="Active sessions"
      description="Review where your account is signed in."
    >
      <ScrollArea className={sessions.length > 3 ? 'max-h-96 pr-1' : undefined}>
        <Stack>
          {sessions.length ? (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                current={session.id === currentSessionId}
                action={
                  session.id !== currentSessionId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      loading={loading}
                      onClick={() => void onRevoke(session.id)}
                    >
                      Revoke
                    </Button>
                  ) : undefined
                }
              />
            ))
          ) : (
            <EmptyState title="No sessions" />
          )}
        </Stack>
      </ScrollArea>
      {sessions.length > 1 && (
        <Button
          variant="destructive"
          loading={loading}
          onClick={() => void onRevokeAll()}
        >
          Sign out of other sessions
        </Button>
      )}
    </Section>
  );
}
