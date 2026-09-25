import { Badge, Button, CardTitle, Popover, cn } from '@sypra-ui/ui';
import { NotificationList } from './notification-list';
import type { AppNotification } from './notification-item';

export function NotificationBell({
  notifications,
  onMarkRead,
  onMarkAllRead,
  label = 'Notifications',
  className,
}: {
  notifications: AppNotification[];
  onMarkRead?: (notification: AppNotification) => void | Promise<void>;
  onMarkAllRead?: () => void | Promise<void>;
  label?: string;
  className?: string;
}) {
  const unread = notifications.filter(
    (notification) => !notification.read,
  ).length;
  return (
    <Popover
      className={cn(
        'right-0 w-[min(24rem,calc(100vw-2rem))] overflow-hidden p-0',
        className,
      )}
      trigger={
        <Button
          type="button"
          variant="outline"
          className="relative size-10 px-0"
          aria-label={`${label}${unread ? ` (${unread} unread)` : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {unread > 0 && (
            <Badge className="absolute -right-1 -top-1 min-w-5 justify-center px-1">
              {unread > 99 ? '99+' : unread}
            </Badge>
          )}
        </Button>
      }
    >
      <div className="border-b border-[hsl(var(--rui-border))] px-4 py-3">
        <CardTitle>{label}</CardTitle>
      </div>
      <NotificationList
        notifications={notifications}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
      />
    </Popover>
  );
}
