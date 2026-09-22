'use client';

import { createPortal } from 'react-dom';
import {
  useEffect,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Button, Input, Label } from './forms';
import { Dialog, DialogContent } from './dialog';
import { cn } from '../lib/utils';

export function Command({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<{ label: string; onSelect: () => void; keywords?: string[] }>;
}) {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open, onOpenChange]);
  const matches = items.filter((item) =>
    `${item.label} ${item.keywords?.join(' ') ?? ''}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-3">
        <Input
          autoFocus
          placeholder="Type a command…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />{' '}
        <div className="mt-2">
          {matches.map((item) => (
            <button
              key={item.label}
              className="rui-focus block w-full rounded p-2 text-left text-sm hover:bg-[hsl(var(--rui-accent))]"
              onClick={() => {
                item.onSelect();
                onOpenChange(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function ContextMenu({
  children,
  menu,
}: {
  children: ReactNode;
  menu: ReactNode;
}) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!point) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPoint(null);
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [point]);
  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
        setPoint({
          x: Math.min(event.clientX, window.innerWidth - 180),
          y: Math.min(event.clientY, window.innerHeight - 120),
        });
      }}
    >
      {children}
      {point &&
        createPortal(
          <>
            <button
              className="fixed inset-0 z-40 cursor-default"
              aria-label="Close context menu"
              onClick={() => setPoint(null)}
            />
            <div
              role="menu"
              className="fixed z-50 rounded border border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-1 shadow-lg"
              style={{ left: point.x, top: point.y }}
            >
              {menu}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
export function CopyButton({
  value,
  children = 'Copy',
  onCopy,
}: {
  value: string;
  children?: ReactNode;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopy?.();
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? 'Copied' : children}
    </Button>
  );
}
export function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-16', className)}
        {...props}
      />
      <button
        type="button"
        className="rui-focus absolute right-2 top-2 text-xs text-[hsl(var(--rui-muted-foreground))]"
        onClick={() => setVisible(!visible)}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
export function FileUpload({
  accept,
  multiple,
  onFiles,
  label = 'Choose files',
}: {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}) {
  const id = useId();
  return (
    <div>
      <input
        id={id}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => onFiles(Array.from(event.target.files ?? []))}
      />
      <Label
        htmlFor={id}
        className="cursor-pointer rounded-[var(--rui-radius)] border border-dashed border-[hsl(var(--rui-border))] p-6 text-center text-sm text-[hsl(var(--rui-muted-foreground))]"
      >
        {label}
      </Label>
    </div>
  );
}
