import { Badge, Button, cn } from '@sypra-ui/ui';

export function NotificationBellButton({
  unread = 0,
  label = 'Notifications',
  className,
  onClick,
}: {
  unread?: number;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn('relative size-10 px-0', className)}
      aria-label={`${label}${unread ? ` (${unread} unread)` : ''}`}
      onClick={onClick}
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
  );
}
