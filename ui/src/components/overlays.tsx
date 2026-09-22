'use client';

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cn } from '../lib/utils';

export function Popover({
  trigger,
  children,
  className,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const root = useRef<HTMLSpanElement>(null);
  const contentId = useId();
  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open, setOpen]);
  const triggerProps = {
    'aria-controls': contentId,
    'aria-expanded': open,
    'aria-haspopup': 'dialog' as const,
    onClick: () => setOpen(!open),
  };
  const triggerElement = isValidElement<{
    onClick?: () => void;
    'aria-controls'?: string;
    'aria-expanded'?: boolean;
    'aria-haspopup'?: 'dialog';
  }>(trigger) ? (
    cloneElement(trigger, {
      ...triggerProps,
      onClick: () => {
        trigger.props.onClick?.();
        setOpen(!open);
      },
    })
  ) : (
    <button type="button" {...triggerProps}>
      {trigger}
    </button>
  );
  return (
    <span ref={root} className="relative inline-block">
      {triggerElement}
      {open && (
        <span
          id={contentId}
          role="dialog"
          className={cn(
            'absolute z-30 mt-2 block min-w-52 rounded-[var(--rui-radius)] border border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-3 shadow-lg',
            className,
          )}
        >
          {children}
        </span>
      )}
    </span>
  );
}
export const Tooltip = ({
  content,
  children,
  className,
}: {
  content: string;
  children: ReactNode;
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={visible ? id : undefined}
    >
      {children}
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-52 -translate-x-1/2 rounded bg-[hsl(var(--rui-tooltip))] px-2 py-1 text-xs text-[hsl(var(--rui-tooltip-foreground))] shadow',
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
};
export function DropdownMenu({
  trigger,
  children,
}: {
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <Popover trigger={trigger} className="right-0 p-1">
      {children}
    </Popover>
  );
}
export const DropdownMenuItem = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'button'>) => (
  <button
    className={cn(
      'rui-focus block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-[hsl(var(--rui-accent))]',
      className,
    )}
    {...props}
  />
);
