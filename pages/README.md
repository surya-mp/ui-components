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

## Stripe Elements payments

`@sypra-ui/pages` exposes Stripe Elements forms but never creates an intent or
handles Stripe secret keys. Install the two Stripe peer dependencies alongside
the Sypra packages:

```sh
pnpm add @stripe/stripe-js @stripe/react-stripe-js
```

Create the `PaymentIntent`, `SetupIntent`, or subscription on your server and
return only its client secret to a client component. A paid subscription uses
the first invoice's `PaymentIntent` client secret; use `mode="setup"` only
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

## Authentication methods

`LoginPage`, `SignupPage`, `AuthModal`, and the unwrapped `AuthForm` accept
`authMethods`. Enable any combination of email/password, Google, and GitHub.
The library calls your handler and never owns OAuth client IDs, redirects, or
callback exchanges.

```tsx
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
- Billing: `SubscriptionCard`, `PaymentMethodCard`, `InvoiceTable`,
  `PricingCard`, `UsageMetric`
- Payments: `StripeElementsProvider`, `StripePaymentForm`,
  `StripeBillingForm`, `StripePaymentWidget`, `StripeBillingWidget`,
  `StripePaymentPage`
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
