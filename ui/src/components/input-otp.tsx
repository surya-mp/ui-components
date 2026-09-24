'use client';

import { useRef, useState } from 'react';
import { cn } from '../lib/utils';

export function InputOTP({
  length = 6,
  value,
  defaultValue = '',
  onValueChange,
  onComplete,
  name,
  numeric = true,
  disabled,
  className,
}: {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  name?: string;
  numeric?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(defaultValue.slice(0, length));
  const current = (value ?? localValue).slice(0, length);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const clean = (next: string) =>
    next.replace(numeric ? /[^0-9]/g : /[^a-z0-9]/gi, '').slice(0, length);
  const update = (next: string) => {
    const cleaned = clean(next);
    if (value === undefined) setLocalValue(cleaned);
    onValueChange?.(cleaned);
    if (cleaned.length === length) onComplete?.(cleaned);
  };
  const fillFrom = (start: number, next: string) => {
    const characters = current.split('');
    clean(next)
      .split('')
      .forEach((character, index) => {
        if (start + index < length) characters[start + index] = character;
      });
    const updated = characters.join('').slice(0, length);
    update(updated);
    refs.current[Math.min(length - 1, start + clean(next).length)]?.focus();
  };
  return (
    <div
      className={cn('flex gap-2', className)}
      role="group"
      aria-label="One-time password"
    >
      {name && <input type="hidden" name={name} value={current} />}
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          aria-label={`Digit ${index + 1}`}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          inputMode={numeric ? 'numeric' : 'text'}
          maxLength={length > 1 ? length : 1}
          disabled={disabled}
          value={current[index] ?? ''}
          className="rui-focus size-10 rounded-[var(--rui-radius)] border border-[hsl(var(--rui-input))] bg-transparent text-center text-lg font-semibold focus:bg-[hsl(var(--rui-card))] disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(event) => fillFrom(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !current[index] && index > 0) {
              event.preventDefault();
              update(`${current.slice(0, index - 1)}${current.slice(index)}`);
              refs.current[index - 1]?.focus();
            } else if (event.key === 'ArrowLeft' && index > 0) {
              event.preventDefault();
              refs.current[index - 1]?.focus();
            } else if (event.key === 'ArrowRight' && index < length - 1) {
              event.preventDefault();
              refs.current[index + 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            fillFrom(index, event.clipboardData.getData('text'));
          }}
        />
      ))}
    </div>
  );
}
