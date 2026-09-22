'use client';

import { useState, type ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Checkbox,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  Label,
  Section,
  Separator,
  Stack,
  Switch,
} from '@sypra-ui/ui';

export function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="min-w-0 space-y-8">{children}</div>;
}
export type Profile = { name: string; email: string; avatar?: string };
export function ProfilePage({
  profile,
  loading,
  onSave,
  fields,
  children,
}: {
  profile: Profile;
  loading?: boolean;
  onSave: (profile: Profile) => void | Promise<void>;
  fields?: { avatar?: boolean; name?: boolean; email?: boolean };
  children?: ReactNode;
}) {
  const [next, setNext] = useState(profile);
  const visibleFields = { avatar: true, name: true, email: true, ...fields };
  return (
    <Section title="Profile" description="Update the details people see.">
      <Card>
        <div className="mb-5 flex items-center gap-3">
          {visibleFields.avatar && <Avatar src={next.avatar} alt={next.name} />}
          <div>
            <CardTitle>{next.name || 'Your profile'}</CardTitle>
            <CardDescription>{next.email}</CardDescription>
          </div>
        </div>
        <form
          className="max-w-lg space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onSave(next);
          }}
        >
          {visibleFields.name && (
            <div>
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={next.name}
                onChange={(event) =>
                  setNext({ ...next, name: event.target.value })
                }
                required
              />
            </div>
          )}
          {visibleFields.email && (
            <div>
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={next.email}
                onChange={(event) =>
                  setNext({ ...next, email: event.target.value })
                }
                required
              />
            </div>
          )}
          {(visibleFields.name || visibleFields.email) && (
            <Button type="submit" loading={loading}>
              Save changes
            </Button>
          )}
        </form>
        {children}
      </Card>
    </Section>
  );
}
export type Session = {
  id: string;
  device: string;
  location?: string;
  lastActive: string;
};
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
      <Stack>
        {sessions.length ? (
          sessions.map((session) => (
            <Card
              key={session.id}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <CardTitle>
                  {session.device}{' '}
                  {session.id === currentSessionId && <Badge>Current</Badge>}
                </CardTitle>
                <CardDescription>
                  {[session.location, session.lastActive]
                    .filter(Boolean)
                    .join(' · ')}
                </CardDescription>
              </div>
              {session.id !== currentSessionId && (
                <Button
                  variant="outline"
                  size="sm"
                  loading={loading}
                  onClick={() => void onRevoke(session.id)}
                >
                  Revoke
                </Button>
              )}
            </Card>
          ))
        ) : (
          <EmptyState title="No sessions" />
        )}
      </Stack>
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
export function SecurityPage({
  sessions,
  currentSessionId,
  onRevoke,
  onRevokeAll,
  passwordEnabled = true,
  twoFactorEnabled,
  onChangePassword,
  onToggleTwoFactor,
  sections,
  children,
}: {
  sessions?: Session[];
  currentSessionId?: string;
  onRevoke?: (id: string) => void | Promise<void>;
  onRevokeAll?: () => void | Promise<void>;
  passwordEnabled?: boolean;
  twoFactorEnabled?: boolean;
  onChangePassword?: () => void;
  onToggleTwoFactor?: (enabled: boolean) => void;
  sections?: { password?: boolean; twoFactor?: boolean; sessions?: boolean };
  children?: ReactNode;
}) {
  const visibleSections = {
    password: true,
    twoFactor: true,
    sessions: true,
    ...sections,
  };
  return (
    <Stack gap={8}>
      {(visibleSections.password || visibleSections.twoFactor) && (
        <Section title="Security" description="Keep your account secure.">
          <Card className="space-y-4">
            {visibleSections.password && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    {passwordEnabled
                      ? 'Password is enabled.'
                      : 'Passwordless sign-in.'}
                  </CardDescription>
                </div>
                {onChangePassword && (
                  <Button variant="outline" onClick={onChangePassword}>
                    Change password
                  </Button>
                )}
              </div>
            )}
            {visibleSections.password && visibleSections.twoFactor && (
              <Separator />
            )}
            {visibleSections.twoFactor && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Two-factor authentication</CardTitle>
                  <CardDescription>
                    {twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                  </CardDescription>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onChange={(event) =>
                    onToggleTwoFactor?.(event.target.checked)
                  }
                />
              </div>
            )}
          </Card>
        </Section>
      )}
      {visibleSections.sessions && sessions && onRevoke && onRevokeAll && (
        <SessionManager
          sessions={sessions}
          currentSessionId={currentSessionId}
          onRevoke={onRevoke}
          onRevokeAll={onRevokeAll}
        />
      )}
      {children}
    </Stack>
  );
}

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
  permissions?: string[];
};
export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: {
    name: string;
    permissions: string[];
  }) => void | Promise<void>;
}) {
  const [name, setName] = useState('');
  const [write, setWrite] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            The full key should only be shown once by your application.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div>
            <Label htmlFor="key-name">Name</Label>
            <Input
              id="key-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Production"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={write}
              onChange={(event) => setWrite(event.target.checked)}
            />{' '}
            Allow write access
          </label>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              void onCreate({
                name,
                permissions: write ? ['read', 'write'] : ['read'],
              });
              onOpenChange(false);
            }}
            disabled={!name.trim()}
          >
            Create key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function ApiKeyManager({
  keys,
  loading,
  onCreate,
  onRevoke,
  actions,
  children,
}: {
  keys: ApiKey[];
  loading?: boolean;
  onCreate?: (values: {
    name: string;
    permissions: string[];
  }) => void | Promise<void>;
  onRevoke?: (id: string) => void | Promise<void>;
  actions?: { create?: boolean; revoke?: boolean };
  children?: ReactNode;
}) {
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
            <Card
              key={key.id}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <CardTitle>{key.name}</CardTitle>
                <CardDescription>
                  <code>{key.prefix}••••••••</code> · Created {key.createdAt}
                  {key.lastUsedAt
                    ? ` · Last used ${key.lastUsedAt}`
                    : ' · Never used'}
                </CardDescription>
              </div>
              {visibleActions.revoke && onRevoke && (
                <Button
                  variant="outline"
                  size="sm"
                  loading={loading}
                  onClick={() => void onRevoke(key.id)}
                >
                  Revoke
                </Button>
              )}
            </Card>
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
export function ApiKeyPage(props: ComponentProps<typeof ApiKeyManager>) {
  return <ApiKeyManager {...props} />;
}
type ComponentProps<T> = T extends (props: infer Props) => unknown
  ? Props
  : never;
export function DangerZone({
  onDeleteAccount,
  confirmationText = 'DELETE',
}: {
  onDeleteAccount: () => void | Promise<void>;
  confirmationText?: string;
}) {
  const [value, setValue] = useState('');
  return (
    <Section title="Danger zone" description="These actions are permanent.">
      <Card className="border-[hsl(var(--rui-destructive))]">
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          Delete all account data. This cannot be undone.
        </CardDescription>
        <div className="mt-4 max-w-sm">
          <Label htmlFor="delete-confirmation">
            Type {confirmationText} to confirm
          </Label>
          <Input
            id="delete-confirmation"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <Button
          className="mt-4"
          variant="destructive"
          disabled={value !== confirmationText}
          onClick={() => void onDeleteAccount()}
        >
          Delete account
        </Button>
      </Card>
    </Section>
  );
}
