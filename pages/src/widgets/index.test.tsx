import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotificationBell, SupportForm } from './index';

describe('widget entry point', () => {
  it('exposes domain widgets without full page layouts', () => {
    render(
      <>
        <NotificationBell notifications={[]} />
        <SupportForm onSubmit={() => undefined} />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Notifications' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeVisible();
  });
});
