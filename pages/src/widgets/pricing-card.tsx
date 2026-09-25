import { Button, Card, CardDescription, CardTitle } from '@sypra-ui/ui';
import type { PricingPlan } from './billing-types';
export function PricingCard({
  plan,
  onSelect,
}: {
  plan: PricingPlan;
  onSelect: (plan: string) => void;
}) {
  return (
    <Card
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
  );
}
