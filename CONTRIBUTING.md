# Contributing To template-vite-react

This repository is a Vite React application template. Keep contributions focused,
validated, and easy to reuse in downstream projects.

## Local Setup

Use the pinned runtime and package manager:

```shell
nvm use
corepack enable
yarn install --immutable
yarn setup
yarn doctor
```

`yarn setup` verifies Node 24 and Yarn 4.14.1, creates
`.env.development.local` from `.env.example` only when the local file is missing,
and runs `yarn prepare` for Husky hooks. It never overwrites an existing local
env file.

`yarn doctor` reports runtime versions, local env-file presence, and the detected
auth profile. Missing `.env.development.local` is a warning; wrong Node or Yarn
versions fail the check. The compatibility wrapper still works when needed:

```shell
sh ./scripts/post-install.sh
```

Dummy Cognito values are safe for booting the app, but use real values only when
testing auth against an owned user pool.

## Branches And Commits

- Create short-lived branches from the latest `main`.
- Keep each pull request scoped to one concern.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit
  messages and PR titles, for example `fix(auth): handle missing Cognito config`.
- Rebase or update from `main` before asking for review when the branch is stale.
- Sign commits when required by the repository or organization policy.

## Validation

Run the checks that match your change. For most code changes, run:

```shell
yarn doctor
yarn lint
yarn test
yarn build
```

For UI, routing, or browser behavior changes, also run:

```shell
yarn test:e2e:install
yarn test:e2e
```

For shared UI or Storybook changes, also run:

```shell
yarn build-storybook
```

CI installs dependencies with `yarn install --immutable`, installs Playwright
Chromium, runs `yarn ci`, runs `yarn test:e2e`, builds the app, and runs
semantic-release on pushes to `main`.

## Environment And Auth Changes

Document any new `VITE_*` variable in `.env.example` and `README.md`. Keep the
GitHub Pages demo safe by leaving real Cognito values out of committed files and
workflow defaults.

Auth uses AWS Amplify/Cognito and should continue to degrade cleanly when
Cognito settings are blank or invalid. Include local validation notes in the PR
when auth behavior changes.

## Dependency Changes

Keep dependency updates in dedicated PRs. A dependency PR should explain:

- direct dependencies changed
- notable transitive audit or deprecation impact
- lockfile-only changes, if any
- validation commands and results
- rollback notes when the update affects build, test, release, auth, or UI
  tooling

Do not use broad Yarn resolutions or package overrides without an isolated
validation plan and a clear reason.

## Documentation Changes

Update docs in the same PR as the behavior they describe. For docs-only changes,
run at least:

```shell
yarn doctor
yarn lint
```

## Pull Requests

Before opening a PR:

- confirm `git status -sb` contains only intended changes
- fill out `.github/PULL_REQUEST_TEMPLATE.md`
- include exact validation commands and results
- link related issues with closing keywords only when the PR actually resolves
  them

All contributors are expected to follow the shared
[Code of Conduct][code-of-conduct].

<!-- LINKS -->

[code-of-conduct]: https://github.com/aquia-inc/public-templates/blob/main/CODE_OF_CONDUCT.md

<!-- /LINKS -->
