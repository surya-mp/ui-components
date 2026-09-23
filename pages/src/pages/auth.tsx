'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  PageShell,
  PasswordInput,
  Separator,
} from '@sypra-ui/ui';

export type AuthProvider = 'google' | 'github' | string;
export type LoginOption = 'email-password' | AuthProvider;
export type AuthValues = { email: string; password: string; name?: string };
export type AuthMethods = {
  emailPassword?: boolean;
  google?: boolean;
  github?: boolean;
};

function AuthProviderIcon({ provider }: { provider: AuthProvider }) {
  if (provider === 'google') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58Z"
        />
      </svg>
    );
  }

  if (provider === 'github') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#181717"
          d="M12 .5C5.73.5.67 5.56.67 11.83c0 5.02 3.25 9.28 7.77 10.79.57.1.78-.25.78-.55v-1.94c-3.16.69-3.82-1.52-3.82-1.52-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.52-.29-5.18-1.26-5.18-5.6 0-1.24.44-2.25 1.17-3.05-.12-.29-.51-1.44.11-3 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.56.23 2.71.11 3 .73.8 1.17 1.81 1.17 3.05 0 4.35-2.67 5.31-5.2 5.59.41.35.77 1.05.77 2.11v3.13c0 .3.21.66.79.55 4.51-1.51 7.76-5.77 7.76-10.79C23.33 5.56 18.27.5 12 .5Z"
        />
      </svg>
    );
  }

  return null;
}

export function AuthProviderButton({
  provider,
  onClick,
  loading,
}: {
  provider: AuthProvider;
  onClick?: () => void;
  loading?: boolean;
}) {
  const name =
    provider === 'github'
      ? 'GitHub'
      : provider.slice(0, 1).toUpperCase() + provider.slice(1);
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      loading={loading}
      onClick={onClick}
      className="h-auto min-h-11 w-full max-w-sm gap-3 rounded-md border-black/10 bg-white px-6 py-3 text-base text-[hsl(var(--rui-foreground))] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white/95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <AuthProviderIcon provider={provider} />
      Continue with {name}
    </Button>
  );
}
export function AuthDivider({ label = 'OR' }: { label?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs text-[hsl(var(--rui-muted-foreground))]">
      <Separator />
      <span>{label}</span>
      <Separator />
    </div>
  );
}
type AuthCallbacks = {
  /** The enabled built-in authentication methods. */
  authMethods?: AuthMethods;
  /** The sign-in methods to render, such as ['google', 'github']. */
  loginOptions?: LoginOption[];
  providers?: AuthProvider[];
  loading?: boolean;
  error?: ReactNode;
  onProviderLogin?: (provider: AuthProvider) => void;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  onLogin?: () => void;
  children?: ReactNode;
};
type AuthBehavior = {
  /** Legacy alternative to omitting 'email-password' from loginOptions. */
  emailPassword?: boolean;
  onSubmit?: (values: AuthValues) => void | Promise<void>;
};
type AuthProps = AuthCallbacks & AuthBehavior;
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
}: AuthProps & {
  mode: 'login' | 'signup' | 'forgot';
}) {
  const [values, setValues] = useState<AuthValues>({
    email: '',
    password: '',
    name: '',
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void onSubmit?.(values);
  };
  const isForgot = mode === 'forgot';
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
  return (
    <form className="space-y-4" onSubmit={submit}>
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
export function LoginPage({
  title = 'Welcome back',
  description = 'Sign in to continue.',
  as,
  ...props
}: AuthProps & {
  title?: string;
  description?: string;
  as?: 'main' | 'div';
}) {
  return (
    <AuthPage title={title} description={description} as={as}>
      <AuthForm mode="login" {...props} />
    </AuthPage>
  );
}
export function SignupPage({
  title = 'Create your account',
  description = 'Start with a free account.',
  as,
  ...props
}: AuthProps & {
  title?: string;
  description?: string;
  as?: 'main' | 'div';
}) {
  return (
    <AuthPage title={title} description={description} as={as}>
      <AuthForm mode="signup" {...props} />
    </AuthPage>
  );
}
export function ForgotPasswordPage({
  as,
  ...props
}: AuthProps & {
  as?: 'main' | 'div';
}) {
  return (
    <AuthPage
      title="Reset your password"
      description="We’ll email a reset link."
      as={as}
    >
      <AuthForm mode="forgot" {...props} />
    </AuthPage>
  );
}
function AuthPage({
  title,
  description,
  children,
  as,
}: {
  title: string;
  description: string;
  children: ReactNode;
  as?: 'main' | 'div';
}) {
  return (
    <PageShell
      as={as}
      className="grid min-h-screen place-items-center px-4 py-8 sm:p-8"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        {children}
      </Card>
    </PageShell>
  );
}
export function AuthModal({
  open,
  onOpenChange,
  ...props
}: AuthProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>Sign in to your account.</DialogDescription>
        </DialogHeader>
        <AuthForm mode="login" {...props} />
      </DialogContent>
    </Dialog>
  );
}
