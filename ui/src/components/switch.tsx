import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';
export const Switch = ({
  checked,
  onChange,
  disabled,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) => (
  <label
    className={cn(
      'inline-flex cursor-pointer items-center',
      disabled && 'cursor-not-allowed opacity-50',
      className,
    )}
  >
    <input
      type="checkbox"
      className="peer sr-only"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
    <span className="h-6 w-11 rounded-full bg-[hsl(var(--rui-muted))] p-0.5 transition peer-checked:bg-[hsl(var(--rui-primary))] peer-focus-visible:ring-2 peer-focus-visible:ring-[hsl(var(--rui-ring))] peer-focus-visible:ring-offset-2">
      <span className="block size-5 rounded-full bg-[hsl(var(--rui-switch-thumb))] transition peer-checked:translate-x-5" />
    </span>
  </label>
);
