import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const stripe = vi.hoisted(() => ({
  confirmPayment: vi.fn(),
  confirmSetup: vi.fn(),
  submit: vi.fn(),
}));

vi.mock('@stripe/react-stripe-js', async () => {
  const { createElement } = await import('react');
  return {
    Elements: ({ children }: { children?: ReactNode }) =>
      createElement('div', { 'data-testid': 'stripe-elements' }, children),
    PaymentElement: () =>
      createElement('div', { 'data-testid': 'payment-element' }),
    useElements: () => ({ submit: stripe.submit }),
    useStripe: () => ({
      confirmPayment: stripe.confirmPayment,
      confirmSetup: stripe.confirmSetup,
    }),
  };
});

import {
  StripeBillingForm,
  StripePaymentForm,
  StripePaymentPage,
} from './payments';

describe('Stripe payment compositions', () => {
  beforeEach(() => {
    stripe.submit.mockReset();
    stripe.confirmPayment.mockReset();
    stripe.confirmSetup.mockReset();
    stripe.submit.mockResolvedValue({});
    stripe.confirmPayment.mockResolvedValue({});
    stripe.confirmSetup.mockResolvedValue({});
  });

  it('confirms a one-time payment with the Payment Element', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <StripePaymentForm
        returnUrl="https://example.com/payment-complete"
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Pay now' }));

    expect(stripe.submit).toHaveBeenCalledOnce();
    expect(stripe.confirmPayment).toHaveBeenCalledWith({
      elements: expect.anything(),
      confirmParams: {
        return_url: 'https://example.com/payment-complete',
      },
      redirect: 'if_required',
    });
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('uses a SetupIntent flow when billing only saves a payment method', async () => {
    const user = userEvent.setup();
    render(
      <StripeBillingForm
        mode="setup"
        returnUrl="https://example.com/billing-complete"
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Save payment method' }),
    );

    expect(stripe.confirmSetup).toHaveBeenCalledOnce();
    expect(stripe.confirmPayment).not.toHaveBeenCalled();
  });

  it('shows validation and Stripe confirmation errors without reporting success', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const onSuccess = vi.fn();
    stripe.submit.mockResolvedValueOnce({
      error: { message: 'Enter card details' },
    });
    render(
      <StripePaymentForm
        returnUrl="https://example.com/payment-complete"
        onError={onError}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Pay now' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter card details');
    expect(stripe.confirmPayment).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();

    stripe.submit.mockResolvedValueOnce({});
    stripe.confirmPayment.mockResolvedValueOnce({
      error: { message: 'Card was declined' },
    });
    await user.click(screen.getByRole('button', { name: 'Pay now' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Card was declined');
    expect(onError).toHaveBeenCalledWith('Card was declined');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('renders only the requested payment page sections', () => {
    render(
      <StripePaymentPage
        payment={{
          stripe: null,
          options: { clientSecret: 'payment_secret' },
          returnUrl: 'https://example.com/payment-complete',
        }}
        billing={{
          stripe: null,
          options: { clientSecret: 'billing_secret' },
          returnUrl: 'https://example.com/billing-complete',
        }}
        sections={{ billing: false }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Payment' })).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Billing' }),
    ).not.toBeInTheDocument();
  });
});
