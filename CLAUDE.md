# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`tanzlate` is an i18n library for Vue 3 / Nuxt built on i18next. Its distinguishing feature is
**component interpolation inside translation strings** — a translation value like
`"Your <UserBadge /> is ready. <AppButton>Start tour</AppButton>"` is parsed at render time and
each tag becomes a real Vue component or HTML element, so the whole sentence stays in one
translation key. The other differentiator is namespace scoping via `useI18n('<namespace>')`.

pnpm workspace monorepo. Three published packages, strictly layered:

- `@tanzlate/core` — formatter types + `translation-helpers`. No framework, no i18next runtime.
- `@tanzlate/vanilla` — i18next runtime (`useCoreContext`, `initI18nConfig`). Depends on `core`.
- `@tanzlate/vue` — Vue layer (`I18nProvider`, `useI18n`, `<Tanzlate>`, `registerComponent`).
  Depends on `vanilla` + `core`.

Never introduce a dependency that points up this chain (e.g. `core` must not import `vanilla`).
Internal deps use `workspace:*`.

`docs/` (VitePress) and `examples/nuxt` are also workspace members but are private and unpublished.

## Commands

Run from the repo root unless noted.

- `pnpm lint` — `eslint .` across the whole workspace. `packages/vue` has **no** `lint` script of
  its own; the root command is what covers it.
- `pnpm vitest run` — **use this, not `pnpm test`.** `pnpm test` is bare `vitest`, which starts
  watch mode and will hang a non-interactive session.
- `pnpm build` — `pnpm -r build`, which includes `docs` and `examples`. Use `pnpm build-packages`
  to build only the three published packages, or `pnpm build-core|build-vanilla|build-vue` for one.
- `pnpm --filter=@tanzlate/vue type-check` — `vue-tsc --build`. The `vue` package type-checks
  separately from `tsc`; the other two type-check as part of their `build`.
- `pnpm format` — prettier over everything.
- `pnpm syncpack:lint` — verifies dependency version consistency (see below).

Vitest project names do not match directory names: the project defined in
`packages/vanilla/vitest.config.ts` is labeled **`core`**. `vitest --project core` runs the
_vanilla_ package's tests.

## Gotchas

- **Exact versions only.** `.syncpackrc.json` enforces `specifierTypes: ["exact"]` for every
  dependency in every package. Never write `^1.2.3` or `~1.2.3` in a `package.json` — pin the
  exact version. Run `pnpm syncpack:fix` if versions drift.
- **`no-console` is an ESLint error** repo-wide, including in `.vue` files. Never leave a
  `console.log` in source.
- **Every user-facing package change needs a changeset.** Run `pnpm changeset` and commit the
  generated `.changeset/*.md`. Without one, the release workflow will not version or publish.
- **`.OLD` files are dead code.** `packages/vue/src/**/*.OLD` (`Translate.ts.OLD`,
  `translation-parser.ts.OLD`, `testtest.ts.OLD`, `Translate2.vue.OLD`) are superseded. Ignore
  them entirely — do not read them for context, edit them, or treat them as the implementation.
  The live component-interpolation implementation is `packages/vue/src/components/translate/Tanzlate.ts`.

## Git workflow

- `dev` is the default branch. **Always branch off `dev` and open a PR into `dev`** — never
  commit to `dev` directly.
- A workflow auto-opens a `dev` → `main` PR on every push to `dev`. Merging to `main` triggers
  the release.
- Commit messages are free-form. commitlint was deliberately removed — there is no
  `commit-msg` hook and no commit convention to enforce. Do not assume conventional-commit
  prefixes are required, and do not reintroduce commitlint without being asked.
- `.husky/pre-commit` runs `lint-staged`: `eslint --fix` on JS/TS and `prettier --write` on
  everything else.

## Releases

`.github/workflows/release.yml` runs changesets on push to `main`. It sets **no `NPM_TOKEN`** and
relies on npm **OIDC trusted publishing** (`id-token: write` + `NPM_CONFIG_PROVENANCE`).

Facts established about the publish path, so a future session does not re-derive them:

- `@tanzlate` is an npm **organization** scope. All three packages already exist there, maintainer
  `arthur_plazanet`. The packages are NOT missing from the registry.
- A Trusted Publisher **is** configured on npmjs.com for `@tanzlate/core`
  (`tanzlate/tanzlate` → `release.yml`, permission `npm publish`). Verify the same exists for
  `vanilla` and `vue` before blaming npm-side config.
- npm reports an _unauthorized_ publish to an **existing** package as
  `E404 Not Found - PUT https://registry.npmjs.org/@tanzlate%2f<name>`, never `403`. So that error
  means the credential was not accepted — not that the package or scope is missing.
- Provenance succeeding in the same run proves nothing about auth. Sigstore provenance signing
  uses GitHub's OIDC token against Fulcio directly and works even when the npm publish is
  unauthenticated.
- `changeset publish` does **not** run `npm publish` here. `getPublishTool` detects pnpm and runs
  `pnpm publish`, which then delegates the upload to the `npm` binary on `PATH` — which is why the
  failure output is npm's. **The npm CLI version in CI is what governs OIDC trusted publishing**,
  and it requires npm **>= 11.5.1**. `actions/setup-node` with `node-version: 20` ships npm 10.x,
  which cannot do trusted publishing at all.
- `corepack enable` with no arguments shims `npm` as well as `pnpm`, which can shadow a
  `npm install -g npm@latest`. Use `corepack enable pnpm`.

Do NOT "fix" a release failure by renaming packages, changing the scope, resetting versions, or
editing `.changeset/config.json`.

## Adding module-specific instructions

Per-package guidance can go in `packages/<name>/CLAUDE.md` — those are loaded automatically when
working in that directory. Cross-cutting rules scoped to file globs can go in `.claude/rules/*.md`
with `paths` frontmatter.
