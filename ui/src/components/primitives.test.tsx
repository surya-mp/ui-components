import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Collapsible,
  Combobox,
  InputOTP,
  RadioGroup,
  ScrollArea,
  SegmentedControl,
  ToastProvider,
  Toggle,
  useToast,
} from '../index';

describe('additional primitives', () => {
  it('filters and selects combobox options with the keyboard', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Combobox
        label="Role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'viewer', label: 'Viewer' },
        ]}
        onValueChange={change}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Role' });
    await user.click(input);
    await user.type(input, 'Viewer');
    await user.keyboard('{Enter}');
    expect(change).toHaveBeenCalledWith('viewer');
  });

  it('keeps controlled combobox values, skips disabled options, and closes outside', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <>
        <Combobox
          ariaLabel="Plan"
          name="plan"
          value="pro"
          options={[
            { value: 'free', label: 'Free', disabled: true },
            { value: 'pro', label: 'Pro' },
          ]}
          onValueChange={change}
        />
        <button>Outside</button>
      </>,
    );
    const input = screen.getByRole('combobox', { name: 'Plan' });
    expect(input).toHaveValue('Pro');
    expect(screen.getByDisplayValue('pro')).toHaveAttribute('name', 'plan');
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'Free');
    await user.keyboard('{Enter}');
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps radio, toggle, and segmented controls callback-driven', async () => {
    const user = userEvent.setup();
    const radioChange = vi.fn();
    const toggleChange = vi.fn();
    const segmentChange = vi.fn();
    render(
      <>
        <RadioGroup
          name="access"
          label="Access"
          options={[
            { value: 'read', label: 'Read' },
            { value: 'write', label: 'Write' },
          ]}
          onValueChange={radioChange}
        />
        <Toggle onPressedChange={toggleChange}>Bold</Toggle>
        <SegmentedControl
          label="View"
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          onValueChange={segmentChange}
        />
      </>,
    );
    await user.click(screen.getByLabelText('Write'));
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    await user.click(screen.getByRole('button', { name: 'Grid' }));
    expect(radioChange).toHaveBeenCalledWith('write');
    expect(toggleChange).toHaveBeenCalledWith(true);
    expect(segmentChange).toHaveBeenCalledWith('grid');
  });

  it('honors controlled, disabled, and error states for choice controls', async () => {
    const user = userEvent.setup();
    const radioChange = vi.fn();
    const segmentChange = vi.fn();
    render(
      <>
        <RadioGroup
          name="visibility"
          value="private"
          label="Visibility"
          error="Choose a visibility"
          onValueChange={radioChange}
          options={[
            { value: 'private', label: 'Private' },
            { value: 'public', label: 'Public', disabled: true },
          ]}
        />
        <Toggle disabled>Locked</Toggle>
        <SegmentedControl
          label="Layout"
          value="list"
          onValueChange={segmentChange}
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid', disabled: true },
          ]}
        />
      </>,
    );
    expect(screen.getByLabelText('Private')).toBeChecked();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a visibility');
    await user.click(screen.getByLabelText('Public'));
    await user.click(screen.getByRole('button', { name: 'Locked' }));
    await user.click(screen.getByRole('button', { name: 'Grid' }));
    expect(radioChange).not.toHaveBeenCalled();
    expect(segmentChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Locked' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('collects OTP values, expands collapsibles, and constrains scroll areas', async () => {
    const user = userEvent.setup();
    const complete = vi.fn();
    render(
      <>
        <InputOTP length={4} onComplete={complete} />
        <Collapsible title="More details">Details</Collapsible>
        <ScrollArea data-testid="scroll-area" className="max-h-20">
          Scrollable content
        </ScrollArea>
      </>,
    );
    await user.type(screen.getByLabelText('Digit 1'), '1234');
    expect(complete).toHaveBeenCalledWith('1234');
    await user.click(screen.getByRole('button', { name: 'More details' }));
    expect(screen.getByText('Details')).toBeVisible();
    expect(screen.getByTestId('scroll-area')).toHaveClass('overflow-auto');
  });

  it('sanitizes OTP paste data and supports controlled collapsibles', async () => {
    const user = userEvent.setup();
    const valueChange = vi.fn();
    const openChange = vi.fn();
    render(
      <>
        <InputOTP length={4} name="verification" onValueChange={valueChange} />
        <Collapsible title="Controlled" open onOpenChange={openChange}>
          Open content
        </Collapsible>
        <Collapsible title="Locked" disabled>
          Hidden content
        </Collapsible>
      </>,
    );
    await user.click(screen.getByLabelText('Digit 1'));
    await user.paste('12a3');
    expect(valueChange).toHaveBeenLastCalledWith('123');
    expect(screen.getByDisplayValue('123')).toHaveAttribute(
      'name',
      'verification',
    );
    await user.click(screen.getByRole('button', { name: 'Controlled' }));
    expect(openChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Open content')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Locked' })).toBeDisabled();
  });

  it('queues and dismisses notifications through the toast provider', async () => {
    const user = userEvent.setup();
    function Trigger() {
      const { toast } = useToast();
      return <button onClick={() => toast({ title: 'Saved' })}>Save</button>;
    }
    render(
      <ToastProvider duration={0}>
        <Trigger />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Saved')).toBeVisible();
    await user.click(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    );
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('keeps only the configured number of toast messages', async () => {
    const user = userEvent.setup();
    function Trigger() {
      const { toast } = useToast();
      return (
        <>
          <button onClick={() => toast({ title: 'First' })}>First</button>
          <button onClick={() => toast({ title: 'Second' })}>Second</button>
        </>
      );
    }
    render(
      <ToastProvider duration={0} limit={1}>
        <Trigger />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'First' }));
    await user.click(screen.getByRole('button', { name: 'Second' }));
    const notifications = screen.getByLabelText('Notifications');
    expect(within(notifications).queryByText('First')).not.toBeInTheDocument();
    expect(within(notifications).getByText('Second')).toBeVisible();
  });
});
