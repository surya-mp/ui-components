import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '../lib/utils';

type ChildrenProps = { children?: ReactNode; className?: string };

export const PageShell = ({
  as: Component = 'main',
  className,
  ...props
}: ComponentPropsWithoutRef<'main'> & { as?: 'main' | 'div' }) => (
  <Component
    className={cn(
      'min-h-screen bg-[hsl(var(--rui-background))] text-[hsl(var(--rui-foreground))]',
      className,
    )}
    {...props}
  />
);
export const PageHeader = ({
  as: Heading = 'h1',
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) => (
  <header
    className={cn(
      'flex flex-wrap items-start justify-between gap-4 border-b border-[hsl(var(--rui-border))] pb-5',
      className,
    )}
  >
    <div>
      <Heading className="text-2xl font-bold tracking-tight">{title}</Heading>
      {description && (
        <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
          {description}
        </p>
      )}
    </div>
    {actions}
  </header>
);
export const PageContent = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('py-6', className)} {...props} />
);
export const Section = ({
  title,
  description,
  children,
  className,
}: ChildrenProps & { title?: ReactNode; description?: ReactNode }) => (
  <section className={cn('space-y-4', className)}>
    {title && (
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[hsl(var(--rui-muted-foreground))]">
            {description}
          </p>
        )}
      </div>
    )}
    {children}
  </section>
);
export const Stack = ({
  gap = 4,
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { gap?: 1 | 2 | 3 | 4 | 6 | 8 }) => (
  <div
    className={cn(
      'flex flex-col',
      {
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
      }[gap],
      className,
    )}
    {...props}
  />
);
export const Container = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}
    {...props}
  />
);
