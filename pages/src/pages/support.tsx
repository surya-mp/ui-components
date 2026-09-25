import { type ReactNode } from 'react';
import { Card, Container, PageShell, cn } from '@sypra-ui/ui';
import { SupportForm, type SupportFormProps } from '../widgets/support-form';

export type SupportPageProps = Omit<SupportFormProps, 'className'> & {
  title?: ReactNode;
  description?: ReactNode;
  as?: 'main' | 'div';
  className?: string;
  formClassName?: string;
};

/** A centered support page that composes SupportForm with a readable layout. */
export function SupportPage({
  title = 'Contact support',
  description = 'Tell us what you need help with and we will get back to you.',
  as,
  className,
  formClassName,
  ...form
}: SupportPageProps) {
  return (
    <PageShell as={as}>
      <Container className="flex min-h-screen items-center justify-center py-8 sm:py-12">
        <Card className={cn('w-full max-w-2xl p-5 sm:p-8', className)}>
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm leading-6 text-[hsl(var(--rui-muted-foreground))]">
                {description}
              </p>
            )}
          </header>
          <SupportForm {...form} className={formClassName} />
        </Card>
      </Container>
    </PageShell>
  );
}
