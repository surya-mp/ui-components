'use client';

import { useState, type ReactNode } from 'react';
import { Copy, Layers3, Moon, Sun } from 'lucide-react';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Checkbox,
  Collapsible,
  Combobox,
  Command,
  ConfirmActionDialog,
  Container,
  ContextMenu,
  CopyButton,
  DataTable,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuItem,
  EmptyState,
  ErrorState,
  FileUpload,
  FormField,
  Input,
  InputOTP,
  LoadingState,
  Pagination,
  PasswordInput,
  Popover,
  Progress,
  RadioGroup,
  SearchableTable,
  Select,
  SegmentedControl,
  Skeleton,
  ScrollArea,
  Stack,
  Switch,
  ToastProvider,
  Toggle,
  Tabs,
  Textarea,
  Tooltip,
  useToast,
  type DataColumn,
} from '@sypra-ui/ui';
import {
  AuditLogPage,
  BillingPage,
  LoginPage,
  OrganizationPage,
  PaymentStatusPage,
  ProfilePage,
  ResetPasswordPage,
  SupportPage,
} from '@sypra-ui/pages';
import { ApiKeyManager, NotificationBell } from '@sypra-ui/pages/widgets';

const sections = [
  ['foundations', 'Foundations'],
  ['forms', 'Forms'],
  ['display', 'Display'],
  ['overlays', 'Overlays'],
  ['navigation', 'Navigation'],
  ['data', 'Data'],
  ['feedback', 'Feedback'],
  ['patterns', 'Patterns'],
  ['pages', 'Pages'],
] as const;

const snippet = (value: string) => (
  <pre className="mt-5 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
    <code>{value}</code>
  </pre>
);
const users = [
  { id: '1', name: 'Avery', role: 'Admin' },
  { id: '2', name: 'Mina', role: 'Member' },
];
const columns: DataColumn<(typeof users)[number]>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    cell: (row) => (
      <span className="flex items-center gap-2">
        <Avatar alt={row.name} />
        {row.name}
      </span>
    ),
  },
  { key: 'role', header: 'Role', cell: (row) => <Badge>{row.role}</Badge> },
];

export default function DocsPage({ section }: { section: string }) {
  const [dark, setDark] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const validSection = sections.some(([value]) => value === section)
    ? section
    : 'foundations';
  return (
    <div data-theme={dark ? 'dark' : 'light'} className="rui-root min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-background))]/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-[hsl(var(--rui-primary))] text-[hsl(var(--rui-primary-foreground))]">
              <Layers3 size={17} />
            </span>
            Sypra UI
          </a>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommandOpen(true)}
            >
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </Container>
      </header>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="border-r border-[hsl(var(--rui-border))] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--rui-muted-foreground))]">
            Documentation
          </p>
          {sections.map(([value, label]) => (
            <a
              key={value}
              href={`/docs/${value}`}
              className={`block rounded px-3 py-2 text-sm ${value === validSection ? 'bg-[hsl(var(--rui-secondary))] font-medium' : 'text-[hsl(var(--rui-muted-foreground))] hover:bg-[hsl(var(--rui-muted))]'}`}
            >
              {label}
            </a>
          ))}
        </aside>
        <main className="min-w-0">
          <Container className="py-10">
            <DocSection
              section={validSection}
              confirmOpen={confirmOpen}
              onConfirmOpenChange={setConfirmOpen}
            />
          </Container>
        </main>
      </div>
      <Command
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={sections.map(([value, label]) => ({
          label,
          onSelect: () => {
            window.location.href = `/docs/${value}`;
          },
        }))}
      />
    </div>
  );
}

function DocSection({
  section,
  confirmOpen,
  onConfirmOpenChange,
}: {
  section: string;
  confirmOpen: boolean;
  onConfirmOpenChange: (open: boolean) => void;
}) {
  if (section === 'forms')
    return (
      <Doc
        title="Forms"
        description="Native form semantics with controlled values and sensible focus styles."
      >
        <Demo title="Inputs, selection, and file UI">
          <div className="grid max-w-xl gap-4">
            <FormField
              label="Email"
              htmlFor="email"
              description="We only use this to contact you."
            >
              <Input id="email" type="email" placeholder="you@example.com" />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <PasswordInput id="password" />
            </FormField>
            <Textarea aria-label="Notes" placeholder="Notes" />
            <Select aria-label="Plan">
              <option>Starter</option>
              <option>Pro</option>
            </Select>
            <Combobox
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
            <RadioGroup
              name="access-demo"
              label="Access"
              defaultValue="read"
              orientation="horizontal"
              options={[
                { value: 'read', label: 'Read' },
                { value: 'write', label: 'Write' },
              ]}
            />
            <InputOTP length={4} />
            <div className="flex flex-wrap gap-2">
              <Toggle>Bold</Toggle>
              <SegmentedControl
                label="View"
                options={[
                  { value: 'list', label: 'List' },
                  { value: 'grid', label: 'Grid' },
                ]}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox /> Send product updates
            </label>
            <Switch aria-label="Enable notifications" />
            <FileUpload label="Upload a logo" onFiles={() => undefined} />
            <Collapsible title="Advanced options">
              Extra configuration belongs here.
            </Collapsible>
            <ScrollArea className="max-h-20 rounded border p-2 text-sm">
              This constrained area scrolls when its content exceeds the
              available space.
            </ScrollArea>
          </div>
          {snippet(
            `<FormField label="Email" htmlFor="email">\n  <Input id="email" value={email} onChange={...} />\n</FormField>`,
          )}
        </Demo>
      </Doc>
    );
  if (section === 'display')
    return (
      <Doc
        title="Display"
        description="Cards, status, avatars, skeletons, and progress indicators."
      >
        <Demo title="Display primitives">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardTitle>Storage</CardTitle>
              <Progress className="mt-5" value={68} label="Storage used" />
              <CardDescription>68% used</CardDescription>
            </Card>
            <Card>
              <Avatar alt="Avery Stone" />
              <CardTitle className="mt-3">Avery Stone</CardTitle>
              <Badge variant="success">Active</Badge>
            </Card>
            <Card>
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </Card>
          </div>
          {snippet(
            `<Badge variant="success">Active</Badge>\n<Progress value={68} label="Storage used" />`,
          )}
        </Demo>
      </Doc>
    );
  if (section === 'overlays')
    return (
      <Doc
        title="Overlays"
        description="Composable dialogs and lightweight contextual overlays with dismissal behavior."
      >
        <Demo title="Dialog variants">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Fixed dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a teammate</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Input placeholder="person@example.com" />
                </DialogBody>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Send invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Nested dialog</Button>
              </DialogTrigger>
              <DialogContent movable>
                <DialogHeader>
                  <DialogTitle>Project settings</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open confirmation</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm archive</DialogTitle>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>Done</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DialogBody>
              </DialogContent>
            </Dialog>
            <Popover trigger={<Button variant="outline">Popover</Button>}>
              <p className="text-sm">Dismiss with Escape or outside click.</p>
            </Popover>
            <DropdownMenu trigger={<Button variant="outline">Actions</Button>}>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenu>
            <Tooltip content="Copy project URL">
              <Button variant="outline" aria-label="Copy project URL">
                <Copy size={15} />
              </Button>
            </Tooltip>
            <Button
              variant="destructive"
              onClick={() => onConfirmOpenChange(true)}
            >
              Confirm action
            </Button>
          </div>
          <ConfirmActionDialog
            open={confirmOpen}
            onOpenChange={onConfirmOpenChange}
            title="Delete project?"
            description="This cannot be undone."
            confirmLabel="Delete project"
            onConfirm={() => undefined}
          />
          {snippet(
            `<Dialog open={open} onOpenChange={setOpen}>\n  <DialogContent movable constrainToViewport>…</DialogContent>\n</Dialog>`,
          )}
        </Demo>
      </Doc>
    );
  if (section === 'navigation')
    return (
      <Doc
        title="Navigation"
        description="Navigation primitives remain router-agnostic."
      >
        <Demo title="Tabs, accordion, breadcrumbs, and pages">
          <Breadcrumb
            items={[
              { label: 'Docs', href: '/docs/foundations' },
              { label: 'Navigation' },
            ]}
          />
          <Tabs
            tabs={[
              { value: 'one', label: 'Overview', content: 'Overview content.' },
              { value: 'two', label: 'Usage', content: 'Usage content.' },
            ]}
          />
          <Accordion
            items={[
              {
                value: 'a',
                title: 'Can I control tabs?',
                content: 'Yes, with value and onValueChange.',
              },
              {
                value: 'b',
                title: 'Does pagination reload?',
                content: 'No. It calls your callback.',
              },
            ]}
          />
          <Pagination
            page={2}
            pageSize={10}
            total={42}
            onPageChange={() => undefined}
          />
        </Demo>
      </Doc>
    );
  if (section === 'data')
    return (
      <Doc
        title="Data"
        description="Semantic tables with typed custom cells, local sorting, and controlled pagination."
      >
        <Demo title="DataTable and generic search">
          <DataTable
            data={users}
            columns={columns}
            pagination={{ page: 1, pageSize: 10, total: users.length }}
            onPageChange={() => undefined}
          />
          <div className="mt-6">
            <SearchableTable
              data={users}
              columns={columns}
              searchKeys={['name', 'role']}
            />
          </div>
          {snippet(
            `const columns: DataColumn<User>[] = [\n  { key: 'name', header: 'Name', sortable: true },\n  { key: 'role', header: 'Role', cell: row => <Badge>{row.role}</Badge> }\n];`,
          )}
        </Demo>
      </Doc>
    );
  if (section === 'feedback')
    return (
      <Doc
        title="Feedback"
        description="Localized loading, success, error, and empty states."
      >
        <Demo title="State components">
          <Stack>
            <Alert title="Trial ending">Your trial ends in three days.</Alert>
            <LoadingState label="Loading invoices…" />
            <ErrorState
              title="Could not load usage"
              onRetry={() => undefined}
            />
            <EmptyState
              title="No projects yet"
              action={<Button size="sm">Create project</Button>}
            />
            <ToastProvider>
              <ToastDemo />
            </ToastProvider>
          </Stack>
        </Demo>
      </Doc>
    );
  if (section === 'patterns')
    return (
      <Doc
        title="Patterns"
        description="Generic combinations of primitives, not product-specific workflows."
      >
        <Demo title="Search, confirmation, and context actions">
          <ContextMenu
            menu={
              <>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </>
            }
          >
            <Card className="select-none">
              <CardTitle>Right-click this card</CardTitle>
              <CardDescription>
                Context menus close on Escape or outside click.
              </CardDescription>
            </Card>
          </ContextMenu>
          <div className="mt-5">
            <CopyButton value="https://example.com/project">
              Copy project URL
            </CopyButton>
          </div>
        </Demo>
      </Doc>
    );
  if (section === 'pages')
    return (
      <Doc
        title="Pages"
        description="Full compositions accept data and callbacks; they never own network or provider logic."
      >
        <Demo title="Auth, profile, API keys, and billing">
          <div className="grid gap-6">
            <div className="max-w-md">
              <LoginPage
                as="div"
                authMethods={{ google: true, github: true }}
                onProviderLogin={() => undefined}
              />
            </div>
            <div className="max-w-md">
              <ResetPasswordPage as="div" onSubmit={() => undefined} />
            </div>
            <ProfilePage
              profile={{
                firstName: 'Surya',
                lastName: 'Mandava',
                username: 'surya',
                email: 'surya@example.com',
              }}
              fields={{ username: true }}
              onSave={() => undefined}
              dangerZone={{ onDeleteAccount: () => undefined }}
            />
            <ApiKeyManager
              keys={[
                {
                  id: 'key_1',
                  name: 'Production',
                  prefix: 'sypra_live_',
                  createdAt: 'Today',
                },
              ]}
              onCreate={() => undefined}
              onRevoke={() => undefined}
            />
            <BillingPage
              invoices={[]}
              subscription={{ plan: 'Pro', price: '$49', interval: 'month' }}
              onChangePlan={() => undefined}
            />
          </div>
          {snippet(
            `<ProfilePage profile={profile} onSave={saveProfile}\n  dangerZone={{ onDeleteAccount: deleteAccount }} />\n<ApiKeyManager keys={keys} onCreate={createKey} onRevoke={revokeKey} />`,
          )}
        </Demo>
        <Demo title="Stripe Elements payments">
          <Alert title="Complete server-owned contract">
            Use POST /subscribe to create a subscription, POST /portal for the
            Billing Portal, and POST /webhook to verify Stripe events. Return
            the invoice confirmation_secret client secret first, with the
            payment_intent client secret only as a compatibility fallback.
          </Alert>
          {snippet(
            `type StripeSubscriptionApi = {\n  '/subscribe': { request: StripeSubscribeRequest; response: StripeSubscribeResponse };\n  '/portal': { request: StripePortalRequest; response: StripePortalResponse };\n  '/webhook': { event: StripeWebhookEvent; response: { received: true } };\n};\n\n<StripePaymentPage\n  billing={{ stripe, options: { clientSecret }, returnUrl }}\n  sections={{ payment: false }}\n/>`,
          )}
        </Demo>
        <Demo title="Support and contact">
          <SupportPage
            as="div"
            title="Contact the team"
            description="Share a question, problem, or product idea."
            categories={[
              { value: 'account', label: 'Account' },
              { value: 'billing', label: 'Billing' },
              { value: 'technical', label: 'Technical issue' },
            ]}
            fields={{ attachments: true }}
            onSubmit={() => undefined}
          />
          {snippet(
            `<SupportPage categories={topics} fields={{ attachments: true }}\n  onSubmit={(ticket) => createTicket(ticket)} />`,
          )}
        </Demo>
        <Demo title="Notifications and audit activity">
          <div className="flex justify-end">
            <NotificationBell
              notifications={[
                {
                  id: 'billing-paid',
                  title: 'Invoice paid',
                  description: 'Your September invoice was paid.',
                  createdAt: 'Today',
                },
              ]}
              onMarkRead={() => undefined}
              onMarkAllRead={() => undefined}
              onViewAll={() => undefined}
            />
          </div>
          <AuditLogPage
            entries={[
              {
                id: 'key-created',
                action: 'API key created',
                actor: 'Surya Mandava',
                resource: 'Production key',
                occurredAt: 'Today at 10:30',
              },
            ]}
          />
          {snippet(
            `<NotificationBell\n  notifications={notifications}\n  onMarkRead={markRead}\n  onViewAll={() => router.push('/notifications')}\n/>\n\n<NotificationsPage standalone notifications={notifications} />`,
          )}
        </Demo>
        <Demo title="Completion and system status">
          <PaymentStatusPage
            as="div"
            status="succeeded"
            actions={<Button>View billing</Button>}
          />
          {snippet(
            `<PaymentStatusPage status="processing" actions={<Button>View billing</Button>} />\n<NotFoundPage actions={<a href="/">Back home</a>} />\n<OfflinePage actions={<Button onClick={retry}>Try again</Button>} />`,
          )}
        </Demo>
        <Demo title="Customer organization members">
          <OrganizationPage
            organization={{
              id: 'org_1',
              name: 'Acme',
              slug: 'acme',
              plan: 'Pro',
            }}
            members={users.map((user) => ({
              ...user,
              email: `${(user.name.split(' ')[0] ?? 'member').toLowerCase()}@acme.example`,
            }))}
            invitations={[
              {
                id: 'invite_1',
                email: 'mina@example.com',
                role: 'Member',
                expiresAt: 'Friday',
              },
            ]}
            onInvite={() => undefined}
            onChangeRole={() => undefined}
            onRemoveMember={() => undefined}
            onResendInvitation={() => undefined}
            onRevokeInvitation={() => undefined}
          />
          {snippet(
            `<OrganizationPage organization={organization} members={members}\n  invitations={invitations} onInvite={inviteMember}\n  onChangeRole={updateMemberRole} onRemoveMember={removeMember} />`,
          )}
        </Demo>
      </Doc>
    );
  return (
    <Doc
      title="Foundations"
      description="Semantic CSS variables give every application a small, explicit theme contract."
    >
      <Demo title="Tokens and layout">
        <Card>
          <CardTitle>Theme token contract</CardTitle>
          <CardDescription>
            Background, foreground, card, muted, border, input, primary,
            secondary, accent, destructive, ring, and radius are semantic
            variables.
          </CardDescription>
          <Button className="mt-5">Primary action</Button>
        </Card>
        {snippet(
          `@import '@sypra-ui/ui/styles.css';\n:root { --rui-primary: 221 83% 53%; --rui-radius: .65rem; }`,
        )}
      </Demo>
    </Doc>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button variant="outline" onClick={() => toast({ title: 'Changes saved' })}>
      Show toast
    </Button>
  );
}

function Doc({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-[hsl(var(--rui-muted-foreground))]">
        {description}
      </p>
      {children}
    </>
  );
}
function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <Card>{children}</Card>
    </section>
  );
}
