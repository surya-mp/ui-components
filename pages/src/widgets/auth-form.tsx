'use client';

import { useState, type FormEvent } from 'react';
import { Alert, Button, Input, Label, PasswordInput } from '@sypra-ui/ui';
import { AuthDivider } from './auth-divider';
import { AuthProviderButton } from './auth-provider-button';
import type { AuthProps, AuthValues } from './auth-types';

export function AuthForm({
  mode,
  onSubmit,
  authMethods,
  loginOptions,
  emailPassword = true,
  providers = [],
  loading,
  error,
  onProviderLogin,
  onForgotPassword,
  onSignup,
  onLogin,
  children,
}: AuthProps & { mode: 'login' | 'signup' | 'forgot' }) {
  const [values, setValues] = useState<AuthValues>({
    email: '',
    password: '',
    name: '',
  });
  const options = authMethods
    ? [
        ...(authMethods.emailPassword ? ['email-password'] : []),
        ...(authMethods.google ? ['google'] : []),
        ...(authMethods.github ? ['github'] : []),
      ]
    : (loginOptions ?? [
        ...(emailPassword ? ['email-password'] : []),
        ...providers,
      ]);
  const usesEmailPassword = options.includes('email-password');
  const selectedProviders = options.filter(
    (option) => option !== 'email-password',
  );
  const isForgot = mode === 'forgot';
  return (
    <form
      className="space-y-4"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        void onSubmit?.(values);
      }}
    >
      {error && (
        <Alert variant="destructive" title="Could not continue">
          {error}
        </Alert>
      )}
      {usesEmailPassword && (
        <>
          {mode === 'signup' && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={values.name}
                onChange={(event) =>
                  setValues({ ...values, name: event.target.value })
                }
                autoComplete="name"
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) =>
                setValues({ ...values, email: event.target.value })
              }
              autoComplete="email"
              required
            />
          </div>
          {!isForgot && (
            <div>
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="rui-focus text-xs text-[hsl(var(--rui-primary))]"
                    onClick={onForgotPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <PasswordInput
                id="password"
                value={values.password}
                onChange={(event) =>
                  setValues({ ...values, password: event.target.value })
                }
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
                required
              />
            </div>
          )}
          <Button className="w-full" type="submit" loading={loading}>
            {isForgot
              ? 'Send reset link'
              : mode === 'signup'
                ? 'Create account'
                : 'Continue'}
          </Button>
        </>
      )}
      {selectedProviders.length > 0 && (
        <>
          {usesEmailPassword && <AuthDivider />}
          <div className="grid gap-2">
            {selectedProviders.map((provider) => (
              <AuthProviderButton
                key={provider}
                provider={provider}
                onClick={() => onProviderLogin?.(provider)}
              />
            ))}
          </div>
        </>
      )}
      {usesEmailPassword && (
        <p className="text-center text-sm text-[hsl(var(--rui-muted-foreground))]">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button
                type="button"
                className="rui-focus text-[hsl(var(--rui-primary))]"
                onClick={onSignup}
              >
                Sign up
              </button>
            </>
          ) : mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="rui-focus text-[hsl(var(--rui-primary))]"
                onClick={onLogin}
              >
                Log in
              </button>
            </>
          ) : (
            <button
              type="button"
              className="rui-focus text-[hsl(var(--rui-primary))]"
              onClick={onLogin}
            >
              Back to login
            </button>
          )}
        </p>
      )}
      {children}
    </form>
  );
}
