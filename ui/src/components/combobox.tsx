'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export type ComboboxOption = {
  value: string;
  label: ReactNode;
  keywords?: string[];
  disabled?: boolean;
};

export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select an option',
  emptyMessage = 'No options found.',
  name,
  label,
  ariaLabel,
  className,
  disabled,
}: {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: ReactNode;
  name?: string;
  label?: ReactNode;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const selectedValue = value ?? localValue;
  const selected = options.find((option) => option.value === selectedValue);
  const [query, setQuery] = useState(() =>
    typeof selected?.label === 'string' ? selected.label : '',
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const listboxId = useId();
  const selectedLabel =
    typeof selected?.label === 'string' ? selected.label : '';

  useEffect(() => setQuery(selectedLabel), [selectedLabel]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  const matches = options.filter((option) =>
    `${String(option.label)} ${option.keywords?.join(' ') ?? ''}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (value === undefined) setLocalValue(option.value);
    onValueChange?.(option.value);
    setQuery(typeof option.label === 'string' ? option.label : '');
    setOpen(false);
  };
  const move = (direction: 1 | -1) => {
    if (!matches.length) return;
    for (let index = 1; index <= matches.length; index += 1) {
      const next =
        (active + direction * index + matches.length) % matches.length;
      if (!matches[next]?.disabled) {
        setActive(next);
        return;
      }
    }
  };

  return (
    <div ref={root} className={cn('relative', className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <input
        id={inputId}
        role="combobox"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={open ? listboxId : undefined}
        aria-expanded={open}
        aria-activedescendant={open ? `${listboxId}-${active}` : undefined}
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        className="rui-focus h-10 w-full rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-transparent px-3 pr-9 text-sm placeholder:text-[hsl(var(--rui-muted-foreground))] focus:bg-[hsl(var(--rui-card))] disabled:cursor-not-allowed disabled:opacity-50"
        onFocus={() => {
          setOpen(true);
          setActive(0);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            move(1);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
            move(-1);
          } else if (event.key === 'Enter' && open) {
            event.preventDefault();
            const option = matches[active];
            if (option) choose(option);
          } else if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--rui-muted-foreground))]"
      >
        ▾
      </span>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={
            ariaLabel ?? (typeof label === 'string' ? label : 'Options')
          }
          className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-[var(--rui-radius)] border border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-1 shadow-lg"
        >
          {matches.length ? (
            matches.map((option, index) => (
              <button
                id={`${listboxId}-${index}`}
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === selectedValue}
                disabled={option.disabled}
                className={cn(
                  'rui-focus block w-full rounded px-3 py-2 text-left text-sm hover:bg-[hsl(var(--rui-accent))] disabled:cursor-not-allowed disabled:opacity-50',
                  index === active && 'bg-[hsl(var(--rui-accent))]',
                )}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(option)}
              >
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-[hsl(var(--rui-muted-foreground))]">
              {emptyMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
