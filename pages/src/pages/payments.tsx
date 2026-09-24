'use client';

import { useState, type ReactNode } from 'react';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
  type PaymentElementProps,
} from '@stripe/react-stripe-js';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Stack,
} from '@sypra-ui/ui';

export type StripeInstance = Stripe | PromiseLike<Stripe | null> | null;
export type StripeElementsConfiguration = {
  /** A Stripe instance created with `loadStripe` from `@stripe/stripe-js`. */
  stripe: StripeInstance;
  /** Include a server-created PaymentIntent or SetupIntent client secret. */
  options: StripeElementsOptions;
  paymentElementOptions?: PaymentElementProps['options'];
};

export function StripeElementsProvider({
  stripe,
  options,
  children,
}: StripeElementsConfiguration & { children: ReactNode }) {
  const key = 'clientSecret' in options ? options.clientSecret : undefined;
  return (
    <Elements key={key} stripe={stripe} options={options}>
      {children}
    </Elements>
  );
}

export type StripePaymentFormProps = {
  /** A same-origin page Stripe can return to after redirect-based payments. */
  returnUrl: string;
  /** Order eligible methods and control Apple Pay or Google Pay visibility. */
  paymentElementOptions?: PaymentElementProps['options'];
  submitLabel?: ReactNode;
  loadingLabel?: ReactNode;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  children?: ReactNode;
};

function StripeConfirmationForm({
  intent,
  returnUrl,
  paymentElementOptions,
  submitLabel,
  loadingLabel = 'Processing…',
  onSuccess,
  onError,
  children,
}: StripePaymentFormProps & { intent: 'payment' | 'setup' }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const label =
    submitLabel ?? (intent === 'setup' ? 'Save payment method' : 'Pay now');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    setError(undefined);
    const validation = await elements.submit();
    if (validation.error) {
      setError(validation.error.message ?? 'Check your payment details.');
      setSubmitting(false);
      return;
    }

    const result =
      intent === 'setup'
        ? await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: returnUrl },
            redirect: 'if_required',
          })
        : await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: returnUrl },
            redirect: 'if_required',
          });

    if (result.error) {
      const message =
        result.error.message ?? 'Your payment could not be confirmed.';
      setError(message);
      onError?.(message);
      setSubmitting(false);
      return;
    }

    onSuccess?.();
    setSubmitting(false);
  };

  return (
    <form className="space-y-4" onSubmit={(event) => void submit(event)}>
      <PaymentElement options={paymentElementOptions} />
      {error && (
        <Alert variant="destructive" title="Could not continue">
          {error}
        </Alert>
      )}
      <Button
        className="w-full"
        type="submit"
        loading={submitting}
        disabled={!stripe || !elements}
      >
        {submitting ? loadingLabel : label}
      </Button>
      {children}
    </form>
  );
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  return <StripeConfirmationForm intent="payment" {...props} />;
}

export function StripeBillingForm({
  mode = 'payment',
  submitLabel = mode === 'setup' ? 'Save payment method' : 'Subscribe',
  ...props
}: StripePaymentFormProps & { mode?: 'payment' | 'setup' }) {
  return (
    <StripeConfirmationForm
      intent={mode}
      submitLabel={submitLabel}
      {...props}
    />
  );
}

export type StripePaymentWidgetProps = StripeElementsConfiguration &
  StripePaymentFormProps & {
    title?: ReactNode;
    description?: ReactNode;
    className?: string;
  };

export function StripePaymentWidget({
  stripe,
  options,
  paymentElementOptions,
  title = 'Payment',
  description = 'Choose a secure payment method.',
  className,
  ...form
}: StripePaymentWidgetProps) {
  return (
    <StripeElementsProvider stripe={stripe} options={options}>
      <Card className={className}>
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <StripePaymentForm
          {...form}
          paymentElementOptions={paymentElementOptions}
        />
      </Card>
    </StripeElementsProvider>
  );
}

export function StripeBillingWidget({
  stripe,
  options,
  paymentElementOptions,
  title = 'Billing',
  description = 'Confirm the payment method for your subscription.',
  className,
  ...form
}: StripePaymentWidgetProps & { mode?: 'payment' | 'setup' }) {
  return (
    <StripeElementsProvider stripe={stripe} options={options}>
      <Card className={className}>
        <CardHeader>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <StripeBillingForm
          {...form}
          paymentElementOptions={paymentElementOptions}
        />
      </Card>
    </StripeElementsProvider>
  );
}

export function StripePaymentPage({
  payment,
  billing,
  sections,
  children,
}: {
  payment?: StripePaymentWidgetProps;
  billing?: StripePaymentWidgetProps & { mode?: 'payment' | 'setup' };
  sections?: { payment?: boolean; billing?: boolean };
  children?: ReactNode;
}) {
  const visibleSections = {
    payment: Boolean(payment),
    billing: Boolean(billing),
    ...sections,
  };
  return (
    <Stack gap={8}>
      {visibleSections.payment && payment && (
        <StripePaymentWidget {...payment} />
      )}
      {visibleSections.billing && billing && (
        <StripeBillingWidget {...billing} />
      )}
      {children}
    </Stack>
  );
}
