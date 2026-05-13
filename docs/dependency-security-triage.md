# Dependency And Security Triage

This note captures the current dependency/security surface on `origin/main` as
of 2026-05-13 at commit `4616531`.

## Commands Run

```shell
mise exec node@24 -- yarn install --immutable
mise exec node@24 -- yarn npm audit --recursive --severity moderate --json
mise exec node@24 -- yarn outdated --json
mise exec node@24 -- yarn why node-gyp
mise exec node@24 -- yarn why tar
mise exec node@24 -- yarn why minimatch
mise exec node@24 -- yarn why glob
mise exec node@24 -- yarn why ajv
mise exec node@24 -- yarn why @types/testing-library__jest-dom
mise exec node@24 -- yarn why @types/uuid
mise exec node@24 -- yarn why filelist
mise exec node@24 -- yarn why whatwg-encoding
```

## Summary

- `yarn install --immutable` succeeds with existing peer warnings.
- `yarn outdated --json` reports only `@types/node`: current `24.12.4`, latest
  `25.7.0`.
- `yarn npm audit --recursive --severity moderate --json` reports direct stub
  type package deprecations plus transitive tooling advisories/deprecations.

## Recommended Follow-Up PRs

### Actionable

1. Remove direct stub type packages:
   - `@types/testing-library__jest-dom@6.0.0` is a deprecated stub because
     `@testing-library/jest-dom` ships its own types.
   - `@types/uuid@11.0.0` is a deprecated stub because `uuid` ships its own
     types.
   - Validate with `yarn install --immutable`, `yarn lint`, `yarn test`, and
     `yarn build`.

2. Track or update the commitlint AJV path:
   - audit reports `ajv@8.12.0` through
     `@commitlint/config-validator@21.0.1`.
   - This should be handled by a focused commitlint/tooling PR when an upstream
     package update removes the affected AJV version, or by an explicitly tested
     Yarn resolution if maintainers accept that tradeoff.

3. Review native-build tooling transitive dependencies:
   - audit reports `tar@6.2.1`, `npmlog@6.0.2`, `gauge@4.0.4`,
     `are-we-there-yet@3.0.1`, and `rimraf@3.0.2` through `node-gyp@9.4.0`.
   - `yarn why node-gyp` shows `node-gyp@9.4.0` coming from optional/native
     tooling paths including `@parcel/watcher`, `fsevents`, and `node-addon-api`.
   - Treat this as a tooling-chain follow-up, not an application runtime issue.

### Upstream Or Unavoidable For Now

1. Keep `@types/node` on the Node 24 line:
   - `yarn outdated --json` reports latest `@types/node@25.7.0`, but the repo
     runtime is Node 24 in `.nvmrc`, `package.json`, and CI.
   - Do not move to Node 25 typings until the runtime pin changes.

2. Track Jest/jsdom transitive deprecations:
   - `glob@10.5.0` is pulled by Jest 30 packages, including `@jest/reporters`,
     `jest-config`, and `jest-runtime`.
   - `whatwg-encoding@3.1.1` is pulled through `jsdom@26.1.0`.
   - Avoid broad overrides unless Jest/jsdom validation is isolated and complete.

3. Track `minimatch` through transitive tooling:
   - vulnerable `minimatch@5.1.6` is pulled through `filelist@1.0.4`.
   - vulnerable `minimatch@9.0.5` is pulled through `glob@10.5.0`.
   - non-vulnerable `minimatch@10.2.5` is already present through newer ESLint,
     npm, TypeScript ESLint, and related tooling.

## Rollback Notes

Dependency/security follow-ups should be split by ownership area. Avoid bundling
stub type removal, commitlint/AJV changes, native build chain updates, and
Jest/jsdom overrides into one PR. If a follow-up causes validation failures,
revert only that focused PR and leave docs and unrelated dependency updates in
place.
