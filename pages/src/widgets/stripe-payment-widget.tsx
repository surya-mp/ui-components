'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@sypra-ui/ui';
import { StripeElementsProvider } from './stripe-elements-provider';
import { StripePaymentForm } from './stripe-payment-form';
import type { StripePaymentWidgetProps } from './stripe-types';
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
