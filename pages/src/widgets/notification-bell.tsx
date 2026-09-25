import { Popover, cn } from '@sypra-ui/ui';
import { NotificationBellButton } from './notification-bell-button';
import type { AppNotification } from './notification-item';
import { NotificationPreview } from './notification-preview';

export function NotificationBell({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onShowAll,
  onViewAll,
  showAll,
  label = 'Notifications',
  viewAllLabel = 'Show all notifications',
  previewLimit = 5,
  className,
}: {
  notifications: AppNotification[];
  onMarkRead?: (notification: AppNotification) => void | Promise<void>;
  onMarkAllRead?: () => void | Promise<void>;
  /** Called by the "Show all notifications" action. */ onShowAll?: () => void;
  /** Navigate to the application-owned full notifications page. */ onViewAll?: () => void;
  /** Show the full-list action when a navigation callback is supplied. */ showAll?: boolean;
  label?: string;
  viewAllLabel?: string;
  /** Number of newest items to render in the bell popup. */ previewLimit?: number;
  className?: string;
}) {
  const unread = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const handleShowAll = onShowAll ?? onViewAll;
  return (
    <Popover
      className={cn(
        'right-0 w-[min(24rem,calc(100vw-2rem))] overflow-hidden p-0',
        className,
      )}
      trigger={<NotificationBellButton unread={unread} label={label} />}
    >
      <NotificationPreview
        notifications={notifications}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
        onShowAll={handleShowAll}
        showAll={showAll}
        label={label}
        viewAllLabel={viewAllLabel}
        previewLimit={previewLimit}
      />
    </Popover>
  );
}
