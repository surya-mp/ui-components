import type { ReactNode } from 'react';
import { Section, Stack } from '@sypra-ui/ui';
import type {
  Invoice,
  PaymentMethod,
  Subscription,
} from '../widgets/billing-types';
import { InvoiceTable } from '../widgets/invoice-table';
import { PaymentMethodCard } from '../widgets/payment-method-card';
import { SubscriptionCard } from '../widgets/subscription-card';

export function BillingPage({
  subscription,
  paymentMethod,
  invoices,
  onChangePlan,
  onUpdatePaymentMethod,
  onCancel,
  onViewInvoice,
  sections,
  children,
}: {
  subscription?: Subscription;
  paymentMethod?: PaymentMethod;
  invoices?: Invoice[];
  onChangePlan?: () => void;
  onUpdatePaymentMethod?: () => void;
  onCancel?: () => void;
  onViewInvoice?: (invoice: Invoice) => void;
  sections?: {
    subscription?: boolean;
    paymentMethod?: boolean;
    invoices?: boolean;
  };
  children?: ReactNode;
}) {
  const visibleSections = {
    subscription: true,
    paymentMethod: true,
    invoices: true,
    ...sections,
  };
  return (
    <Stack gap={8}>
      {visibleSections.subscription && (
        <Section
          title="Billing"
          description="Manage your plan and payment details."
        >
          <SubscriptionCard
            subscription={subscription}
            onChangePlan={onChangePlan}
            onCancel={onCancel}
          />
        </Section>
      )}
      {visibleSections.paymentMethod && (
        <PaymentMethodCard
          paymentMethod={paymentMethod}
          onUpdate={onUpdatePaymentMethod}
        />
      )}
      {visibleSections.invoices && (
        <Section title="Invoices">
          <InvoiceTable invoices={invoices ?? []} onView={onViewInvoice} />
        </Section>
      )}
      {children}
    </Stack>
  );
}
