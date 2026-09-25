import { Card, CardDescription, CardTitle } from '@sypra-ui/ui';
import type { MarketingFeature } from './marketing-types';
export function FeatureGrid({ features }: { features: MarketingFeature[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title} className="h-full">
          {feature.icon && (
            <div className="mb-3 text-[hsl(var(--rui-primary))]">
              {feature.icon}
            </div>
          )}
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </Card>
      ))}
    </section>
  );
}
