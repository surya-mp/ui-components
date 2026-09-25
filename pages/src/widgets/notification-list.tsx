import { type ReactNode } from 'react';
import { Button, EmptyState } from '@sypra-ui/ui';
import { NotificationItem, type AppNotification } from './notification-item';

export function NotificationList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  emptyMessage = 'You are all caught up.',
  className,
}: {
  notifications: AppNotification[];
  onMarkRead?: (notification: AppNotification) => void | Promise<void>;
  onMarkAllRead?: () => void | Promise<void>;
  emptyMessage?: ReactNode;
  className?: string;
}) {
  const unread = notifications.filter((notification) => !notification.read);
  return (
    <div className={className}>
      {unread.length > 0 && onMarkAllRead && (
        <div className="flex justify-end border-b border-[hsl(var(--rui-border))] p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void onMarkAllRead()}
          >
            Mark all as read
          </Button>
        </div>
      )}
      {notifications.length ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))
      ) : (
        <EmptyState title="No notifications" description={emptyMessage} />
      )}
    </div>
  );
}
