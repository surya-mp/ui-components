# @sypra-ui/ui

React primitives for React 18+ applications. They use Tailwind utility classes
and semantic CSS variables, so the library has no runtime styling dependency.

## Install

```sh
pnpm add @sypra-ui/ui
```

Import the theme tokens once in your global stylesheet:

```css
@import '@sypra-ui/ui/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Tell Tailwind to scan the installed package so it emits the utilities used by
the components:

```ts
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@sypra-ui/ui/dist/**/*.{js,mjs}',
  ],
};
```

## Customize the theme

Set the semantic tokens on `:root` for an application-wide theme, or on a
wrapper to scope a theme to one part of the page.

```css
.brand-theme {
  --rui-background: 224 30% 8%;
  --rui-foreground: 210 40% 98%;
  --rui-card: 224 25% 12%;
  --rui-primary: 270 85% 62%;
  --rui-primary-foreground: 0 0% 100%;
  --rui-secondary: 224 20% 18%;
  --rui-border: 224 18% 24%;
  --rui-success: 142 71% 45%;
  --rui-success-background: 142 45% 14%;
  --rui-success-foreground: 142 70% 82%;
  --rui-warning: 38 92% 50%;
  --rui-warning-background: 36 45% 16%;
  --rui-warning-foreground: 45 93% 81%;
  --rui-ring: 270 85% 68%;
  --rui-radius: 1rem;
}
```

`--rui-radius` changes the default shape: use `0` for sharp controls, a small
value for subtle rounding, or `9999px` for pills. The full token set is in
`src/styles.css`.

## Customize one component

Most visual primitives accept `className`, and `Button` provides `variant` and
`size` (`sm`, `md`, `lg`). Use regular Tailwind utilities for local sizing or
shape changes. Prefix an override with `!` when it replaces a library utility
for the same CSS property. Wrap a page composition in a themed element to
scope token changes to that page.

```tsx
import { Button, Card } from '@sypra-ui/ui';

<Button size="lg" className="!rounded-full !px-8 !text-base">
  Upgrade
</Button>

<Card className="!rounded-none !border-violet-500 !bg-violet-50">
  Custom card
</Card>
```

The package is ESM-only. Import `@sypra-ui/ui/styles.css` exactly once per
application.

## Composition helpers

`FormField` keeps a visible label, optional helper text, and field error
together. `SettingRow` provides an aligned title, description, and trailing
action for settings cards. Use `ConfirmActionDialog` for destructive actions
that need an explicit confirmation.
