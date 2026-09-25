import type { ReactNode } from 'react';
import { Label } from './label';
export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </Label>
      {children}
      {error ? (
        <p
          role="alert"
          className="mt-1 text-sm text-[hsl(var(--rui-destructive-text))]"
        >
          {error}
        </p>
      ) : (
        description && (
          <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
            {description}
          </p>
        )
      )}
    </div>
  );
}
