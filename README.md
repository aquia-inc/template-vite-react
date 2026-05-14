# template-vite-react

## Overview

This repository is a single-page Vite React application template. It includes
React 19, TypeScript, React Router, MUI, optional AWS Amplify/Cognito auth,
Storybook, Jest with SWC transforms, Playwright smoke tests, semantic-release,
and a GitHub Pages demo workflow.

The template is intended to be copied or forked for application work, so local
setup, validation, and release behavior are kept explicit.

## System Requirements

- [Node 24](https://nodejs.org/en/download)
- Yarn 4.14.1, pinned by `packageManager`, `.yarnrc.yml`, and
  `.yarn/releases/yarn-4.14.1.cjs`
- [nvm](https://github.com/nvm-sh/nvm), [n](https://github.com/tj/n), or another
  Node version manager
- [GitLeaks](https://github.com/gitleaks/gitleaks/tree/master#installing) for
  local secret scanning

## Getting Started

1. Clone the repository and change into the root directory:

```shell
git clone git@github.com:aquia-inc/template-vite-react.git
cd template-vite-react
```

2. Select the pinned Node version and enable Yarn through Corepack:

```shell
# using nvm
nvm install
nvm use

# enable package-manager shims
corepack enable
```

3. Install dependencies:

```shell
yarn install --immutable
```

4. Install or refresh local hooks:

```shell
yarn prepare
```

5. Create the local development env file:

```shell
sh ./scripts/post-install.sh
```

The post-install script copies `.env.example` to `.env.development.local`.
The default copied file uses the `local-disabled` profile. Update it for demo
auth or real Cognito only when needed.

## Environment And Auth

The app reads public Vite environment variables from `.env*` files. Local
development starts from `.env.example`, which keeps Cognito blank by default.

Profiles:

| Profile          | Use when                                 | Required settings                                                                       |
| ---------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `local-disabled` | Local dev without auth                   | Keep Cognito blank and `VITE_DEMO_AUTH_ENABLED=false`.                                  |
| `local-demo`     | Local dev with demo auth                 | Keep Cognito blank and set `VITE_DEMO_AUTH_ENABLED=true`.                               |
| `cognito`        | Local or deployed testing with real auth | Provide every Cognito variable. This overrides demo auth.                               |
| `pages-demo`     | GitHub Pages public demo                 | Use `/template-vite-react/`, keep Cognito blank, and set `VITE_DEMO_AUTH_ENABLED=true`. |

Important variables:

- `VITE_PUBLIC_BASE_PATH`: router and asset base path. Use `/` for local dev.
- `VITE_CF_DOMAIN`: public app origin used by auth redirects.
- `VITE_DEMO_AUTH_ENABLED`: set to `true` only for demo auth. Demo auth works
  only when all Cognito values are blank.
- `VITE_IDP_ENABLED`: set to `true` only when the external identity provider
  button should be shown.
- `VITE_AWS_REGION`, `VITE_COGNITO_DOMAIN`, `VITE_USER_POOL_ID`,
  `VITE_USER_POOL_CLIENT_ID`, `VITE_COGNITO_REDIRECT_SIGN_IN`, and
  `VITE_COGNITO_REDIRECT_SIGN_OUT`: Cognito configuration for Amplify auth.

Leave Cognito values blank or unset when auth should be disabled or demo auth
should be used. Partial Cognito settings are treated as `unknown` profile
configuration and keep auth disabled until the values are completed or removed.

## Local Development

Start the Vite development server:

```shell
yarn dev
```

Start Storybook:

```shell
yarn storybook
```

or:

```shell
yarn sb
```

## Validation

Run the same categories of checks used by CI:

```shell
yarn lint
yarn test
yarn build
```

Install Playwright's Chromium browser before the first local E2E run:

```shell
yarn test:e2e:install
yarn test:e2e
```

For headed E2E debugging:

```shell
yarn test:e2e:headed
```

Build Storybook before changing shared UI or stories:

```shell
yarn build-storybook
```

CI runs `yarn install --immutable`, installs Playwright Chromium, runs
`yarn ci`, runs `yarn test:e2e`, builds the app, and runs semantic-release on
pushes to `main`.

## Build, Release, And Deploy

Build the production app:

```shell
yarn build
```

Release automation runs only on pushes to `main`. The release job uses
semantic-release with conventional commits, writes release notes/changelog
metadata, creates GitHub releases, and keeps npm publishing disabled.

The GitHub Pages deployment job uses the built `dist` artifact after the release
job succeeds.

## GitHub Pages Demo

The demo app deploys to GitHub Pages at:

```text
https://aquia-inc.github.io/template-vite-react/
```

GitHub Pages must be configured in the repository settings with **Build and
deployment** source set to **GitHub Actions**.

The CI/CD workflow deploys on every push to `main` after lint, unit test,
Playwright, build, and semantic-release steps complete. Pull requests keep the
local `/` base path and do not deploy.

The Pages build uses these public environment values:

```shell
VITE_PUBLIC_BASE_PATH=/template-vite-react/
VITE_CF_DOMAIN=https://aquia-inc.github.io/template-vite-react/
VITE_DEMO_AUTH_ENABLED=true
VITE_IDP_ENABLED=false
```

Leave the Cognito environment values blank or unset for the public demo. That
selects the `pages-demo` profile. For project Pages, Vite builds assets under
`/template-vite-react/` and React Router uses the matching basename. The workflow
also copies `dist/index.html` to `dist/404.html` so direct visits to client-side
routes can load the SPA fallback.

## Dependency And Security Triage

See `docs/dependency-security-triage.md` for the current audit/outdated surface
and recommended follow-up PRs. Keep dependency manifest and lockfile changes in
separate, focused PRs so validation and rollback stay clear.
