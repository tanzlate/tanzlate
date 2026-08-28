---
name: verify
description: Run the full lint / type-check / test / build sequence for the tanzlate workspace, handling the per-package script asymmetry (vue has no lint script and type-checks with vue-tsc; vitest must be run non-watch). Use before opening a PR or when asked to verify changes.
---

Run these from the repo root, in order. Report the outcome of each step honestly — if a step
fails, show the relevant output and stop rather than continuing to the next step.

1. **Lint** — `pnpm lint`

   This is `eslint .` over the whole workspace. `packages/vue` has no `lint` script of its own,
   so this root command is the only thing that lints it. `no-console` is an error.

2. **Type-check**

   - `pnpm --filter=@tanzlate/vue type-check` (`vue-tsc --build`)
   - `core` and `vanilla` type-check via `tsc` as part of their build in step 4; no separate
     command needed.

3. **Test** — `pnpm vitest run`

   Use `vitest run` explicitly. `pnpm test` is bare `vitest` and starts watch mode, which hangs.
   To scope to one package, note that project labels do not match directory names: the
   `packages/vanilla` project is labeled `core`.

4. **Build** — `pnpm build-packages`

   Builds only the three published packages. Use `pnpm build` instead only when `docs/` or
   `examples/` also need to build.

5. **Changeset check**

   If the working tree touches anything under `packages/*/src`, check whether a `.changeset/*.md`
   file exists covering it (`ls .changeset/*.md` — ignore `README.md` and `config.json`). If none
   does, tell the user a changeset is needed and offer to run `pnpm changeset`. Do not create the
   changeset file by hand.

Finish with a short pass/fail summary per step.
