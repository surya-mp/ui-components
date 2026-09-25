# @sypra-ui/pages

Reusable frontend-only page compositions. Supply data and callbacks; no
provider, API, or router is required.

## Install

```sh
pnpm add @sypra-ui/ui @sypra-ui/pages
```

Pages use `@sypra-ui/ui` for all visual styling. Follow the UI package's
Tailwind setup and import `@sypra-ui/ui/styles.css` once. Include both package
builds in Tailwind's content configuration:

```ts
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@sypra-ui/ui/dist/**/*.{js,mjs}',
    './node_modules/@sypra-ui/pages/dist/**/*.{js,mjs}',
  ],
};
```

Apply `--rui-*` CSS variables to your application or a page wrapper to change
the color palette and shape. Page components remain data-and-callback driven,
so your application retains ownership of authentication, routing, APIs, and
payments.

## Page and widget boundaries

Use `@sypra-ui/ui` for generic primitives and generic widgets such as dialogs,
tables, file upload, and comboboxes. Use `@sypra-ui/pages/widgets` for
SaaS-domain widgets that accept application data and callbacks, without
supplying a full layout. Use `@sypra-ui/pages` for complete compositions.

The source follows the same boundary: `ui/src/components` contains generic UI,
`pages/src/widgets` contains one reusable domain widget per file, and
`pages/src/pages` contains layout compositions only. The `widgets` barrel is
an import convenience, not the implementation location.

```tsx
import { NotificationBell, SupportForm } from '@sypra-ui/pages/widgets';
import { NotificationsPage, SupportPage } from '@sypra-ui/pages';
```

## Support and contact

`SupportForm` is the composable form; `SupportPage` adds a centered, responsive
page layout. Name, email, subject, and message are shown by default. Add
application-specific topics or attachments only when needed:

```tsx
import { SupportPage } from '@sypra-ui/pages';

<SupportPage
  categories={[
    { value: 'account', label: 'Account' },
    { value: 'billing', label: 'Billing' },
  ]}
  fields={{ attachments: true }}
  attachmentAccept="image/*,.pdf"
  onSubmit={(ticket) => createSupportTicket(ticket)}
/>;
```

For signed-in users, hide prefilled fields with
`fields={{ name: false, email: false, subject: false }}`. Upload files and
submit the ticket in `onSubmit`; the package intentionally does not send data
or retain attachments.

## Notifications and activity

`NotificationBell`, `NotificationList`, and `NotificationsPage` display
application-stored notifications. Read state and preferences stay controlled by
your application callbacks. `AuditLogViewer` and `AuditLogPage` render the
same way: fetch and retain events in your backend, then pass them in.

```tsx
<NotificationBell
  notifications={notifications}
  onMarkRead={(notification) => markNotificationRead(notification.id)}
  onMarkAllRead={markAllNotificationsRead}
/>

<AuditLogPage entries={events} onLoadMore={loadMoreEvents} />
```

The bell popup renders the first five supplied notifications (pass them in
newest-first order) and retains the unread count for the complete collection.
Use `onViewAll` to connect it to your router, and render the same page at that
route with `standalone` enabled:

```tsx
<NotificationBell
  notifications={notifications}
  onViewAll={() => router.push('/notifications')}
/>

<NotificationsPage standalone notifications={notifications} />
```

## Stripe Elements payments

`@sypra-ui/pages` exposes Stripe Elements forms but never creates an intent or
handles Stripe secret keys. Install the two Stripe peer dependencies alongside
the Sypra packages:

```sh
pnpm add @stripe/stripe-js @stripe/react-stripe-js
```

Create the `PaymentIntent`, `SetupIntent`, or subscription on your server and
return only its client secret to a client component. Use `mode="setup"` only
when saving a payment method for future billing.

```tsx
import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentPage } from '@sypra-ui/pages';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

<StripePaymentPage
  payment={{
    stripe,
    options: { clientSecret: paymentClientSecret },
    returnUrl: `${window.location.origin}/checkout/complete`,
    onSuccess: refreshOrder,
  }}
  billing={{
    stripe,
    options: { clientSecret: subscriptionClientSecret },
    returnUrl: `${window.location.origin}/billing/complete`,
    onSuccess: refreshSubscription,
  }}
  sections={{ billing: false }} // one-time payment only
/>;
```

Pass only `billing` for subscription billing, or both configurations to render
both cards. For a custom layout, compose `StripeElementsProvider` with
`StripePaymentForm` or `StripeBillingForm` directly. Stripe confirmation uses
`redirect: 'if_required'`; `returnUrl` is therefore required for payment
methods that leave your site.

### Custom PaymentIntent (without a Stripe Price)

No library change or Dashboard `price_id` is required for a custom one-time
payment. Resolve an application-owned order on your server, calculate its
amount there, create the `PaymentIntent`, and give the returned client secret
to the existing `payment` configuration. Never accept the final amount from
the browser.

```ts
// app/api/payment-intent/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { orderId } = (await request.json()) as { orderId: string };
  const order = await approvedOrderForAuthenticatedUser(orderId);
  if (!order) return new Response('Invalid order', { status: 400 });

  const intent = await stripe.paymentIntents.create({
    amount: order.totalInCents,
    currency: order.currency,
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id },
  });
  return NextResponse.json({ clientSecret: intent.client_secret });
}
```

```tsx
const { clientSecret } = await fetch('/api/payment-intent', {
  method: 'POST',
  body: JSON.stringify({ orderId }),
}).then((response) => response.json());

<StripePaymentPage
  payment={{
    stripe,
    options: { clientSecret },
    paymentElementOptions: { wallets: { applePay: 'auto', googlePay: 'auto' } },
    returnUrl: `${window.location.origin}/checkout/complete`,
  }}
/>;
```

Create subscriptions with Stripe Prices when that fits your billing model; use
a custom PaymentIntent for an application-calculated one-time amount.

### Global or fixed payment methods

The library does not restrict Stripe methods. The example uses
`automatic_payment_methods`, so each application can manage its global enabled
methods in the Stripe Dashboard and Stripe can show the eligible subset for the
customer, amount, currency, and country.

When an application requires a fixed allow-list, replace that setting on its
server with `payment_method_types`, for example `['card', 'us_bank_account']`.
Use the bank method appropriate to the customer country and Stripe account,
such as `sepa_debit` for eligible SEPA payments. Apple Pay and Google Pay are
card wallets, not additional PaymentIntent types: keep `card` enabled and use
`paymentElementOptions.wallets` only to allow or hide each wallet. Stripe shows
an allowed wallet only on supported devices/browsers and verified domains.
`paymentMethodOrder` changes display order only; it never enables a method.
See Stripe’s [PaymentIntent API](https://docs.stripe.com/api/payment_intents/create)
and [Payment Element wallet options](https://docs.stripe.com/payments/payment-element).

## Complete subscription contract

The library deliberately does not create Stripe objects. Use the optional
types below to keep the browser and your application server aligned:

```ts
import type {
  StripePortalRequest,
  StripePortalResponse,
  StripeSubscribeRequest,
  StripeSubscribeResponse,
  StripeWebhookEvent,
} from '@sypra-ui/pages';

// POST /subscribe: StripeSubscribeRequest -> StripeSubscribeResponse
// POST /portal: StripePortalRequest -> StripePortalResponse
// POST /webhook: verified Stripe event -> { received: true }
```

The intended flow is:

1. `POST /subscribe` resolves the authenticated customer and an approved plan,
   creates the subscription, and returns a client secret when payment is due.
2. The browser gives that secret to `StripeBillingForm` or
   `StripePaymentPage`; it never receives a Stripe secret key.
3. `POST /portal` creates a short-lived Billing Portal session and returns its
   URL for navigation.
4. `POST /webhook` verifies Stripe's raw signed event and grants or revokes
   product access from the event—not from the browser callback.

For a paid subscription, expand `latest_invoice.confirmation_secret` and use
`confirmation_secret.client_secret` first. Modern Stripe invoices expose the
client secret there; retain the expanded `payment_intent.client_secret` as a
compatibility fallback. If the subscription begins without payment, return
`clientSecret: null` and refresh the account state instead. Stripe documents
the invoice confirmation secret and `default_incomplete` subscription flow in
its [Invoice API](https://docs.stripe.com/api/invoices/object) and
[Subscription API](https://docs.stripe.com/api/subscriptions/create).

### Next.js route handlers

Install the server SDK in the application, not this UI package:

```sh
pnpm add stripe
```

```ts
// app/api/subscribe/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import type {
  StripeSubscribeRequest,
  StripeSubscribeResponse,
} from '@sypra-ui/pages';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prices: Record<string, string> = { pro: 'price_pro' };

export async function POST(request: Request) {
  const { plan } = (await request.json()) as StripeSubscribeRequest;
  const price = prices[plan];
  const customer = await customerForAuthenticatedUser();
  if (!price || !customer)
    return new Response('Invalid subscription', { status: 400 });

  const subscription = await stripe.subscriptions.create({
    customer,
    items: [{ price }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: [
      'latest_invoice.confirmation_secret',
      'latest_invoice.payment_intent',
    ],
  });
  const invoice = subscription.latest_invoice as Stripe.Invoice | null;
  const clientSecret =
    invoice?.confirmation_secret?.client_secret ??
    (typeof invoice?.payment_intent === 'string'
      ? null
      : (invoice?.payment_intent?.client_secret ?? null));

  return NextResponse.json({
    subscriptionId: subscription.id,
    status: subscription.status,
    clientSecret,
  } satisfies StripeSubscribeResponse);
}
```

```ts
// app/api/portal/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import type {
  StripePortalRequest,
  StripePortalResponse,
} from '@sypra-ui/pages';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { returnUrl } = (await request.json()) as StripePortalRequest;
  const customer = await customerForAuthenticatedUser();
  if (!customer) return new Response('Unauthorized', { status: 401 });

  const portal = await stripe.billingPortal.sessions.create({
    customer,
    return_url: returnUrl,
  });
  return NextResponse.json({ url: portal.url } satisfies StripePortalResponse);
}
```

```ts
// app/api/webhook/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    await handleStripeEvent({ id: event.id, type: event.type });
    return Response.json({ received: true });
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }
}
```

### Express server with a Vite client

Put the API on the Express server; Vite only serves the browser application.
Register the raw webhook route before `express.json()` so Stripe signature
verification receives the untouched body.

```ts
// server.ts
import express from 'express';
import Stripe from 'stripe';
import type {
  StripePortalRequest,
  StripeSubscribeRequest,
} from '@sypra-ui/pages';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prices: Record<string, string> = { pro: 'price_pro' };

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        req.header('stripe-signature') ?? '',
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
      await handleStripeEvent({ id: event.id, type: event.type });
      res.json({ received: true });
    } catch {
      res.status(400).send('Invalid signature');
    }
  },
);

app.use(express.json());

app.post('/subscribe', async (req, res) => {
  const { plan } = req.body as StripeSubscribeRequest;
  const price = prices[plan];
  const customer = await customerForAuthenticatedUser(req);
  if (!price || !customer) return res.status(400).send('Invalid subscription');

  const subscription = await stripe.subscriptions.create({
    customer,
    items: [{ price }],
    payment_behavior: 'default_incomplete',
    expand: [
      'latest_invoice.confirmation_secret',
      'latest_invoice.payment_intent',
    ],
  });
  const invoice = subscription.latest_invoice as Stripe.Invoice | null;
  const clientSecret =
    invoice?.confirmation_secret?.client_secret ??
    (typeof invoice?.payment_intent === 'string'
      ? null
      : (invoice?.payment_intent?.client_secret ?? null));
  res.json({
    subscriptionId: subscription.id,
    status: subscription.status,
    clientSecret,
  });
});

app.post('/portal', async (req, res) => {
  const { returnUrl } = req.body as StripePortalRequest;
  const customer = await customerForAuthenticatedUser(req);
  if (!customer) return res.sendStatus(401);
  const portal = await stripe.billingPortal.sessions.create({
    customer,
    return_url: returnUrl,
  });
  res.json({ url: portal.url });
});
```

Both examples leave application authentication, plan authorization, database
updates, and idempotent webhook processing to your server. Stripe recommends
using webhook events for fulfillment because a browser can close or be
modified before its callback completes. See the [Payment Element
guide](https://docs.stripe.com/payments/payment-element/migration) and
[Billing Portal API](https://docs.stripe.com/api/customer_portal/sessions/create).

## Completion and system status pages

`StatusPage` is the composable base. Its specific variants provide consistent
copy and accessible page structure while leaving all routing and actions to
your application:

```tsx
import { Button } from '@sypra-ui/ui';
import {
  NotFoundPage,
  OfflinePage,
  PaymentStatusPage,
} from '@sypra-ui/pages';

<PaymentStatusPage
  status="processing"
  actions={<Button onClick={openBilling}>View billing</Button>}
/>
<NotFoundPage actions={<a href="/">Back home</a>} />
<OfflinePage actions={<Button onClick={() => window.location.reload()}>Try again</Button>} />
```

Available completion pages: `PaymentStatusPage` (`succeeded`, `processing`,
`failed`), `OAuthStatusPage` (`succeeded`, `failed`, `cancelled`),
`EmailVerificationPage` (`verified`, `pending`, `expired`), and
`InvitationStatusPage` (`accepted`, `expired`, `invalid`). Available system
pages: `AccessDeniedPage`, `NotFoundPage`, `ServerErrorPage`,
`MaintenancePage`, and `OfflinePage`. Every variant accepts `title`,
`description`, `tone`, `actions`, and `children` for application-specific
content.

## Organization and members

`OrganizationPage` is for a customer's own workspace. It does not model a
platform-super-admin console or cross-organization support access. Membership
roles are scoped to the organization, so one person can have a different role
in another workspace.

```tsx
<OrganizationPage
  organization={{ id: 'org_1', name: 'Acme', slug: 'acme', plan: 'Pro' }}
  members={members}
  invitations={invitations}
  roles={['Owner', 'Admin', 'Member', 'Viewer']}
  onInvite={({ email, role }) => inviteMember(email, role)}
  onChangeRole={(member, role) => updateMemberRole(member.id, role)}
  onRemoveMember={(member) => removeMember(member.id)}
  onResendInvitation={(invitation) => resendInvitation(invitation.id)}
  onRevokeInvitation={(invitation) => revokeInvitation(invitation.id)}
/>
```

Use `OrganizationSummary`, `InviteMemberDialog`, `OrganizationMemberTable`,
and `PendingInvitationList` independently for a custom workspace settings
layout. Your application remains responsible for role authorization and for
enforcing ownership rules.

## Security and API-key integrations

`SecurityPage` uses `InputOTP` when you supply `twoFactorVerification`; the
completed code is delivered to your callback. `CreateApiKeyDialog` uses a
radio group for the built-in read-only/read-and-write choices and an optional
native expiry date. Return `{ secret }` from `onCreate` to display the raw key
once. These controls remain frontend-only: validate the code, enforce expiry,
and grant the requested key scope on your server.

```tsx
<SecurityPage
  twoFactorEnabled
  onToggleTwoFactor={setTwoFactorEnabled}
  twoFactorVerification={{ length: 6, onVerify: verifyTwoFactorCode }}
/>

<ApiKeyManager
  keys={keys}
  onCreate={({ name, permissions, expiresAt }) =>
    createKey({ name, permissions, expiresAt })
  }
  onRevoke={(id) => revokeKey(id)}
/>
```

## Authentication methods

`LoginPage`, `SignupPage`, `AuthModal`, and the unwrapped `AuthForm` accept
`authMethods`. Enable any combination of email/password, Google, and GitHub.
The library calls your handler and never owns OAuth client IDs, redirects, or
callback exchanges. Use `ForgotPasswordPage` and `ResetPasswordPage` only when
your application enables email/password authentication.

```tsx
import { LoginPage, ResetPasswordPage } from '@sypra-ui/pages';

const startOAuth = (provider: string) => {
  window.location.assign(`/auth/${provider}`);
};

// Email/password only
<LoginPage
  authMethods={{ emailPassword: true }}
  onSubmit={signInWithPassword}
/>;

// Google only (or use 'github')
<LoginPage authMethods={{ google: true }} onProviderLogin={startOAuth} />;

<ResetPasswordPage
  token={resetToken}
  onSubmit={({ password, token }) => resetPassword({ password, token })}
/>;

// Email/password, Google, and GitHub
<LoginPage
  authMethods={{ emailPassword: true, google: true, github: true }}
  onProviderLogin={startOAuth}
  onSubmit={signInWithPassword}
/>;

// Your own page shell
<section className="my-auth-page">
  <AuthForm
    mode="login"
    authMethods={{ google: true, github: true }}
    onProviderLogin={startOAuth}
  />
</section>;
```

## Page sections

Composite pages expose their smaller building blocks and let you hide sections
you do not need:

```tsx
<SecurityPage sections={{ password: false, twoFactor: false }} />
<BillingPage sections={{ paymentMethod: false, invoices: false }} />
<LandingPage sections={{ header: false, footer: false }} />
<ProfilePage
  profile={{
    firstName: 'Avery',
    lastName: 'Stone',
    email: 'avery@example.com',
  }}
  fields={{ avatar: false, username: true, email: false }}
  onSave={saveProfile}
  dangerZone={{ onDeleteAccount: deleteAccount }}
/>
<ApiKeyManager actions={{ create: false, revoke: false }} />
```

Pass a `dangerZone` configuration to add it to `ProfilePage`; hide it again
with `sections={{ dangerZone: false }}` when the application needs a safer
profile variant. Opt into the optional username field with
`fields={{ username: true }}`; it then renders whether or not its initial
value is present in `profile`.

## Building blocks

Use exported components directly when you need a custom layout:

- Auth: `AuthProviderButton`, `AuthDivider`
- Account: `ProfileSummary`, `SessionCard`, `ApiKeyCard`
- Notifications: `NotificationBell`, `NotificationList`, `NotificationItem`,
  `NotificationPreferences`, `NotificationsPage`
- Activity: `AuditLogItem`, `AuditLogViewer`, `AuditLogPage`
- Billing: `SubscriptionCard`, `PaymentMethodCard`, `InvoiceTable`,
  `PricingCard`, `UsageMetric`
- Payments: `StripeElementsProvider`, `StripePaymentForm`,
  `StripeBillingForm`, `StripePaymentWidget`, `StripeBillingWidget`,
  `StripePaymentPage`
- Support: `SupportForm`, `SupportPage`
- Status: `StatusPage`, `PaymentStatusPage`, `OAuthStatusPage`,
  `EmailVerificationPage`, `InvitationStatusPage`, `AccessDeniedPage`,
  `NotFoundPage`, `ServerErrorPage`, `MaintenancePage`, `OfflinePage`
- Organization: `OrganizationSummary`, `InviteMemberDialog`,
  `OrganizationMemberTable`, `PendingInvitationList`, `OrganizationPage`
- Marketing: `MarketingHeader`, `Hero`, `FeatureGrid`, `FAQ`, `CTA`,
  `Footer`

For the common account order, use `AccountSettingsPage` and pass only the
sections your product needs:

```tsx
<AccountSettingsPage
  profile={{ profile, onSave: saveProfile }}
  security={{ sessions, onRevoke, onRevokeAll }}
  apiKeys={{ keys, onCreate: createKey, onRevoke: revokeKey }}
  sections={{ billing: false }}
/>
```

Every composite page also accepts `children` as an extension slot for future
application-specific content:

```tsx
<BillingPage sections={{ paymentMethod: false }} invoices={invoices}>
  <UsageChart />
</BillingPage>
```

## Testing an integration

Pages intentionally do not make network calls. Test them by rendering with
fixture data and asserting your callbacks, then test your API, OAuth, and
Stripe routes separately. The repository runs the package unit suites with:

```sh
pnpm test
pnpm --filter @sypra-ui/ui test:coverage
pnpm --filter @sypra-ui/pages test:coverage
```
