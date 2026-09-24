'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export type RadioGroupOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export function RadioGroup({
  options,
  name,
  value,
  defaultValue,
  onValueChange,
  label,
  error,
  orientation = 'vertical',
  className,
}: {
  options: RadioGroupOption[];
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  error?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(defaultValue ?? '');
  const selected = value ?? localValue;
  const select = (next: string) => {
    if (value === undefined) setLocalValue(next);
    onValueChange?.(next);
  };
  return (
    <fieldset className={className}>
      {label && <legend className="mb-2 text-sm font-medium">{label}</legend>}
      <div
        className={cn(
          'gap-3',
          orientation === 'vertical' ? 'grid' : 'flex flex-wrap',
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-start gap-2 text-sm',
              option.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              className="rui-focus mt-0.5 size-4 accent-[hsl(var(--rui-primary))]"
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
              disabled={option.disabled}
              onChange={() => select(option.value)}
            />
            <span>
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <span className="mt-0.5 block text-[hsl(var(--rui-muted-foreground))]">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-[hsl(var(--rui-destructive-text))]"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
