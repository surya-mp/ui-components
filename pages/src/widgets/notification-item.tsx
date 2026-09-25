import { type ReactNode } from 'react';
import { Button, CardDescription, CardTitle, cn } from '@sypra-ui/ui';

export type AppNotification = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  createdAt?: ReactNode;
  read?: boolean;
  action?: ReactNode;
};

export function NotificationItem({
  notification,
  onMarkRead,
  compact = false,
}: {
  notification: AppNotification;
  onMarkRead?: (notification: AppNotification) => void | Promise<void>;
  /** Use the one-line, truncated presentation for notification previews. */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={cn(
          'flex min-w-0 items-center gap-3 border-b border-[hsl(var(--rui-border))] px-4 py-3 last:border-b-0',
          !notification.read && 'bg-[hsl(var(--rui-muted))]/60',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'size-2 shrink-0 rounded-full',
            notification.read
              ? 'bg-[hsl(var(--rui-border))]'
              : 'bg-[hsl(var(--rui-primary))]',
          )}
        />
        <p className="min-w-0 flex-1 truncate text-sm">
          {!notification.read && <span className="sr-only">Unread. </span>}
          <span className="font-medium">{notification.title}</span>
          {notification.description && (
            <span className="text-[hsl(var(--rui-muted-foreground))]">
              {' '}
              — {notification.description}
            </span>
          )}
        </p>
        {notification.createdAt && (
          <span className="shrink-0 text-xs text-[hsl(var(--rui-muted-foreground))]">
            {notification.createdAt}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex items-start gap-3 border-b border-[hsl(var(--rui-border))] p-4 last:border-b-0',
        !notification.read && 'bg-[hsl(var(--rui-muted))]/60',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-1.5 size-2 shrink-0 rounded-full',
          notification.read
            ? 'bg-[hsl(var(--rui-border))]'
            : 'bg-[hsl(var(--rui-primary))]',
        )}
      />
      <div className="min-w-0 flex-1">
        {!notification.read && <span className="sr-only">Unread. </span>}
        <CardTitle>{notification.title}</CardTitle>
        {notification.description && (
          <CardDescription>{notification.description}</CardDescription>
        )}
        {notification.createdAt && (
          <p className="mt-1 text-xs text-[hsl(var(--rui-muted-foreground))]">
            {notification.createdAt}
          </p>
        )}
        {notification.action && (
          <div className="mt-3">{notification.action}</div>
        )}
      </div>
      {!notification.read && onMarkRead && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => void onMarkRead(notification)}
        >
          Mark read
        </Button>
      )}
    </div>
  );
}
