import { Button, CardTitle } from '@sypra-ui/ui';
import { NotificationList } from './notification-list';
import type { AppNotification } from './notification-item';

export function NotificationPreview({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onShowAll,
  showAll = Boolean(onShowAll),
  label = 'Notifications',
  viewAllLabel = 'Show all notifications',
  previewLimit = 5,
}: {
  notifications: AppNotification[];
  onMarkRead?: (notification: AppNotification) => void | Promise<void>;
  onMarkAllRead?: () => void | Promise<void>;
  onShowAll?: () => void;
  showAll?: boolean;
  label?: string;
  viewAllLabel?: string;
  previewLimit?: number;
}) {
  return (
    <>
      <div className="border-b border-[hsl(var(--rui-border))] px-4 py-3">
        <CardTitle>{label}</CardTitle>
      </div>
      <NotificationList
        notifications={notifications.slice(0, Math.max(0, previewLimit))}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
        compact
      />
      {showAll && onShowAll && (
        <div className="border-t border-[hsl(var(--rui-border))] p-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onShowAll}
          >
            {viewAllLabel}
          </Button>
        </div>
      )}
    </>
  );
}
