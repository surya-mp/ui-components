# Sypra UI

Frontend-only React + TypeScript components and SaaS page compositions, organized as a pnpm/Turborepo workspace.

## Packages

- `@sypra-ui/ui` — accessible primitives, overlay, navigation, feedback, layout, and data components.
- `@sypra-ui/pages` — callback/data-driven auth, settings, security, API key, billing, and marketing compositions.
- `@sypra-ui/showcase` — the interactive visual documentation app.

## Run locally

```sh
pnpm install
pnpm --filter @sypra-ui/ui build
pnpm --filter @sypra-ui/pages build
pnpm dev
```

For a release-style validation, run `pnpm build && pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e`.
For HTML and terminal coverage reports, run `pnpm --filter @sypra-ui/ui test:coverage`
and `pnpm --filter @sypra-ui/pages test:coverage`.

The packages use Tailwind utilities and semantic `--rui-*` CSS variables. See
the package READMEs for the required Tailwind content paths and for global or
per-component customization. Components take data and callbacks only:
applications retain ownership of APIs, routing, auth, and payments.

## Releases

Before pushing a publishable change, update the affected package version and
its changelog. A push to `main` runs the checks, publishes package versions
that are not yet on npm, and pushes their Git tags. Configure npm Trusted
Publishing for both packages against `.github/workflows/release.yml` before the
first automated release.
