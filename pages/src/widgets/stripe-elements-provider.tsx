'use client';
import type { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsConfiguration } from './stripe-types';
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
