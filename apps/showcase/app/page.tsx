'use client';

import { useEffect, useState } from 'react';
import { Command as CommandIcon, Layers3, Moon, Sun } from 'lucide-react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Command,
  Container,
  DataTable,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  PageHeader,
  PageShell,
  Pagination,
  Progress,
  Skeleton,
  Switch,
  Tabs,
  Toast,
  type DataColumn,
} from '@sypra-ui/ui';
import {
  AccountSettingsPage,
  BillingPage,
  LandingPage,
  LoginPage,
} from '@sypra-ui/pages';

type User = { id: string; name: string; email: string; status: string };
const allUsers: User[] = Array.from({ length: 24 }, (_, index) => ({
  id: String(index + 1),
  name:
    ['Avery Stone', 'Mina Park', 'Jordan Lee', 'Sam Rivera'][index % 4] ??
    'Member',
  email: `member${index + 1}@example.com`,
  status: index % 3 ? 'Active' : 'Invited',
}));
const columns: DataColumn<User>[] = [
  {
    key: 'name',
    header: 'Member',
    sortable: true,
    cell: (user) => (
      <span className="flex items-center gap-2">
        <Avatar alt={user.name} />
        {user.name}
      </span>
    ),
  },
  { key: 'email', header: 'Email', sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (user) => (
      <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>
        {user.status}
      </Badge>
    ),
  },
  {
    key: 'id',
    header: <span className="sr-only">Actions</span>,
    cell: () => (
      <Button variant="ghost" size="sm">
        View
      </Button>
    ),
  },
];
const code = (value: string) => (
  <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
    <code>{value}</code>
  </pre>
);

export default function Showcase() {
  const [dark, setDark] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [movable, setMovable] = useState(false);
  const [command, setCommand] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;
  useEffect(() => {
    if (page === 1) return;
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, [page]);
  const goToPage = (next: number) => {
    setLoading(true);
    setPage(next);
  };
  const shownUsers = allUsers.slice((page - 1) * pageSize, page * pageSize);
  const nav: Array<[string, string]> = [
    ['foundations', 'Foundations'],
    ['buttons', 'Buttons'],
    ['forms', 'Forms'],
    ['overlays', 'Overlays'],
    ['data', 'Data & tables'],
    ['feedback', 'Feedback'],
    ['pages', 'Pages'],
  ];
  return (
    <div data-theme={dark ? 'dark' : 'light'} className="rui-root min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-background))]/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <a href="#overview" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-[hsl(var(--rui-primary))] text-[hsl(var(--rui-primary-foreground))]">
              <Layers3 size={17} />
            </span>
            Sypra UI
          </a>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCommand(true)}>
              <CommandIcon size={15} /> Search{' '}
              <kbd className="hidden rounded border px-1 text-[10px] sm:inline">
                ⌘K
              </kbd>
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
      <div className="mx-auto grid max-w-7xl md:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-[hsl(var(--rui-border))] p-4 md:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--rui-muted-foreground))]">
            Documentation
          </p>
          {nav.map(([href, label]) => (
            <a
              className="block rounded px-3 py-2 text-sm text-[hsl(var(--rui-muted-foreground))] hover:bg-[hsl(var(--rui-muted))] hover:text-[hsl(var(--rui-foreground))]"
              key={href}
              href={`#${href}`}
            >
              {label}
            </a>
          ))}
        </aside>
        <PageShell className="min-w-0">
          <Container className="py-10 sm:py-14">
            <section id="overview" className="mb-20">
              <Badge>React · TypeScript · frontend-only</Badge>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                A reusable foundation for the next product.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-[hsl(var(--rui-muted-foreground))]">
                Composable primitives, data-driven pages, semantic tokens, and a
                live test surface—without a backend or vendor lock-in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    document.querySelector('#buttons')?.scrollIntoView()
                  }
                >
                  Explore components
                </Button>
                <Button variant="outline" onClick={() => setDialog(true)}>
                  Open auth demo
                </Button>
              </div>
              <h2 className="sr-only">Library benefits</h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ['Frontend only', 'Bring your own auth, API, and router.'],
                  [
                    'Controlled APIs',
                    'State stays with the consuming application.',
                  ],
                  [
                    'Token themed',
                    'Swap a few CSS variables, not every component.',
                  ],
                ].map(([title, description]) => (
                  <Card key={title}>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </Card>
                ))}
              </div>
            </section>

            <ShowcaseSection
              id="foundations"
              title="Foundations"
              description="Semantic colors, consistent spacing, and light/dark mode use CSS variables."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardTitle>Primary</CardTitle>
                  <Button className="mt-4">Continue</Button>
                </Card>
                <Card>
                  <CardTitle>Progress</CardTitle>
                  <Progress className="mt-5" value={72} label="Storage used" />
                  <CardDescription>72% of storage used</CardDescription>
                </Card>
                <Card>
                  <CardTitle>Surface</CardTitle>
                  <Skeleton className="mt-4 h-9 w-4/5" />
                  <Skeleton className="mt-2 h-4 w-3/5" />
                </Card>
              </div>
              {code(
                `:root { --rui-primary: 221 83% 53%; --rui-radius: .65rem; }\n[data-theme='dark'] { /* semantic token overrides */ }`,
              )}
            </ShowcaseSection>

            <ShowcaseSection
              id="buttons"
              title="Buttons & controls"
              description="Native controls with focused, disabled, and loading behavior."
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Saving</Button>
              </div>
              {code(
                `<Button loading={saving}>Save changes</Button>\n<Button variant="outline">Cancel</Button>`,
              )}
            </ShowcaseSection>

            <ShowcaseSection
              id="forms"
              title="Forms"
              description="Library forms only collect values and call your functions."
            >
              <Card className="max-w-md">
                <label
                  className="mb-1.5 block text-sm font-medium"
                  htmlFor="example-email"
                >
                  Email
                </label>
                <Input
                  id="example-email"
                  placeholder="you@example.com"
                  type="email"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">Product updates</span>
                  <Switch aria-label="Product updates" />
                </div>
                <Button className="mt-5">Save preferences</Button>
              </Card>
              {code(
                `<Input type="email" value={email} onChange={...} />\n<Switch checked={enabled} onChange={...} />`,
              )}
            </ShowcaseSection>

            <ShowcaseSection
              id="overlays"
              title="Overlays"
              description="Dialog focus is trapped, Escape closes it, and movable mode remains constrained to the viewport."
            >
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setMovable(false);
                    setDialog(true);
                  }}
                >
                  Fixed dialog
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMovable(true);
                    setDialog(true);
                  }}
                >
                  Movable dialog
                </Button>
              </div>
              {code(
                `<Dialog open={open} onOpenChange={setOpen}>\n  <DialogContent movable constrainToViewport>…</DialogContent>\n</Dialog>`,
              )}
            </ShowcaseSection>

            <ShowcaseSection
              id="data"
              title="Data & tables"
              description="Sorting is local. This pagination demo simulates a server request while preserving the page shell."
            >
              <Card>
                <DataTable
                  data={shownUsers}
                  columns={columns}
                  loading={loading}
                  pagination={{ page, pageSize, total: allUsers.length }}
                  onPageChange={goToPage}
                />
              </Card>
              <div className="mt-6">
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={allUsers.length}
                  onPageChange={goToPage}
                />
              </div>
              {code(
                `<DataTable data={users} columns={columns}\n  loading={loading} pagination={{ page, pageSize, total }}\n  onPageChange={setPage} />`,
              )}
            </ShowcaseSection>

            <ShowcaseSection
              id="feedback"
              title="Feedback & states"
              description="Local states make async boundaries legible without replacing the whole page."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <Alert title="Heads up">Your trial ends in three days.</Alert>
                <Toast
                  title="Settings saved"
                  description="Your preferences are up to date."
                />
                <LoadingState label="Loading invoices…" />
                <ErrorState
                  title="Could not load usage"
                  onRetry={() => alert('Retry callback')}
                />
                <EmptyState
                  title="No projects yet"
                  description="Create one when you are ready."
                  action={<Button size="sm">New project</Button>}
                />
              </div>
            </ShowcaseSection>

            <ShowcaseSection
              id="pages"
              title="Page compositions"
              description="Pages receive data and callbacks. They do not fetch, authenticate, or route."
            >
              <Tabs
                tabs={[
                  {
                    value: 'auth',
                    label: 'Login',
                    content: (
                      <div className="max-w-md">
                        <LoginPage
                          as="div"
                          authMethods={{ google: true, github: true }}
                          onProviderLogin={(provider) =>
                            alert(`Continue with ${provider}`)
                          }
                        />
                      </div>
                    ),
                  },
                  {
                    value: 'settings',
                    label: 'Settings',
                    content: (
                      <AccountSettingsPage
                        profile={{
                          profile: {
                            firstName: 'Surya',
                            lastName: 'Mandava',
                            username: 'surya',
                            email: 'surya@example.com',
                          },
                          onSave: () => alert('Save callback'),
                          fields: { username: true },
                          dangerZone: {
                            onDeleteAccount: () => alert('Delete account'),
                          },
                        }}
                        security={{
                          sessions: [
                            {
                              id: 'current',
                              device: 'Chrome · macOS',
                              location: 'Dallas, TX',
                              lastActive: 'Active now',
                            },
                            {
                              id: 'phone',
                              device: 'Safari · iPhone',
                              location: 'Dallas, TX',
                              lastActive: '2 hours ago',
                            },
                          ],
                          currentSessionId: 'current',
                          onRevoke: (id) => alert(`Revoke ${id}`),
                          onRevokeAll: () => alert('Revoke all'),
                          onChangePassword: () => alert('Change password'),
                          onToggleTwoFactor: (enabled) =>
                            alert(`2FA ${enabled ? 'enabled' : 'disabled'}`),
                        }}
                        apiKeys={{
                          keys: [
                            {
                              id: '1',
                              name: 'Production',
                              prefix: 'rui_live_',
                              createdAt: 'Sep 18, 2026',
                              lastUsedAt: '2 hours ago',
                            },
                            {
                              id: '2',
                              name: 'Development',
                              prefix: 'rui_test_',
                              createdAt: 'Sep 10, 2026',
                            },
                          ],
                          onCreate: (key) => alert(`Create ${key.name}`),
                          onRevoke: (id) => alert(`Revoke ${id}`),
                        }}
                      />
                    ),
                  },
                  {
                    value: 'billing',
                    label: 'Billing',
                    content: (
                      <BillingPage
                        subscription={{
                          plan: 'Pro',
                          price: '$49',
                          interval: 'month',
                          nextBillingDate: 'Oct 19, 2026',
                          status: 'Active',
                          usage: [
                            { label: 'API requests', value: '72k / 100k' },
                          ],
                        }}
                        paymentMethod={{
                          brand: 'Visa',
                          last4: '4242',
                          expiresAt: '08/28',
                        }}
                        invoices={[
                          {
                            id: '1',
                            date: 'Sep 19, 2026',
                            amount: '$49.00',
                            status: 'Paid',
                          },
                        ]}
                        onChangePlan={() => alert('Plan callback')}
                        onUpdatePaymentMethod={() => alert('Payment callback')}
                      />
                    ),
                  },
                ]}
              />
              {code(
                `<BillingPage subscription={subscription} invoices={invoices}\n  onChangePlan={openPlans} onUpdatePaymentMethod={openPortal} />`,
              )}
            </ShowcaseSection>

            <ShowcaseSection
              id="marketing"
              title="Marketing"
              description="Landing sections can also be used on their own."
            >
              <div className="overflow-hidden rounded-xl border border-[hsl(var(--rui-border))] scale-[.96] origin-top">
                <LandingPage
                  as="div"
                  brand="Northstar"
                  header={{
                    links: [{ label: 'Product', href: '#marketing' }],
                    actions: <Button size="sm">Sign in</Button>,
                  }}
                  hero={{
                    title: 'A sharper way to build.',
                    description:
                      'One composition, supplied entirely by the consuming app.',
                    primaryAction: <Button>Start free</Button>,
                  }}
                  features={[
                    { title: 'Composable', description: 'Mix small sections.' },
                    {
                      title: 'Responsive',
                      description: 'Works on every screen.',
                    },
                    { title: 'Themeable', description: 'Bring your brand.' },
                  ]}
                />
              </div>
            </ShowcaseSection>
          </Container>
        </PageShell>
      </div>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent movable={movable} constrainToViewport>
          <DialogHeader>
            <DialogTitle>
              {movable ? 'Movable dialog' : 'Welcome back'}
            </DialogTitle>
            <DialogDescription>
              {movable
                ? 'Drag the handle, then try Escape.'
                : 'A reusable authentication shell.'}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input placeholder="you@example.com" />
            <Input type="password" placeholder="Password" />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setDialog(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Command
        open={command}
        onOpenChange={setCommand}
        items={nav.map(([value, label]) => ({
          label,
          onSelect: () => document.querySelector(`#${value}`)?.scrollIntoView(),
        }))}
      />
    </div>
  );
}

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-[hsl(var(--rui-border))] py-12"
    >
      <PageHeader
        as="h2"
        title={title}
        description={description}
        className="mb-6"
      />
      {children}
    </section>
  );
}
