import type { ReactNode } from 'react';
import { Button } from './button';
import { Alert } from './alert';
export const ErrorState = ({
  title = 'Something went wrong',
  onRetry,
  className,
}: {
  title?: ReactNode;
  onRetry?: () => void;
  className?: string;
}) => (
  <Alert title={title} variant="destructive" className={className}>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        Try again
      </Button>
    )}
  </Alert>
);
