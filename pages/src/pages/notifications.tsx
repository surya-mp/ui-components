import { type ReactNode } from 'react';
import {
  Card,
  Container,
  PageHeader,
  PageShell,
  Section,
  Stack,
} from '@sypra-ui/ui';
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
  standalone = false,
  title = 'Notifications',
  description = 'Review updates from your account.',
  as,
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
  /** Add a complete page shell when rendering at an application route. */
  standalone?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  as?: 'main' | 'div';
}) {
  const visibleSections = {
    notifications: true,
    preferences: Boolean(preferences && onPreferenceChange),
    ...sections,
  };
  const content = (
    <Stack gap={8}>
      {visibleSections.notifications && (
        <Section
          title={standalone ? undefined : title}
          description={standalone ? undefined : description}
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
  if (!standalone) return content;
  return (
    <PageShell as={as}>
      <Container className="py-8">
        <PageHeader title={title} description={description} />
        <div className="pt-6">{content}</div>
      </Container>
    </PageShell>
  );
}
