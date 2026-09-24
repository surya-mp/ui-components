import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OrganizationPage } from './organization';

describe('organization page', () => {
  it('keeps customer organization membership and invitations callback-driven', async () => {
    const user = userEvent.setup();
    const onInvite = vi.fn();
    const onChangeRole = vi.fn();
    const onResendInvitation = vi.fn();
    const onRemoveMember = vi.fn();
    const onRevokeInvitation = vi.fn();
    const member = {
      id: 'member_1',
      name: 'Avery Stone',
      email: 'avery@example.com',
      role: 'Admin',
    };
    render(
      <OrganizationPage
        organization={{ id: 'org_1', name: 'Acme', slug: 'acme', plan: 'Pro' }}
        members={[member]}
        invitations={[
          { id: 'invite_1', email: 'mina@example.com', role: 'Member' },
        ]}
        onInvite={onInvite}
        onChangeRole={onChangeRole}
        onRemoveMember={onRemoveMember}
        onResendInvitation={onResendInvitation}
        onRevokeInvitation={onRevokeInvitation}
      />,
    );

    const role = screen.getByRole('combobox', {
      name: 'Role for Avery Stone',
    });
    await user.click(role);
    await user.clear(role);
    await user.type(role, 'Viewer');
    await user.keyboard('{Enter}');
    expect(onChangeRole).toHaveBeenCalledWith(member, 'Viewer');

    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.selectOptions(screen.getByLabelText('Role'), 'Viewer');
    await user.click(screen.getByRole('button', { name: 'Send invitation' }));
    expect(onInvite).toHaveBeenCalledWith({
      email: 'new@example.com',
      role: 'Viewer',
    });

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemoveMember).toHaveBeenCalledWith(member);

    await user.click(screen.getByRole('button', { name: 'Resend' }));
    expect(onResendInvitation).toHaveBeenCalledWith({
      id: 'invite_1',
      email: 'mina@example.com',
      role: 'Member',
    });
    await user.click(screen.getByRole('button', { name: 'Revoke' }));
    expect(onRevokeInvitation).toHaveBeenCalledWith({
      id: 'invite_1',
      email: 'mina@example.com',
      role: 'Member',
    });
  });

  it('supports read-only and selectively composed organization views', () => {
    render(
      <OrganizationPage
        organization={{ id: 'org_1', name: 'Acme' }}
        members={[]}
        sections={{ summary: false, invitations: false }}
      >
        Custom workspace content
      </OrganizationPage>,
    );

    expect(screen.getByText('No members yet.')).toBeVisible();
    expect(screen.queryByText('Pending invitations')).not.toBeInTheDocument();
    expect(screen.getByText('Custom workspace content')).toBeVisible();
  });
});
