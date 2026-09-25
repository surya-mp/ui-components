import type { ReactNode } from 'react';
import type { PaymentElementProps } from '@stripe/react-stripe-js';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
export type StripeInstance = Stripe | PromiseLike<Stripe | null> | null;
export type StripeElementsConfiguration = {
  stripe: StripeInstance;
  options: StripeElementsOptions;
  paymentElementOptions?: PaymentElementProps['options'];
};
export type StripePaymentFormProps = {
  returnUrl: string;
  paymentElementOptions?: PaymentElementProps['options'];
  submitLabel?: ReactNode;
  loadingLabel?: ReactNode;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  children?: ReactNode;
};
export type StripePaymentWidgetProps = StripeElementsConfiguration &
  StripePaymentFormProps & {
    title?: ReactNode;
    description?: ReactNode;
    className?: string;
  };
