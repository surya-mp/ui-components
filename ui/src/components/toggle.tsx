'use client';

import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  className,
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}) {
  const [localPressed, setLocalPressed] = useState(defaultPressed);
  const active = pressed ?? localPressed;
  const toggle = () => {
    const next = !active;
    if (pressed === undefined) setLocalPressed(next);
    onPressedChange?.(next);
  };
  return (
    <button
      aria-pressed={active}
      className={cn(
        'rui-focus inline-flex h-10 items-center justify-center rounded-[var(--rui-radius)] border px-3 text-sm font-medium transition-colors',
        active
          ? 'border-[hsl(var(--rui-primary))] bg-[hsl(var(--rui-primary))] text-[hsl(var(--rui-primary-foreground))]'
          : 'border-[hsl(var(--rui-border))] hover:bg-[hsl(var(--rui-accent))]',
        className,
      )}
      {...props}
      type="button"
      onClick={toggle}
    >
      {children}
    </button>
  );
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  className,
}: {
  options: Array<{ value: string; label: ReactNode; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(
    defaultValue ?? options[0]?.value ?? '',
  );
  const selected = value ?? localValue;
  const select = (next: string) => {
    if (value === undefined) setLocalValue(next);
    onValueChange?.(next);
  };
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex rounded-[var(--rui-radius)] border border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-muted))] p-1',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          aria-pressed={selected === option.value}
          className={cn(
            'rui-focus h-8 rounded-[calc(var(--rui-radius)-.1rem)] px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            selected === option.value
              ? 'bg-[hsl(var(--rui-card))] shadow-sm'
              : 'text-[hsl(var(--rui-muted-foreground))] hover:text-[hsl(var(--rui-foreground))]',
          )}
          onClick={() => select(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
