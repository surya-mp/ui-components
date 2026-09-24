'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast } from './feedback';
import { cn } from '../lib/utils';

export type ToastMessage = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  duration?: number;
};

type ToastContextValue = {
  toasts: Array<Required<Pick<ToastMessage, 'id' | 'title'>> & ToastMessage>;
  toast: (message: ToastMessage) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside ToastProvider');
  return value;
}

export function ToastProvider({
  children,
  limit = 3,
  duration = 5000,
  className,
}: {
  children: ReactNode;
  limit?: number;
  duration?: number;
  className?: string;
}) {
  const [toasts, setToasts] = useState<ToastContextValue['toasts']>([]);
  const count = useRef(0);
  const dismiss = (id: string) =>
    setToasts((current) => current.filter((toast) => toast.id !== id));
  const toast = (message: ToastMessage) => {
    const id = message.id ?? `toast-${++count.current}`;
    setToasts((current) =>
      [...current, { ...message, id }].slice(-Math.max(1, limit)),
    );
    return id;
  };
  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport className={className} duration={duration} />
    </ToastContext.Provider>
  );
}

function ManagedToast({
  message,
  duration,
  onDismiss,
}: {
  message: ToastContextValue['toasts'][number];
  duration: number;
  onDismiss: () => void;
}) {
  const timeout = message.duration ?? duration;
  useEffect(() => {
    if (timeout <= 0) return;
    const timer = window.setTimeout(onDismiss, timeout);
    return () => window.clearTimeout(timer);
  }, [onDismiss, timeout]);
  return (
    <Toast
      title={message.title}
      description={message.description}
      action={message.action}
      onDismiss={onDismiss}
    />
  );
}

export function ToastViewport({
  duration = 5000,
  className,
}: {
  duration?: number;
  className?: string;
}) {
  const { toasts, dismiss } = useToast();
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-sm',
        className,
      )}
    >
      {toasts.map((message) => (
        <div key={message.id} className="pointer-events-auto w-full">
          <ManagedToast
            message={message}
            duration={duration}
            onDismiss={() => dismiss(message.id)}
          />
        </div>
      ))}
    </div>
  );
}
