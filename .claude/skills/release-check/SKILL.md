---
name: release-check
description: Pre-flight a tanzlate release — confirm a changeset exists, compare local package versions against what is actually published on the npm registry, and check the release workflow's npm credential setup. Use before merging dev to main, or when diagnosing a failed release job.
disable-model-invocation: true
---

Diagnose whether a release will succeed, or why one failed. Work through all four checks and
report findings together; do not stop at the first problem.

## 1. Pending changesets

```
ls .changeset/*.md | grep -v README
```

If empty, changesets will publish whatever local versions exist without bumping anything. If the
current branch changed `packages/*/src`, that is a problem — flag it.

## 2. Local versions vs the npm registry

Read the `version` field from each of `packages/core/package.json`,
`packages/vanilla/package.json`, `packages/vue/package.json`. Then, for each:

```
curl -s https://registry.npmjs.org/@tanzlate%2F<name> \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['dist-tags'], sorted(d['versions']))"
```

Report local vs published side by side. A local version that equals the published `latest` means
changesets will skip it. A local version ahead of `latest` is what should publish.

## 3. Credential setup

Read `.github/workflows/release.yml`. Confirm whether it passes `NPM_TOKEN` or relies on OIDC
trusted publishing (`permissions: id-token: write` plus `NPM_CONFIG_PROVENANCE`).

**Do not re-derive these — they are already established:**

- All three packages exist on npm under the `@tanzlate` **org** scope, maintainer
  `arthur_plazanet`. A Trusted Publisher is configured for `@tanzlate/core`
  (`tanzlate/tanzlate` → `release.yml`, `npm publish`).
- npm returns `E404 Not Found - PUT .../@tanzlate%2f<name>` for an _unauthorized_ publish to an
  existing package. It never returns 403. That error means the credential was rejected.
- Provenance succeeding in the same run is not evidence of auth — Sigstore signing goes to Fulcio
  with GitHub's OIDC token, independent of npm.
- `changeset publish` runs **`pnpm publish`** here (pnpm is detected as the publish tool), which
  delegates the upload to the `npm` binary on `PATH`.

**So the thing to check first is the npm CLI version in the job.** npm OIDC trusted publishing
requires **npm >= 11.5.1**. `actions/setup-node` with `node-version: 20` ships npm 10.x, which
cannot do it. Read the `npm --version` line the workflow already prints in its Corepack step.

If npm is < 11.5.1, that is the cause. The fix:

```yaml
- uses: actions/setup-node@v6
  with:
    node-version: 22
    registry-url: https://registry.npmjs.org

- name: Enable Corepack (pnpm only)
  run: corepack enable pnpm # bare `corepack enable` also shims npm and shadows the next step

- name: Toolchain for OIDC trusted publishing
  run: |
    corepack prepare pnpm@latest --activate
    npm install -g npm@latest
    npm --version                    # must be >= 11.5.1
    pnpm --version
```

Only if npm is already >= 11.5.1, move on to: confirm `vanilla` and `vue` each have their own
Trusted Publisher entry (it is per-package, not inherited from the scope), and that the workflow
filename recorded there still matches `release.yml`.

Never propose renaming packages, changing the scope, resetting versions, or editing
`.changeset/config.json` as a workaround.

## 4. Build sanity

Run `pnpm build-packages` and confirm each package emits `dist/index.js`, `dist/index.mjs`, and
`dist/index.d.ts` — these are the paths declared in each `exports` map, and `files` publishes only
`dist`.

## Output

A short table of the three packages (local version, published latest, will-publish yes/no),
followed by any blocking issues and the specific next action for each.
