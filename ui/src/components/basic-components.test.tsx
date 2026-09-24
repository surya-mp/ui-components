import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumb,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Command,
  Container,
  ContextMenu,
  CopyButton,
  ErrorState,
  FileUpload,
  LoadingState,
  Navbar,
  PageContent,
  PageHeader,
  PageShell,
  PasswordInput,
  Progress,
  Section,
  SettingRow,
  Stack,
  Tabs,
} from '../index';

describe('shared component building blocks', () => {
  it('renders display and layout primitives with accessible semantics', () => {
    render(
      <PageShell as="div">
        <Container>
          <PageHeader
            title="Workspace"
            description="Overview"
            actions={<button>Manage</button>}
          />
          <PageContent>
            <Section title="Usage" description="Current usage">
              <Stack gap={6}>
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Pro plan</CardTitle>
                      <CardDescription>Active subscription</CardDescription>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </CardHeader>
                  <Avatar alt="Avery Stone" />
                  <Progress label="Storage" value={120} />
                </Card>
                <SettingRow title="Email" description="Enabled" />
              </Stack>
            </Section>
          </PageContent>
        </Container>
      </PageShell>,
    );

    expect(screen.getByRole('heading', { name: 'Workspace' })).toBeVisible();
    expect(screen.getByText('AV')).toBeVisible();
    expect(
      screen.getByRole('progressbar', { name: 'Storage' }),
    ).toHaveAttribute('aria-valuenow', '120');
    expect(screen.getByText('Active')).toHaveClass(
      'bg-[hsl(var(--rui-success-background))]',
    );
  });

  it('handles navigation tabs and accordion state', async () => {
    const user = userEvent.setup();
    const tabChange = vi.fn();
    render(
      <>
        <Navbar brand="Sypra">Account</Navbar>
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
        />
        <Tabs
          tabs={[
            { value: 'profile', label: 'Profile', content: 'Profile content' },
            {
              value: 'security',
              label: 'Security',
              content: 'Security content',
            },
          ]}
          onValueChange={tabChange}
        />
        <Accordion
          items={[
            { value: 'one', title: 'First', content: 'First answer' },
            { value: 'two', title: 'Second', content: 'Second answer' },
          ]}
        />
      </>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    await user.click(screen.getByRole('tab', { name: 'Security' }));
    expect(tabChange).toHaveBeenCalledWith('security');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security content');
    await user.click(screen.getByRole('button', { name: /First/ }));
    expect(screen.getByText('First answer')).toBeVisible();
  });

  it('supports command, context-menu, clipboard, password, and file utilities', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const copy = vi.fn();
    const files = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: copy.mockResolvedValue(undefined) },
    });
    function CommandFixture() {
      const [open, setOpen] = useState(false);
      return (
        <Command
          open={open}
          onOpenChange={setOpen}
          items={[
            { label: 'Open settings', onSelect: select, keywords: ['config'] },
          ]}
        />
      );
    }
    const { container } = render(
      <>
        <CommandFixture />
        <ContextMenu menu={<button>Archive</button>}>
          <button>Document</button>
        </ContextMenu>
        <CopyButton value="secret">Copy secret</CopyButton>
        <PasswordInput aria-label="Password" />
        <FileUpload label="Upload file" onFiles={files} />
        <ErrorState onRetry={select} />
        <LoadingState label="Loading records" />
      </>,
    );

    await user.keyboard('{Control>}k{/Control}');
    await user.type(screen.getByPlaceholderText('Type a command…'), 'config');
    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(select).toHaveBeenCalledOnce();

    fireEvent.contextMenu(screen.getByRole('button', { name: 'Document' }), {
      clientX: 20,
      clientY: 30,
    });
    expect(screen.getByRole('menu')).toHaveTextContent('Archive');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy secret' }));
    expect(copy).toHaveBeenCalledWith('secret');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');

    const upload =
      container.querySelector<HTMLInputElement>('input[type=file]');
    fireEvent.change(upload!, {
      target: { files: [new File(['a'], 'a.txt')] },
    });
    expect(files).toHaveBeenCalledWith([expect.any(File)]);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(select).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status')).toHaveTextContent('Loading records');
  });
});
