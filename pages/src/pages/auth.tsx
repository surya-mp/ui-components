import { type ReactNode } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  PageShell,
} from '@sypra-ui/ui';
import { AuthForm } from '../widgets/auth-form';
import type { AuthProps } from '../widgets/auth-types';
import {
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from '../widgets/reset-password-form';

type AuthPageProps = AuthProps & {
  title?: string;
  description?: string;
  as?: 'main' | 'div';
};

export function LoginPage({
  title = 'Welcome back',
  description = 'Sign in to continue.',
  as,
  ...props
}: AuthPageProps) {
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
}: AuthPageProps) {
  return (
    <AuthPage title={title} description={description} as={as}>
      <AuthForm mode="signup" {...props} />
    </AuthPage>
  );
}
export function ForgotPasswordPage({
  as,
  ...props
}: AuthProps & { as?: 'main' | 'div' }) {
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
export function ResetPasswordPage({
  title = 'Choose a new password',
  description = 'Use a new password that you do not use elsewhere.',
  as,
  ...props
}: {
  title?: string;
  description?: string;
  as?: 'main' | 'div';
} & ResetPasswordFormProps) {
  return (
    <AuthPage title={title} description={description} as={as}>
      <ResetPasswordForm {...props} />
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
