import type { ReactNode } from 'react';
import { Card, CardDescription, CardTitle } from '@sypra-ui/ui';
export function FAQ({
  items,
}: {
  items: Array<{ question: string; answer: ReactNode }>;
}) {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      {items.map((item) => (
        <Card key={item.question}>
          <CardTitle>{item.question}</CardTitle>
          <CardDescription>{item.answer}</CardDescription>
        </Card>
      ))}
    </section>
  );
}
