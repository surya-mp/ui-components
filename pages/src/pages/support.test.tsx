import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SupportPage } from './support';
import { SupportForm } from '../widgets/support-form';

describe('support compositions', () => {
  it('submits configured contact fields and attachments through its callback', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const file = new File(['details'], 'issue.png', { type: 'image/png' });
    render(
      <SupportForm
        categories={[
          { value: 'account', label: 'Account' },
          { value: 'billing', label: 'Billing' },
        ]}
        fields={{ attachments: true }}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText(/Name/), 'Avery Stone');
    await user.type(screen.getByLabelText(/Email/), 'avery@example.com');
    await user.selectOptions(screen.getByLabelText(/Topic/), 'billing');
    await user.type(screen.getByLabelText(/Subject/), 'Invoice question');
    await user.type(screen.getByLabelText(/Message/), 'Could you help?');
    await user.upload(screen.getByLabelText('Choose files'), file);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Avery Stone',
      email: 'avery@example.com',
      category: 'billing',
      subject: 'Invoice question',
      message: 'Could you help?',
      attachments: [file],
    });
  });

  it('allows a signed-in contact variant with only the required message', () => {
    render(
      <SupportPage
        as="div"
        title="Ask us anything"
        fields={{ name: false, email: false, subject: false }}
      >
        <p>We usually reply within one business day.</p>
      </SupportPage>,
    );

    expect(
      screen.getByRole('heading', { name: 'Ask us anything' }),
    ).toBeVisible();
    expect(screen.getByLabelText(/Message/)).toBeRequired();
    expect(screen.queryByLabelText(/Name/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Email/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Subject/)).not.toBeInTheDocument();
    expect(
      screen.getByText('We usually reply within one business day.'),
    ).toBeVisible();
  });
});
