import { type ReactNode } from 'react';
import { Card, Section, SettingRow, Switch } from '@sypra-ui/ui';

export type NotificationPreference = {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  description?: ReactNode;
  enabled: boolean;
};

export function NotificationPreferences({
  preferences,
  onChange,
}: {
  preferences: NotificationPreference[];
  onChange: (preference: NotificationPreference, enabled: boolean) => void;
}) {
  return (
    <Section title="Notification preferences">
      <Card className="space-y-4">
        {preferences.map((preference, index) => (
          <div key={preference.id}>
            {index > 0 && (
              <div className="mb-4 border-t border-[hsl(var(--rui-border))]" />
            )}
            <SettingRow
              title={preference.label}
              description={preference.description}
              action={
                <Switch
                  aria-label={
                    preference.ariaLabel ??
                    (typeof preference.label === 'string'
                      ? `Enable ${preference.label}`
                      : 'Enable notification')
                  }
                  checked={preference.enabled}
                  onChange={(event) =>
                    onChange(preference, event.target.checked)
                  }
                />
              }
            />
          </div>
        ))}
      </Card>
    </Section>
  );
}
