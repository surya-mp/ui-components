'use client';

import { useState, type ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Collapsible,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  InputOTP,
  Label,
  RadioGroup,
  ScrollArea,
  Section,
  Separator,
  SettingRow,
  Stack,
  Switch,
} from '@sypra-ui/ui';
import { BillingPage } from './billing';

export function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="min-w-0 space-y-8">{children}</div>;
}
export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  avatar?: string;
};
export function ProfileSummary({
  profile,
  showAvatar = true,
}: {
  profile: Profile;
  showAvatar?: boolean;
}) {
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(' ');
  return (
    <div className="mb-5 flex items-center gap-3">
      {showAvatar && <Avatar src={profile.avatar} alt={fullName} />}
      <div className="min-w-0">
        <CardTitle>{fullName || 'Your profile'}</CardTitle>
        <CardDescription>{profile.email}</CardDescription>
      </div>
    </div>
  );
}
export function ProfilePage({
  profile,
  loading,
  onSave,
  fields,
  sections,
  dangerZone,
  children,
}: {
  profile: Profile;
  loading?: boolean;
  onSave: (profile: Profile) => void | Promise<void>;
  fields?: {
    avatar?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    username?: boolean;
    email?: boolean;
  };
  sections?: { details?: boolean; dangerZone?: boolean };
  dangerZone?: {
    onDeleteAccount: () => void | Promise<void>;
    confirmationText?: string;
  };
  children?: ReactNode;
}) {
  const [next, setNext] = useState(profile);
  const visibleFields = {
    avatar: true,
    firstName: true,
    lastName: true,
    username: false,
    email: true,
    ...fields,
  };
  const visibleSections = {
    details: true,
    dangerZone: Boolean(dangerZone),
    ...sections,
  };
  return (
    <Stack gap={8}>
      {visibleSections.details && (
        <Section title="Profile" description="Update the details people see.">
          <Card>
            <ProfileSummary profile={next} showAvatar={visibleFields.avatar} />
            <form
              className="max-w-lg space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void onSave(next);
              }}
            >
              {visibleFields.firstName && (
                <FormField
                  label="First name"
                  htmlFor="profile-first-name"
                  required
                >
                  <Input
                    id="profile-first-name"
                    value={next.firstName}
                    onChange={(event) =>
                      setNext({ ...next, firstName: event.target.value })
                    }
                    autoComplete="given-name"
                    required
                  />
                </FormField>
              )}
              {visibleFields.lastName && (
                <FormField
                  label="Last name"
                  htmlFor="profile-last-name"
                  required
                >
                  <Input
                    id="profile-last-name"
                    value={next.lastName}
                    onChange={(event) =>
                      setNext({ ...next, lastName: event.target.value })
                    }
                    autoComplete="family-name"
                    required
                  />
                </FormField>
              )}
              {visibleFields.username && (
                <FormField label="Username" htmlFor="profile-username">
                  <Input
                    id="profile-username"
                    value={next.username ?? ''}
                    onChange={(event) =>
                      setNext({ ...next, username: event.target.value })
                    }
                    autoComplete="username"
                  />
                </FormField>
              )}
              {visibleFields.email && (
                <FormField label="Email" htmlFor="profile-email" required>
                  <Input
                    id="profile-email"
                    type="email"
                    value={next.email}
                    onChange={(event) =>
                      setNext({ ...next, email: event.target.value })
                    }
                    required
                  />
                </FormField>
              )}
              {(visibleFields.firstName ||
                visibleFields.lastName ||
                visibleFields.username ||
                visibleFields.email) && (
                <Button type="submit" loading={loading}>
                  Save changes
                </Button>
              )}
            </form>
          </Card>
        </Section>
      )}
      {visibleSections.dangerZone && dangerZone && (
        <DangerZone {...dangerZone} />
      )}
      {children}
    </Stack>
  );
}
export type Session = {
  id: string;
  device: string;
  location?: string;
  lastActive: string;
};
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
export function SecurityPage({
  sessions,
  currentSessionId,
  onRevoke,
  onRevokeAll,
  passwordEnabled = true,
  twoFactorEnabled,
  onChangePassword,
  onToggleTwoFactor,
  twoFactorVerification,
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
  twoFactorVerification?: {
    onVerify: (code: string) => void | Promise<void>;
    length?: number;
  };
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
              <SettingRow
                title="Password"
                description={
                  passwordEnabled
                    ? 'Password is enabled.'
                    : 'Passwordless sign-in.'
                }
                action={
                  onChangePassword && (
                    <Button variant="outline" onClick={onChangePassword}>
                      Change password
                    </Button>
                  )
                }
              />
            )}
            {visibleSections.password && visibleSections.twoFactor && (
              <Separator />
            )}
            {visibleSections.twoFactor && (
              <div className="space-y-4">
                <SettingRow
                  title="Two-factor authentication"
                  description={twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                  action={
                    <Switch
                      checked={twoFactorEnabled}
                      onChange={(event) =>
                        onToggleTwoFactor?.(event.target.checked)
                      }
                    />
                  }
                />
                {twoFactorVerification && (
                  <div className="max-w-sm">
                    <Label>Authentication code</Label>
                    <InputOTP
                      length={twoFactorVerification.length}
                      onComplete={(code) =>
                        void twoFactorVerification.onVerify(code)
                      }
                    />
                  </div>
                )}
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
          </>
        }
        action={action}
      />
    </Card>
  );
}
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
  const [access, setAccess] = useState<'read' | 'write'>('read');
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
          <RadioGroup
            name="key-access"
            label="Access"
            value={access}
            onValueChange={(value) => setAccess(value as 'read' | 'write')}
            options={[
              { value: 'read', label: 'Read only' },
              {
                value: 'write',
                label: 'Read and write',
                description: 'Allows changes through this key.',
              },
            ]}
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              void onCreate({
                name,
                permissions: access === 'write' ? ['read', 'write'] : ['read'],
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
export function ApiKeyPage(props: ComponentProps<typeof ApiKeyManager>) {
  return <ApiKeyManager {...props} />;
}
type ComponentProps<T> = T extends (props: infer Props) => unknown
  ? Props
  : never;
export function AccountSettingsPage({
  profile,
  security,
  apiKeys,
  billing,
  sections,
  children,
}: {
  profile?: ComponentProps<typeof ProfilePage>;
  security?: ComponentProps<typeof SecurityPage>;
  apiKeys?: ComponentProps<typeof ApiKeyManager>;
  billing?: ComponentProps<typeof BillingPage>;
  sections?: {
    profile?: boolean;
    security?: boolean;
    apiKeys?: boolean;
    billing?: boolean;
  };
  children?: ReactNode;
}) {
  const visibleSections = {
    profile: Boolean(profile),
    security: Boolean(security),
    apiKeys: Boolean(apiKeys),
    billing: Boolean(billing),
    ...sections,
  };
  return (
    <SettingsLayout>
      {visibleSections.profile && profile && <ProfilePage {...profile} />}
      {visibleSections.security && security && <SecurityPage {...security} />}
      {visibleSections.apiKeys && apiKeys && <ApiKeyManager {...apiKeys} />}
      {visibleSections.billing && billing && <BillingPage {...billing} />}
      {children}
    </SettingsLayout>
  );
}
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
      <Collapsible
        title="Delete account"
        className="border-[hsl(var(--rui-destructive))]"
      >
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
            placeholder={confirmationText}
          />
        </div>
        <Button
          className="mt-4"
          variant="destructive"
          aria-label="Confirm delete account"
          disabled={value !== confirmationText}
          onClick={() => void onDeleteAccount()}
        >
          Delete account
        </Button>
      </Collapsible>
    </Section>
  );
}
