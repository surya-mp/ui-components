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

The packages use Tailwind utilities and semantic `--rui-*` CSS variables. See
the package READMEs for the required Tailwind content paths and for global or
per-component customization. Components take data and callbacks only:
applications retain ownership of APIs, routing, auth, and payments.

## Releases

Run `pnpm changeset` for every publishable change and commit the generated
file. Merging to `main` opens or updates a version PR; merging that PR publishes
the ordered package versions and creates their Git tags. Configure npm Trusted
Publishing for both packages against `.github/workflows/release.yml` before the
first automated release.
