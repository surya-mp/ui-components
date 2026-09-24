import { type ReactNode } from 'react';
import { Card, Container, PageShell } from '@sypra-ui/ui';

export type StatusTone = 'success' | 'info' | 'warning' | 'error';

export type StatusPageProps = {
  title: ReactNode;
  description?: ReactNode;
  tone?: StatusTone;
  code?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  as?: 'main' | 'div';
};

const toneStyles: Record<StatusTone, string> = {
  success:
    'bg-[hsl(var(--rui-success-background))] text-[hsl(var(--rui-success-foreground))]',
  info: 'bg-[hsl(var(--rui-primary))]/10 text-[hsl(var(--rui-primary))]',
  warning:
    'bg-[hsl(var(--rui-warning-background))] text-[hsl(var(--rui-warning-foreground))]',
  error:
    'bg-[hsl(var(--rui-destructive-background))] text-[hsl(var(--rui-destructive-text))]',
};

function StatusMark({ tone }: { tone: StatusTone }) {
  return (
    <span
      className={`inline-flex size-12 items-center justify-center rounded-full ${toneStyles[tone]}`}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        {tone === 'success' ? (
          <path
            d="m5 12 4 4L19 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : tone === 'info' ? (
          <>
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 11v5m0-8h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              d="M12 3 2.8 19h18.4L12 3Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 9v4m0 3h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </span>
  );
}

/** A centered, application-controlled result page for completion and system states. */
export function StatusPage({
  title,
  description,
  tone = 'info',
  code,
  eyebrow,
  actions,
  children,
  className,
  as,
}: StatusPageProps) {
  return (
    <PageShell as={as}>
      <Container className="flex min-h-screen items-center justify-center py-8 sm:py-12">
        <Card
          className={`w-full max-w-xl px-5 py-8 text-center sm:px-10 sm:py-12 ${className ?? ''}`}
        >
          {code && (
            <p
              aria-hidden="true"
              className="text-sm font-semibold tracking-[0.2em] text-[hsl(var(--rui-muted-foreground))]"
            >
              {code}
            </p>
          )}
          <div className="mt-4">
            <StatusMark tone={tone} />
          </div>
          {eyebrow && (
            <p className="mt-5 text-sm font-medium text-[hsl(var(--rui-muted-foreground))]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[hsl(var(--rui-muted-foreground))]">
              {description}
            </p>
          )}
          {actions && (
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {actions}
            </div>
          )}
          {children && <div className="mt-6 text-left">{children}</div>}
        </Card>
      </Container>
    </PageShell>
  );
}

type StatusVariantProps = Omit<
  StatusPageProps,
  'title' | 'description' | 'tone'
> & {
  title?: ReactNode;
  description?: ReactNode;
  tone?: StatusTone;
};

const paymentStates = {
  succeeded: {
    title: 'Payment complete',
    description: 'Your payment was confirmed successfully.',
    tone: 'success',
  },
  processing: {
    title: 'Payment is processing',
    description: 'We will update your account when the payment is confirmed.',
    tone: 'info',
  },
  failed: {
    title: 'Payment could not be completed',
    description:
      'Your payment method was not charged. Try another payment method.',
    tone: 'error',
  },
} satisfies Record<
  string,
  Required<Pick<StatusPageProps, 'title' | 'description' | 'tone'>>
>;

export function PaymentStatusPage({
  status,
  title,
  description,
  tone,
  ...props
}: StatusVariantProps & { status: keyof typeof paymentStates }) {
  const state = paymentStates[status];
  return (
    <StatusPage
      {...props}
      tone={tone ?? state.tone}
      title={title ?? state.title}
      description={description ?? state.description}
    />
  );
}

const oauthStates = {
  succeeded: {
    title: 'You are signed in',
    description: 'Your account is ready to use.',
    tone: 'success',
  },
  failed: {
    title: 'Sign-in could not be completed',
    description: 'Try again or choose another sign-in method.',
    tone: 'error',
  },
  cancelled: {
    title: 'Sign-in was cancelled',
    description: 'No changes were made to your account.',
    tone: 'warning',
  },
} satisfies Record<
  string,
  Required<Pick<StatusPageProps, 'title' | 'description' | 'tone'>>
>;

export function OAuthStatusPage({
  status,
  title,
  description,
  tone,
  ...props
}: StatusVariantProps & { status: keyof typeof oauthStates }) {
  const state = oauthStates[status];
  return (
    <StatusPage
      {...props}
      tone={tone ?? state.tone}
      title={title ?? state.title}
      description={description ?? state.description}
    />
  );
}

const verificationStates = {
  verified: {
    title: 'Email verified',
    description: 'Your email address has been confirmed.',
    tone: 'success',
  },
  pending: {
    title: 'Check your inbox',
    description: 'Use the verification link we sent to continue.',
    tone: 'info',
  },
  expired: {
    title: 'Verification link expired',
    description: 'Request a new link to verify your email address.',
    tone: 'warning',
  },
} satisfies Record<
  string,
  Required<Pick<StatusPageProps, 'title' | 'description' | 'tone'>>
>;

export function EmailVerificationPage({
  status,
  title,
  description,
  tone,
  ...props
}: StatusVariantProps & { status: keyof typeof verificationStates }) {
  const state = verificationStates[status];
  return (
    <StatusPage
      {...props}
      tone={tone ?? state.tone}
      title={title ?? state.title}
      description={description ?? state.description}
    />
  );
}

const invitationStates = {
  accepted: {
    title: 'Invitation accepted',
    description: 'You can now access the workspace.',
    tone: 'success',
  },
  expired: {
    title: 'Invitation expired',
    description: 'Ask an administrator to send a new invitation.',
    tone: 'warning',
  },
  invalid: {
    title: 'Invitation is not valid',
    description: 'It may have already been used or revoked.',
    tone: 'error',
  },
} satisfies Record<
  string,
  Required<Pick<StatusPageProps, 'title' | 'description' | 'tone'>>
>;

export function InvitationStatusPage({
  status,
  title,
  description,
  tone,
  ...props
}: StatusVariantProps & { status: keyof typeof invitationStates }) {
  const state = invitationStates[status];
  return (
    <StatusPage
      {...props}
      tone={tone ?? state.tone}
      title={title ?? state.title}
      description={description ?? state.description}
    />
  );
}

export function AccessDeniedPage(props: StatusVariantProps) {
  return (
    <StatusPage
      {...props}
      code={props.code ?? '403'}
      tone={props.tone ?? 'error'}
      title={props.title ?? 'Access denied'}
      description={
        props.description ?? 'You do not have permission to view this page.'
      }
    />
  );
}

export function NotFoundPage(props: StatusVariantProps) {
  return (
    <StatusPage
      {...props}
      code={props.code ?? '404'}
      tone={props.tone ?? 'info'}
      title={props.title ?? 'Page not found'}
      description={
        props.description ?? 'The page may have moved or no longer exists.'
      }
    />
  );
}

export function ServerErrorPage(props: StatusVariantProps) {
  return (
    <StatusPage
      {...props}
      code={props.code ?? '500'}
      tone={props.tone ?? 'error'}
      title={props.title ?? 'Something went wrong'}
      description={props.description ?? 'Try again in a moment.'}
    />
  );
}

export function MaintenancePage(props: StatusVariantProps) {
  return (
    <StatusPage
      {...props}
      tone={props.tone ?? 'warning'}
      title={props.title ?? 'We are improving the service'}
      description={props.description ?? 'Please check back shortly.'}
    />
  );
}

export function OfflinePage(props: StatusVariantProps) {
  return (
    <StatusPage
      {...props}
      tone={props.tone ?? 'warning'}
      title={props.title ?? 'You are offline'}
      description={props.description ?? 'Check your connection and try again.'}
    />
  );
}
