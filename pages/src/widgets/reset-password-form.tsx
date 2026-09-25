'use client';

import { useState, type ReactNode } from 'react';
import { Alert, Button, Label, PasswordInput } from '@sypra-ui/ui';
import type { ResetPasswordValues } from './auth-types';

export type ResetPasswordFormProps = {
  token?: string;
  onSubmit?: (values: ResetPasswordValues) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
  submitLabel?: ReactNode;
  children?: ReactNode;
};
export function ResetPasswordForm({
  token,
  onSubmit,
  loading,
  error,
  submitLabel = 'Reset password',
  children,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const mismatch = Boolean(confirmation) && password !== confirmation;
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!mismatch) void onSubmit?.({ password, confirmation, token });
      }}
    >
      {error && (
        <Alert variant="destructive" title="Could not reset your password">
          {error}
        </Alert>
      )}
      <div>
        <Label htmlFor="reset-password">New password</Label>
        <PasswordInput
          id="reset-password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="reset-password-confirmation">
          Confirm new password
        </Label>
        <PasswordInput
          id="reset-password-confirmation"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          required
          aria-describedby={mismatch ? 'reset-password-error' : undefined}
        />
        {mismatch && (
          <p
            id="reset-password-error"
            role="alert"
            className="mt-1 text-sm text-[hsl(var(--rui-destructive-text))]"
          >
            Passwords do not match.
          </p>
        )}
      </div>
      <Button className="w-full" type="submit" loading={loading}>
        {submitLabel}
      </Button>
      {children}
    </form>
  );
}
