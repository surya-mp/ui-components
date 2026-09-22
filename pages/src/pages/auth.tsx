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
export type AuthValues = { email: string; password: string; name?: string };
type AuthCallbacks = {
  providers?: AuthProvider[];
  loading?: boolean;
  error?: ReactNode;
  onProviderLogin?: (provider: AuthProvider) => void;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  onLogin?: () => void;
};
type AuthMethods =
  | {
      /** Render the email/password form. Disable for provider-only sign-in. */
      emailPassword?: true;
      onSubmit: (values: AuthValues) => void | Promise<void>;
    }
  | {
      emailPassword: false;
      onSubmit?: (values: AuthValues) => void | Promise<void>;
    };
type AuthProps = AuthCallbacks & AuthMethods;
export function AuthForm({
  mode,
  onSubmit,
  emailPassword = true,
  providers = [],
  loading,
  error,
  onProviderLogin,
  onForgotPassword,
  onSignup,
  onLogin,
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
  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && (
        <Alert variant="destructive" title="Could not continue">
          {error}
        </Alert>
      )}
      {emailPassword && (
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
      {providers.length > 0 && (
        <>
          {emailPassword && (
            <div className="flex items-center gap-3 text-xs text-[hsl(var(--rui-muted-foreground))]">
              <Separator />
              <span>OR</span>
              <Separator />
            </div>
          )}
          <div className="grid gap-2">
            {providers.map((provider) => (
              <Button
                key={provider}
                type="button"
                variant="outline"
                onClick={() => onProviderLogin?.(provider)}
              >
                Continue with{' '}
                {provider === 'github'
                  ? 'GitHub'
                  : provider.slice(0, 1).toUpperCase() + provider.slice(1)}
              </Button>
            ))}
          </div>
        </>
      )}
      {emailPassword && (
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
    <PageShell as={as} className="grid place-items-center p-4">
      <Card className="w-full max-w-md">
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
