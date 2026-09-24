'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export function Collapsible({
  title,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  disabled,
}: {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  disabled?: boolean;
}) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? localOpen;
  const contentId = useId();
  const toggle = () => {
    const next = !open;
    if (controlledOpen === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div
      className={cn(
        'rounded-[var(--rui-radius)] border border-[hsl(var(--rui-border))]',
        className,
      )}
    >
      <button
        type="button"
        className="rui-focus flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        aria-controls={contentId}
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
      >
        {title}
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div
          id={contentId}
          className="border-t border-[hsl(var(--rui-border))] p-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}
