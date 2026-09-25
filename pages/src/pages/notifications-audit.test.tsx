import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuditLogViewer, NotificationBell, NotificationsPage } from '../index';
import { CreateApiKeyDialog } from '../widgets/create-api-key-dialog';

describe('notifications, audit logs, and API-key refinements', () => {
  it('forwards persistent notification read actions and preference changes', async () => {
    const user = userEvent.setup();
    const onMarkRead = vi.fn();
    const onMarkAllRead = vi.fn();
    const onPreferenceChange = vi.fn();
    const notification = {
      id: 'notice_1',
      title: 'Invoice paid',
      description: 'Your September invoice was paid.',
      createdAt: 'Today',
    };
    render(
      <>
        <NotificationBell
          notifications={[notification]}
          onMarkRead={onMarkRead}
          onMarkAllRead={onMarkAllRead}
        />
        <NotificationsPage
          notifications={[]}
          preferences={[
            { id: 'billing', label: 'Billing updates', enabled: true },
          ]}
          onPreferenceChange={onPreferenceChange}
        />
      </>,
    );

    await user.click(screen.getByRole('button', { name: /Notifications/ }));
    await user.click(screen.getByRole('button', { name: 'Mark read' }));
    await user.click(screen.getByRole('button', { name: 'Mark all as read' }));
    await user.click(
      screen.getByRole('checkbox', { name: 'Enable Billing updates' }),
    );

    expect(onMarkRead).toHaveBeenCalledWith(notification);
    expect(onMarkAllRead).toHaveBeenCalledOnce();
    expect(onPreferenceChange).toHaveBeenCalledWith(
      { id: 'billing', label: 'Billing updates', enabled: true },
      false,
    );
  });

  it('renders application-owned audit events and asks for more history', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(
      <AuditLogViewer
        entries={[
          {
            id: 'event_1',
            action: 'API key created',
            actor: 'Avery Stone',
            occurredAt: 'Today at 10:30',
          },
        ]}
        onLoadMore={onLoadMore}
      />,
    );

    expect(screen.getByText('Avery Stone')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it('requests optional expiration and displays a returned key secret once', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn(() => ({ secret: 'sypra_live_secret' }));
    render(
      <CreateApiKeyDialog
        open
        onOpenChange={() => undefined}
        onCreate={onCreate}
      />,
    );

    await user.type(screen.getByLabelText('Name'), 'Production');
    await user.type(screen.getByLabelText('Expiration'), '2030-01-01');
    await user.click(screen.getByRole('button', { name: 'Create key' }));

    expect(onCreate).toHaveBeenCalledWith({
      name: 'Production',
      permissions: ['read'],
      expiresAt: '2030-01-01',
    });
    expect(await screen.findByLabelText('New API key')).toHaveValue(
      'sypra_live_secret',
    );
  });
});
