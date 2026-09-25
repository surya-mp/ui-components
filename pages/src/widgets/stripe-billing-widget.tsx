'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@sypra-ui/ui';
import { StripeBillingForm } from './stripe-billing-form';
import { StripeElementsProvider } from './stripe-elements-provider';
import type { StripePaymentWidgetProps } from './stripe-types';
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
