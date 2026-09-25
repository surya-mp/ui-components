'use client';
import { StripeConfirmationForm } from './stripe-payment-form';
import type { StripePaymentFormProps } from './stripe-types';
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
