import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  BillingPage,
  CTA,
  FAQ,
  Footer,
  InvoiceTable,
  LandingPage,
  PaymentMethodCard,
  SettingsPageDemo,
  SubscriptionCard,
} from '../index';

describe('billing and marketing compositions', () => {
  it('renders billing details and forwards every management action', async () => {
    const user = userEvent.setup();
    const changePlan = vi.fn();
    const cancel = vi.fn();
    const updateMethod = vi.fn();
    const viewInvoice = vi.fn();
    const invoice = {
      id: 'invoice_1',
      date: '2026-09-01',
      amount: '$19.00',
      status: 'Paid',
    };
    render(
      <>
        <SubscriptionCard
          subscription={{
            plan: 'Pro',
            price: '$19',
            interval: 'month',
            nextBillingDate: 'Oct 1',
            status: 'Active',
            usage: [{ label: 'Projects', value: '3 / 10' }],
          }}
          onChangePlan={changePlan}
          onCancel={cancel}
        />
        <PaymentMethodCard
          paymentMethod={{ brand: 'Visa', last4: '4242', expiresAt: '12/30' }}
          onUpdate={updateMethod}
        />
        <InvoiceTable invoices={[invoice]} onView={viewInvoice} />
      </>,
    );

    expect(screen.getByText('Next billing date: Oct 1')).toBeVisible();
    expect(screen.getByText('3 / 10')).toBeVisible();
    expect(screen.getByText('Visa •••• 4242 · Expires 12/30')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Change plan' }));
    await user.click(
      screen.getByRole('button', { name: 'Manage subscription' }),
    );
    await user.click(screen.getByRole('button', { name: 'Update' }));
    await user.click(screen.getByRole('button', { name: 'View' }));
    expect(changePlan).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledOnce();
    expect(updateMethod).toHaveBeenCalledOnce();
    expect(viewInvoice).toHaveBeenCalledWith(invoice);
  });

  it('composes marketing and empty billing states without owning application behavior', () => {
    render(
      <>
        <BillingPage
          onChangePlan={() => undefined}
          sections={{ paymentMethod: false, invoices: false }}
        />
        <LandingPage
          as="div"
          brand="Sypra"
          header={{ links: [{ label: 'Pricing', href: '/pricing' }] }}
          hero={{
            title: 'Build faster',
            description: 'Composable UI.',
            primaryAction: <button>Get started</button>,
          }}
          features={[{ title: 'Accessible', description: 'Keyboard ready.' }]}
        >
          <FAQ items={[{ question: 'Is it reusable?', answer: 'Yes.' }]} />
          <CTA
            title="Start today"
            description="No setup fee."
            action={<button>Try it</button>}
          />
        </LandingPage>
        <Footer brand="Sypra" links={[{ label: 'Terms', href: '/terms' }]} />
        <SettingsPageDemo>Settings content</SettingsPageDemo>
      </>,
    );

    expect(screen.getByText('No active subscription')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
      'href',
      '/pricing',
    );
    expect(screen.getByRole('heading', { name: 'Build faster' })).toBeVisible();
    expect(screen.getByText('Accessible')).toBeVisible();
    expect(screen.getByText('Is it reusable?')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute(
      'href',
      '/terms',
    );
    expect(screen.getByText('Settings content')).toBeVisible();
  });
});
