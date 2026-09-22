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
<ProfilePage fields={{ avatar: false, email: false }} />
<ApiKeyManager actions={{ create: false, revoke: false }} />
```

Use exported components such as `SessionManager`, `SubscriptionCard`,
`PaymentMethodCard`, `InvoiceTable`, `Hero`, `FeatureGrid`, `FAQ`, `CTA`, and
`Footer` directly when you need a completely custom page layout.

Every composite page also accepts `children` as an extension slot for future
application-specific content:

```tsx
<BillingPage sections={{ paymentMethod: false }} invoices={invoices}>
  <UsageChart />
</BillingPage>
```
