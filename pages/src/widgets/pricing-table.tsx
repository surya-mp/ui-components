import { PricingCard } from './pricing-card';
import type { PricingPlan } from './billing-types';
export function PricingTable({
  plans,
  onSelect,
}: {
  plans: PricingPlan[];
  onSelect: (plan: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <PricingCard key={plan.name} plan={plan} onSelect={onSelect} />
      ))}
    </div>
  );
}
