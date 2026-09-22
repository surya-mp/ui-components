import { type ReactNode } from 'react';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  EmptyState,
  Section,
  Stack,
  type DataColumn,
} from '@sypra-ui/ui';

export type Subscription = {
  plan: string;
  price: string;
  interval?: string;
  nextBillingDate?: string;
  status?: string;
  usage?: Array<{ label: string; value: string }>;
};
export type PaymentMethod = {
  brand: string;
  last4: string;
  expiresAt?: string;
};
export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: string;
  href?: string;
};
export function SubscriptionCard({
  subscription,
  onChangePlan,
  onCancel,
}: {
  subscription?: Subscription;
  onChangePlan?: () => void;
  onCancel?: () => void;
}) {
  if (!subscription)
    return (
      <EmptyState
        title="No active subscription"
        action={
          onChangePlan && <Button onClick={onChangePlan}>View plans</Button>
        }
      />
    );
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{subscription.plan}</CardTitle>
          <CardDescription>
            {subscription.price}
            {subscription.interval && ` / ${subscription.interval}`}
          </CardDescription>
        </div>
        {subscription.status && (
          <Badge variant="success">{subscription.status}</Badge>
        )}
      </CardHeader>
      {subscription.nextBillingDate && (
        <p className="text-sm text-[hsl(var(--rui-muted-foreground))]">
          Next billing date: {subscription.nextBillingDate}
        </p>
      )}
      {subscription.usage?.length ? (
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {subscription.usage.map((item) => (
            <div
              key={item.label}
              className="rounded bg-[hsl(var(--rui-muted))] p-3"
            >
              <strong className="block">{item.value}</strong>
              <span className="text-[hsl(var(--rui-muted-foreground))]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {onChangePlan && <Button onClick={onChangePlan}>Change plan</Button>}
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Manage subscription
          </Button>
        )}
      </div>
    </Card>
  );
}
export function PaymentMethodCard({
  paymentMethod,
  onUpdate,
}: {
  paymentMethod?: PaymentMethod;
  onUpdate?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Payment method</CardTitle>
          <CardDescription>
            {paymentMethod
              ? `${paymentMethod.brand} •••• ${paymentMethod.last4}${paymentMethod.expiresAt ? ` · Expires ${paymentMethod.expiresAt}` : ''}`
              : 'No payment method on file.'}
          </CardDescription>
        </div>
        {onUpdate && (
          <Button variant="outline" size="sm" onClick={onUpdate}>
            {paymentMethod ? 'Update' : 'Add payment method'}
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
export function InvoiceTable({
  invoices,
  onView,
}: {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
}) {
  const columns: DataColumn<Invoice>[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'amount', header: 'Amount' },
    {
      key: 'status',
      header: 'Status',
      cell: (invoice) => (
        <Badge
          variant={
            invoice.status.toLowerCase() === 'paid' ? 'success' : 'warning'
          }
        >
          {invoice.status}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: <span className="sr-only">Actions</span>,
      cell: (invoice) =>
        onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(invoice)}>
            View
          </Button>
        ),
    },
  ];
  return (
    <DataTable
      data={invoices}
      columns={columns}
      emptyMessage="No invoices yet."
    />
  );
}
export function PricingTable({
  plans,
  onSelect,
}: {
  plans: Array<{
    name: string;
    price: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
  }>;
  onSelect: (plan: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={
            plan.highlighted ? 'border-[hsl(var(--rui-primary))]' : undefined
          }
        >
          <CardTitle>{plan.name}</CardTitle>
          <p className="mt-3 text-2xl font-bold">{plan.price}</p>
          {plan.description && (
            <CardDescription>{plan.description}</CardDescription>
          )}
          <ul className="my-5 space-y-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature}>✓ {feature}</li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant={plan.highlighted ? 'primary' : 'outline'}
            onClick={() => onSelect(plan.name)}
          >
            Choose {plan.name}
          </Button>
        </Card>
      ))}
    </div>
  );
}
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
