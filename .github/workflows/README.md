# CI/CD pipeline

The client is a static SPA. Every build bundles the election data (fetched by
`yarn download-data`) into `dist/`, and deployment is a plain upload of `dist/`
to [Cloudflare Pages](https://developers.cloudflare.com/pages/) via Wrangler.

## Workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| **`build.yml`** | `workflow_call` (reusable) | Downloads election data, builds `dist`, and optionally runs the Cypress E2E suite. The single source of truth for how the client is built. Uploads the `dist` artifact. |
| **`pr-validation.yml`** | Pull request → `master`/`development` | Calls `build.yml` (build only, no Cypress) to confirm a PR compiles. |
| **`staging.yml`** | Push to `master` | Calls `build.yml` (with Cypress), then deploys `dist` as a **preview** on the `lavinia` project (`--branch=staging`), reachable at `staging.lavinia.pages.dev`. |
| **`release.yml`** | Push tag `x.y.z` | Verifies the tag matches `package.json` version → `build.yml` → zips `dist` into `artifact.zip` and publishes a GitHub Release → calls `deploy.yml`. |
| **`deploy.yml`** | `workflow_call` + `workflow_dispatch` | Downloads a release's `artifact.zip` and deploys it to **production** on the `lavinia` project (`--branch=master`). |

Staging and production share a single `lavinia` Pages project: staging is a
preview deployment (`--branch=staging`), production is the production branch
(`--branch=master`). The `lavinia.no` custom domain only ever serves production.

```
PR ──────────────► build.yml (no Cypress)

push master ─────► build.yml (Cypress) ──► lavinia preview (staging.lavinia.pages.dev)

push tag x.y.z ──► guard ──► build.yml (Cypress) ──► package (Release) ──► deploy.yml ──► lavinia production
                                                                              ▲
manual dispatch ──────────────────────────────────────────────────────────────┘
```

Production always ships the immutable `artifact.zip` attached to the GitHub
Release, so a deploy is byte-identical to what was built and tested for that tag.

## Re-deploying (or rolling back to) an older tag

`deploy.yml` can be run manually to redeploy any tag that already has a published
GitHub Release — useful for rolling back production to a previous version:

1. GitHub → **Actions** → **Deploy** → **Run workflow**.
2. Leave **"Use workflow from"** on `master` — that dropdown only picks which
   version of `deploy.yml` runs, not what gets deployed.
3. Type the release tag (e.g. `2.9.8`) into the **tag** field. It's a free-text
   box (GitHub can't offer a dynamic tag picker); the workflow validates that
   the value is an existing **published** release and fails fast otherwise, so a
   branch name, typo, or draft tag is rejected before anything deploys.
4. Run it. The workflow pulls that release's `artifact.zip` and deploys it to
   the `lavinia` production project. No rebuild happens — the exact bytes that
   originally shipped are redeployed.

## One-time setup

A single **Direct Upload** Cloudflare Pages project with `master` as the
production branch (staging is served from a preview branch on the same project):

```bash
npx wrangler pages project create lavinia --production-branch=master
```

Repository secrets (Settings → Secrets and variables → Actions):

| Secret | Used by | Notes |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | staging/deploy | Scope: **Account · Cloudflare Pages · Edit**, restricted to your account. |
| `CLOUDFLARE_ACCOUNT_ID` | staging/deploy | From `wrangler whoami` or the dashboard URL. |
| `CYPRESS_RECORD_KEY` | build (Cypress) | Enables parallel recording in Cypress Cloud. Optional. |

`GITHUB_TOKEN` is provided automatically; no PAT is required — the release →
deploy handoff uses `workflow_call`, which is not subject to the rule that
`GITHUB_TOKEN`-published events don't trigger further workflows.

## Knobs

- **Cypress on staging / PRs** — the `run_cypress` input to `build.yml`
  (`staging.yml` passes `true`, `pr-validation.yml` passes `false`).
- **Pages project / branch** — the `--project-name` (both `lavinia`) and
  `--branch` flags: `staging.yml` uses `--branch=staging` (preview), `deploy.yml`
  uses `--branch=master` (production).
- **`WIKI`** and Node version — the top-level `env` block in `build.yml`. This
  is the only place the client's build environment is defined.
