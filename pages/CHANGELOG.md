# @sypra-ui/pages

## 0.8.0

### Minor Changes

- Add configurable `SupportForm` and `SupportPage` contact compositions with
  optional topics and attachments.
- Add persistent notification, notification-preference, and audit-log page
  compositions.
- Add optional API-key expiration and a one-time raw-secret dialog when the
  application returns a newly created key.
- Add callback-driven reset-password form and page compositions for
  email/password applications.
- Add the `@sypra-ui/pages/widgets` entry point for domain widgets while
  preserving root package imports.
- Split every domain widget into a focused source module; page modules now
  compose widgets without duplicating their implementations.
- Add a bell-popup “Show all notifications” callback and an opt-in standalone
  notifications page shell for application routes.

## 0.7.1

### Patch Changes

- Document custom server-created PaymentIntent integration without Stripe Price
  presets.
- Document Dashboard-managed global methods, fixed server-side allow-lists,
  and Apple Pay/Google Pay wallet configuration.

## 0.7.0

### Minor Changes

- Add optional typed contracts and complete server integration examples for
  Stripe subscriptions and the Billing Portal.
- Add reusable completion and system status pages.
- Add customer-organization member and invitation page compositions.
- Add V8 coverage reporting and behavioral tests for billing, marketing,
  payments, organization, status, and settings compositions.

### Patch Changes

- Updated dependencies
  - @sypra-ui/ui@0.3.0

## 0.6.0

### Major Changes

- Replace `Profile.name` with separate `firstName` and `lastName` fields.

### Minor Changes

- Add opt-in profile usernames and Stripe Elements payment, billing, and
  composition components.

## 0.5.0

### Minor Changes

- Add configurable account settings, auth, billing, and marketing building blocks alongside responsive layout improvements.

### Patch Changes

- Updated dependencies
  - @sypra-ui/ui@0.2.0

## 0.4.0

### Minor Changes

- 1a3d6a8: Add `authMethods` and optional page sections for configurable auth, settings, billing, and marketing pages.

## 0.3.0

### Minor Changes

- 3a05dcc: Add `loginOptions` for selecting any email/password, Google, and GitHub sign-in combination.

## 0.2.0

### Minor Changes

- ca3ee04: Allow auth pages to combine email/password, Google, and GitHub sign-in methods.
