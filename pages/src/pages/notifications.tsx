import { type ReactNode } from 'react';
import { Card, Section, Stack } from '@sypra-ui/ui';
import { NotificationList } from '../widgets/notification-list';
import {
  NotificationPreferences,
  type NotificationPreference,
} from '../widgets/notification-preferences';
import type { AppNotification } from '../widgets/notification-item';

export function NotificationsPage({
  notifications,
  preferences,
  onMarkRead,
  onMarkAllRead,
  onPreferenceChange,
  sections,
  children,
}: {
  notifications: AppNotification[];
  preferences?: NotificationPreference[];
  onMarkRead?: (notification: AppNotification) => void | Promise<void>;
  onMarkAllRead?: () => void | Promise<void>;
  onPreferenceChange?: (
    preference: NotificationPreference,
    enabled: boolean,
  ) => void;
  sections?: { notifications?: boolean; preferences?: boolean };
  children?: ReactNode;
}) {
  const visibleSections = {
    notifications: true,
    preferences: Boolean(preferences && onPreferenceChange),
    ...sections,
  };
  return (
    <Stack gap={8}>
      {visibleSections.notifications && (
        <Section
          title="Notifications"
          description="Review updates from your account."
        >
          <Card className="p-0">
            <NotificationList
              notifications={notifications}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
            />
          </Card>
        </Section>
      )}
      {visibleSections.preferences && preferences && onPreferenceChange && (
        <NotificationPreferences
          preferences={preferences}
          onChange={onPreferenceChange}
        />
      )}
      {children}
    </Stack>
  );
}
