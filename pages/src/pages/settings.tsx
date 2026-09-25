'use client';

import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  Button,
  Card,
  FormField,
  Input,
  InputOTP,
  Label,
  Section,
  Separator,
  SettingRow,
  Stack,
  Switch,
} from '@sypra-ui/ui';
import { ApiKeyManager } from '../widgets/api-key-manager';
import { DangerZone } from '../widgets/danger-zone';
import { ProfileSummary } from '../widgets/profile-summary';
import { SessionManager } from '../widgets/session-manager';
import type { Profile, Session } from '../widgets/settings-types';
import { BillingPage } from './billing';
import { NotificationsPage } from './notifications';

export function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="min-w-0 space-y-8">{children}</div>;
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
  dangerZone?: ComponentProps<typeof DangerZone>;
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
export function ApiKeyPage(props: ComponentProps<typeof ApiKeyManager>) {
  return <ApiKeyManager {...props} />;
}
export function AccountSettingsPage({
  profile,
  security,
  apiKeys,
  billing,
  notifications,
  sections,
  children,
}: {
  profile?: ComponentProps<typeof ProfilePage>;
  security?: ComponentProps<typeof SecurityPage>;
  apiKeys?: ComponentProps<typeof ApiKeyManager>;
  billing?: ComponentProps<typeof BillingPage>;
  notifications?: ComponentProps<typeof NotificationsPage>;
  sections?: {
    profile?: boolean;
    security?: boolean;
    apiKeys?: boolean;
    billing?: boolean;
    notifications?: boolean;
  };
  children?: ReactNode;
}) {
  const visibleSections = {
    profile: Boolean(profile),
    security: Boolean(security),
    apiKeys: Boolean(apiKeys),
    billing: Boolean(billing),
    notifications: Boolean(notifications),
    ...sections,
  };
  return (
    <SettingsLayout>
      {visibleSections.profile && profile && <ProfilePage {...profile} />}
      {visibleSections.security && security && <SecurityPage {...security} />}
      {visibleSections.apiKeys && apiKeys && <ApiKeyManager {...apiKeys} />}
      {visibleSections.billing && billing && <BillingPage {...billing} />}
      {visibleSections.notifications && notifications && (
        <NotificationsPage {...notifications} />
      )}
      {children}
    </SettingsLayout>
  );
}
