# template-vite-react

## Overview

This project contains the application's UI built with React, Vite, TypeScript, and SWC. It requires Node.js v24, [nvm](https://github.com/nvm-sh/nvm) (or [n](https://github.com/tj/n)), and Yarn v4.

## System Requirements

- [Node 24](https://nodejs.org/en/download)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [GitLeaks](https://github.com/gitleaks/gitleaks/tree/master#installing)

## Getting Started

1. Clone the repository and `cd` into the root directory:

```shell
git clone git@github.com:aquia/template-vite-react.git

cd template-vite-react
```

2. Setup Node.js and Yarn

```shell
# using nvm
nvm install --latest-npm
nvm use

# using n
n install auto
n use auto

# enable corepack
corepack enable yarn
```

3. Install dependencies:

```shell
yarn
```

3. Install pre-commit hooks:

```shell
yarn prepare
```

## Building

To build the application, run the following from the root directory:

```shell
yarn build
```

## Testing

To run unit tests, run the following from the root directory:

```shell
yarn test
```

To install Playwright browser dependencies, run:

```shell
yarn test:e2e:install
```

To run Playwright E2E smoke tests, run:

```shell
yarn test:e2e
```

For headed browser debugging:

```shell
yarn test:e2e:headed
```

To lint all files, run the following from the root directory:

```shell
yarn lint
```

CI runs both `yarn ci` (lint + Jest) and `yarn test:e2e` on pull requests.

## Developing

First, run the post-install script to create the local development environment file from the example environment file.

```shell
sh ./scripts/post-install.sh
```

To start the local development server, run the following from the root directory:

```shell
yarn dev
```

## GitHub Pages Demo

The demo app deploys to GitHub Pages at:

```text
https://aquia-inc.github.io/template-vite-react/
```

GitHub Pages must be configured in the repository settings with **Build and deployment** source set to **GitHub Actions**.

The CI/CD workflow deploys on every push to `main` after the existing lint, unit test, Playwright, build, and semantic-release steps complete. Pull requests keep the local `/` base path and do not deploy.

The Pages build uses these public environment values:

```shell
VITE_PUBLIC_BASE_PATH=/template-vite-react/
VITE_CF_DOMAIN=https://aquia-inc.github.io/template-vite-react/
VITE_IDP_ENABLED=false
```

Leave the Cognito environment values blank or unset for the public demo. The app treats missing or invalid Cognito settings as auth disabled, so the Pages demo does not expose a real user pool.

For project Pages, Vite builds assets under `/template-vite-react/` and React Router uses the matching basename. The workflow also copies `dist/index.html` to `dist/404.html` so direct visits to client-side routes can load the SPA fallback.
