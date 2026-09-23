import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  AccountSettingsPage,
  ApiKeyCard,
  AuthProviderButton,
  BillingPage,
  DangerZone,
  LandingPage,
  LoginPage,
  MarketingHeader,
  ProfilePage,
  ProfileSummary,
  PricingCard,
  PricingTable,
  SecurityPage,
  SessionCard,
  UsageMetric,
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
    const googleButton = screen.getByRole('button', {
      name: 'Continue with Google',
    });
    expect(googleButton).toHaveClass(
      'w-full',
      'max-w-sm',
      'bg-white',
      'border-black/10',
    );
    expect(googleButton.querySelector('svg')).toHaveAttribute(
      'viewBox',
      '0 0 18 18',
    );

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
    const confirmation = screen.getByLabelText(/Type DELETE/);
    expect(button).toBeDisabled();
    expect(confirmation).toHaveAttribute('placeholder', 'DELETE');
    await user.type(confirmation, 'DELETE');
    expect(confirmation).toHaveValue('DELETE');
    await user.click(button);

    expect(onDeleteAccount).toHaveBeenCalledOnce();
  });

  it('adds the profile danger zone only when selected', () => {
    const props = {
      profile: {
        firstName: 'Avery',
        lastName: 'Stone',
        email: 'avery@example.com',
      },
      onSave: () => undefined,
      dangerZone: { onDeleteAccount: () => undefined },
    };
    const { rerender } = render(<ProfilePage {...props} />);

    expect(screen.getByText('Danger zone')).toBeInTheDocument();
    rerender(<ProfilePage {...props} sections={{ dangerZone: false }} />);
    expect(screen.queryByText('Danger zone')).not.toBeInTheDocument();
  });

  it('renders the optional username field only when selected', () => {
    const props = {
      profile: {
        firstName: 'Avery',
        lastName: 'Stone',
        email: 'avery@example.com',
        username: 'avery',
      },
      onSave: () => undefined,
    };
    const { rerender } = render(<ProfilePage {...props} />);

    expect(screen.getByLabelText(/First name/)).toHaveValue('Avery');
    expect(screen.getByLabelText(/Last name/)).toHaveValue('Stone');
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    rerender(<ProfilePage {...props} fields={{ username: true }} />);
    expect(screen.getByLabelText('Username')).toHaveValue('avery');
    rerender(<ProfilePage {...props} fields={{ username: false }} />);
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
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

  it('exposes reusable auth, account, billing, and marketing blocks', async () => {
    const user = userEvent.setup();
    const providerLogin = vi.fn();
    const selectPlan = vi.fn();
    render(
      <>
        <AuthProviderButton provider="github" onClick={providerLogin} />
        <ProfileSummary
          profile={{
            firstName: 'Avery',
            lastName: 'Stone',
            email: 'avery@example.com',
          }}
        />
        <SessionCard
          session={{ id: '1', device: 'Chrome', lastActive: 'Active now' }}
          current
        />
        <ApiKeyCard
          apiKey={{
            id: 'key_1',
            name: 'Production',
            prefix: 'sypra_live_',
            createdAt: 'Today',
          }}
        />
        <UsageMetric label="Requests" value="10k" />
        <PricingCard
          plan={{ name: 'Pro', price: '$19', features: ['Unlimited'] }}
          onSelect={selectPlan}
        />
        <MarketingHeader
          brand="Sypra"
          links={[{ label: 'Docs', href: '/docs' }]}
        />
      </>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Continue with GitHub' }),
    );
    await user.click(screen.getByRole('button', { name: 'Choose Pro' }));
    expect(providerLogin).toHaveBeenCalledOnce();
    expect(selectPlan).toHaveBeenCalledWith('Pro');
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      '/docs',
    );
    expect(screen.getByText('10k')).toBeVisible();
  });

  it('composes only the account settings sections supplied by the consumer', () => {
    render(
      <AccountSettingsPage
        profile={{
          profile: {
            firstName: 'Avery',
            lastName: 'Stone',
            email: 'avery@example.com',
          },
          onSave: () => undefined,
        }}
        sections={{ security: false, apiKeys: false, billing: false }}
      />,
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('Security')).not.toBeInTheDocument();
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
