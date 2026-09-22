'use client';

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from './forms';
import { cn } from '../lib/utils';

type ChildrenProps = { children?: ReactNode; className?: string };

type DialogState = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = createContext<DialogState | null>(null);
const DialogTitleContext = createContext<string | undefined>(undefined);
const useDialog = () => {
  const value = useContext(DialogContext);
  if (!value) throw new Error('Dialog components must be inside Dialog');
  return value;
};
export function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}
export function DialogTrigger({
  children,
  asChild = false,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useDialog();
  if (asChild && isValidElement<{ onClick?: () => void }>(children))
    return cloneElement(children, {
      onClick: () => {
        children.props.onClick?.();
        setOpen(true);
      },
    });
  return <Button onClick={() => setOpen(true)}>{children}</Button>;
}
export function DialogClose({
  children,
  asChild = false,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useDialog();
  if (asChild && isValidElement<{ onClick?: () => void }>(children))
    return cloneElement(children, {
      onClick: () => {
        children.props.onClick?.();
        setOpen(false);
      },
    });
  return (
    <Button variant="ghost" onClick={() => setOpen(false)}>
      {children}
    </Button>
  );
}
export function DialogContent({
  children,
  className,
  movable = false,
  constrainToViewport = true,
  style,
  ...props
}: ChildrenProps & {
  movable?: boolean;
  constrainToViewport?: boolean;
  style?: CSSProperties;
}) {
  const { open, setOpen } = useDialog();
  const panel = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const timer = window.setTimeout(() => panel.current?.focus(), 0);
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab' && panel.current) {
        const nodes = panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', key);
      previousFocus.current?.focus();
    };
  }, [open, setOpen]);
  useEffect(() => {
    if (!drag) return;
    const move = (event: PointerEvent) => {
      let x = offset.x + event.clientX - drag.x;
      let y = offset.y + event.clientY - drag.y;
      if (constrainToViewport && panel.current) {
        const rect = panel.current.getBoundingClientRect();
        x = Math.min(
          Math.max(x, -rect.left + 12),
          window.innerWidth - rect.right - 12 + offset.x,
        );
        y = Math.min(
          Math.max(y, -rect.top + 12),
          window.innerHeight - rect.bottom - 12 + offset.y,
        );
      }
      setOffset({ x, y });
    };
    const up = () => setDrag(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [drag, offset, constrainToViewport]);
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="presentation"
    >
      <button
        className="absolute inset-0 cursor-default bg-[hsl(var(--rui-overlay))]/50"
        aria-label="Close dialog"
        onClick={() => setOpen(false)}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-auto rounded-[calc(var(--rui-radius)+.2rem)] bg-[hsl(var(--rui-card))] p-4 text-[hsl(var(--rui-foreground))] shadow-2xl outline-none sm:p-6',
          drag && 'select-none',
          className,
        )}
        style={{
          ...style,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
        {...props}
      >
        {movable && (
          <div
            onPointerDown={(event) => {
              if (
                window.innerWidth < 640 ||
                (event.target as HTMLElement).closest(
                  'button,input,select,textarea,a,[role=button]',
                )
              )
                return;
              event.preventDefault();
              setDrag({ x: event.clientX, y: event.clientY });
            }}
            className="-mx-2 -mt-2 mb-3 cursor-grab touch-none rounded px-2 py-1 text-xs text-[hsl(var(--rui-muted-foreground))] active:cursor-grabbing"
          >
            Drag to move
          </div>
        )}
        <DialogTitleContext.Provider value={titleId}>
          {children}
        </DialogTitleContext.Provider>
      </div>
    </div>,
    document.body,
  );
}
export const DialogHeader = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('mb-5 space-y-1.5', className)} {...props} />
);
export const DialogTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'h2'>) => {
  const id = useContext(DialogTitleContext);
  return (
    <h2 id={id} className={cn('text-lg font-semibold', className)} {...props} />
  );
};
export const DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn('text-sm text-[hsl(var(--rui-muted-foreground))]', className)}
    {...props}
  />
);
export const DialogBody = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('space-y-4', className)} {...props} />
);
export const DialogFooter = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn('mt-6 flex flex-wrap justify-end gap-2', className)}
    {...props}
  />
);
export const AlertDialog = Dialog;
export const AlertDialogTrigger = DialogTrigger;
export const AlertDialogContent = DialogContent;
export const AlertDialogHeader = DialogHeader;
export const AlertDialogTitle = DialogTitle;
export const AlertDialogDescription = DialogDescription;
export const AlertDialogFooter = DialogFooter;
export const AlertDialogClose = DialogClose;
export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  loading,
  confirmDisabled,
  variant = 'destructive',
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  confirmDisabled?: boolean;
  variant?: 'primary' | 'destructive';
  children?: ReactNode;
}) {
  const confirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <DialogBody>{children}</DialogBody>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <Button
            variant={variant}
            loading={loading}
            disabled={confirmDisabled}
            onClick={() => void confirm()}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function Sheet({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Dialog>) {
  return <Dialog {...props}>{children}</Dialog>;
}
export const SheetTrigger = DialogTrigger;
export const SheetClose = DialogClose;
export function SheetContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn('ml-auto h-full max-h-none rounded-r-none', className)}
      {...props}
    />
  );
}
export const Drawer = Sheet;
export const DrawerTrigger = SheetTrigger;
export const DrawerContent = SheetContent;
