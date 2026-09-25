import type { ReactNode } from 'react';
import { Stack } from '@sypra-ui/ui';
import { StripeBillingWidget } from '../widgets/stripe-billing-widget';
import { StripePaymentWidget } from '../widgets/stripe-payment-widget';
import type { StripePaymentWidgetProps } from '../widgets/stripe-types';

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
