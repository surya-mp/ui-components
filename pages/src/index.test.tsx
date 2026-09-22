import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  BillingPage,
  DangerZone,
  LandingPage,
  LoginPage,
  PricingTable,
  SecurityPage,
} from './index';

describe('page compositions', () => {
  it('submits login values without owning authentication', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <LoginPage
        as="div"
        authMethods={{ emailPassword: true }}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText('Email'), 'ava@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ava@example.com',
      password: 'secret',
      name: '',
    });
  });

  it('supports provider-only or combined sign-in methods', async () => {
    const user = userEvent.setup();
    const onProviderLogin = vi.fn();
    const onSubmit = vi.fn();
    const { rerender } = render(
      <LoginPage
        as="div"
        authMethods={{ google: true, github: true }}
        onProviderLogin={onProviderLogin}
      />,
    );

    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
    expect(screen.queryByText('OR')).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Continue with Google' }),
    );
    expect(onProviderLogin).toHaveBeenCalledWith('google');

    rerender(
      <LoginPage
        as="div"
        authMethods={{ emailPassword: true, google: true, github: true }}
        onProviderLogin={onProviderLogin}
        onSubmit={onSubmit}
      />,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue with GitHub' }),
    ).toBeInTheDocument();
  });

  it('requires confirmation before destructive account actions', async () => {
    const user = userEvent.setup();
    const onDeleteAccount = vi.fn();
    render(<DangerZone onDeleteAccount={onDeleteAccount} />);

    const button = screen.getByRole('button', { name: 'Delete account' });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText(/Type DELETE/), 'DELETE');
    await user.click(button);

    expect(onDeleteAccount).toHaveBeenCalledOnce();
  });

  it('reports the selected pricing plan to the application', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PricingTable
        plans={[
          {
            name: 'Pro',
            price: '$19',
            features: ['Unlimited projects'],
          },
        ]}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Choose Pro' }));
    expect(onSelect).toHaveBeenCalledWith('Pro');
  });

  it('renders only selected composition sections', () => {
    render(
      <>
        <SecurityPage
          sections={{ password: false, twoFactor: false }}
          sessions={[]}
          onRevoke={() => undefined}
          onRevokeAll={() => undefined}
        />
        <BillingPage sections={{ subscription: false, paymentMethod: false }}>
          Custom billing content
        </BillingPage>
        <LandingPage
          as="div"
          brand="Sypra"
          sections={{
            header: false,
            hero: false,
            features: false,
            footer: false,
          }}
        >
          Custom content
        </LandingPage>
      </>,
    );

    expect(screen.queryByText('Password')).not.toBeInTheDocument();
    expect(screen.queryByText('Payment method')).not.toBeInTheDocument();
    expect(screen.getByText('Invoices')).toBeInTheDocument();
    expect(screen.getByText('Custom billing content')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
