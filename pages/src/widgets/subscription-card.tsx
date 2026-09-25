import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
} from '@sypra-ui/ui';
import type { Subscription } from './billing-types';
import { UsageMetric } from './usage-metric';
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
            <UsageMetric key={item.label} {...item} />
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
