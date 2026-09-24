import { render, screen } from '@testing-library/react';
import { Button } from '@sypra-ui/ui';
import { describe, expect, it } from 'vitest';
import {
  EmailVerificationPage,
  NotFoundPage,
  OAuthStatusPage,
  PaymentStatusPage,
  InvitationStatusPage,
  AccessDeniedPage,
  ServerErrorPage,
  MaintenancePage,
  OfflinePage,
} from './status';

describe('status pages', () => {
  it('renders a payment result with consumer-provided actions', () => {
    render(
      <PaymentStatusPage
        status="succeeded"
        actions={<Button>View receipt</Button>}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Payment complete' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View receipt' })).toBeVisible();
  });

  it('renders OAuth, verification, and system status defaults', () => {
    const { rerender } = render(<OAuthStatusPage status="cancelled" />);
    expect(screen.getByText('Sign-in was cancelled')).toBeInTheDocument();

    rerender(<EmailVerificationPage status="expired" />);
    expect(screen.getByText('Verification link expired')).toBeInTheDocument();

    rerender(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders all remaining status outcomes and consumer overrides', () => {
    const { rerender } = render(<PaymentStatusPage status="failed" />);
    expect(screen.getByText('Payment could not be completed')).toBeVisible();

    rerender(<OAuthStatusPage status="succeeded" />);
    expect(screen.getByText('You are signed in')).toBeVisible();

    rerender(<EmailVerificationPage status="pending" />);
    expect(screen.getByText('Check your inbox')).toBeVisible();

    rerender(<InvitationStatusPage status="invalid" />);
    expect(screen.getByText('Invitation is not valid')).toBeVisible();

    rerender(<AccessDeniedPage title="No access" code="NOPE" />);
    expect(screen.getByRole('heading', { name: 'No access' })).toBeVisible();
    expect(screen.getByText('NOPE')).toBeVisible();

    rerender(<ServerErrorPage />);
    expect(screen.getByText('500')).toBeVisible();
    rerender(<MaintenancePage />);
    expect(screen.getByText('We are improving the service')).toBeVisible();
    rerender(<OfflinePage />);
    expect(screen.getByText('You are offline')).toBeVisible();
  });
});
