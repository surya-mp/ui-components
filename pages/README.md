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

`LoginPage`, `SignupPage`, `AuthModal`, and the unwrapped `AuthForm` accept a
`loginOptions` list. Select any combination of `email-password`, `google`,
and `github`. The library calls your handler and never owns OAuth client IDs,
redirects, or callback exchanges.

```tsx
const startOAuth = (provider: string) => {
  window.location.assign(`/auth/${provider}`);
};

// Email/password only
<LoginPage onSubmit={signInWithPassword} />;

// Google only (or use 'github')
<LoginPage loginOptions={['google']} onProviderLogin={startOAuth} />;

// Email/password, Google, and GitHub
<LoginPage
  loginOptions={['email-password', 'google', 'github']}
  onProviderLogin={startOAuth}
  onSubmit={signInWithPassword}
/>;

// Your own page shell
<section className="my-auth-page">
  <AuthForm
    mode="login"
    loginOptions={['google', 'github']}
    onProviderLogin={startOAuth}
  />
</section>;
```
