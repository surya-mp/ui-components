'use client';
import { useState } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Alert, Button } from '@sypra-ui/ui';
import type { StripePaymentFormProps } from './stripe-types';

export function StripePaymentForm(props: StripePaymentFormProps) {
  return <StripeConfirmationForm intent="payment" {...props} />;
}
export function StripeConfirmationForm({
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
