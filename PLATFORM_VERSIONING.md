# Platform package versioning

Fifteen packages in `packages/*` form the public contract that standalone plugin repos (e.g.
`inithium-blog-plugin`, `inithium-friends-plugin`) build against: `types`, `models`, `db`, `validators`,
`auth`, `file-manager`, `services`, `store`, `presence`, `pubsub`, `notifications`, `ui`, `pages`,
`crud-engine`, `plugin-engine`. They're published to public npm and versioned independently (no
lockstep/fixed group) via [changesets](https://github.com/changesets/changesets), tracked against each
other through real `dependencies`/`peerDependencies` semver ranges rather than the workspace symlink.

Everything else in `apps/*` and `packages/*` (e.g. `collections`, `routes`, `collection-generator`,
`analytics`, `cms-pages`, `error-capture`) stays `private: true` and is listed in `.changeset/config.json`'s
`ignore` array — it's core-app-only and never installed by a plugin. Notably, `@inithium/services`'
`collection-definition.service.ts` was relocated into `@inithium/collection-generator` specifically to
keep it out of the publishable graph: it wraps `collection-generator`'s disk-scaffolding logic, which has
no business being reachable from a plugin's dependency tree just because `@inithium/store` has a
type-only import of `SanitizedUser`. Watch for this pattern going forward — if a new export added to any
of the 15 platform packages pulls in something from the private/ignored set, it likely needs the same
treatment (relocate the offending export) rather than expanding the publish boundary to cover it.

## Cutting a release

After changing any of the 13 packages, run `npx changeset add` from the repo root, pick the affected
package(s), pick a bump type, and describe the change. Commit the generated `.changeset/*.md` file with
your PR. On merge to `main`, the `Release` GitHub Action opens (or updates) a "Version Packages" PR that
bumps versions and updates changelogs; merging that PR builds and publishes the changed packages.

Requires an `NPM_TOKEN` repo secret with publish rights to the `@inithium` npm org — add it under repo
Settings → Secrets → Actions. Without it, publish the same way manually: `npx nx run-many -t build
--projects=<changed packages>` then `npx changeset version && npx changeset publish` from a machine
authenticated to npm.

## What counts as a breaking change

A **major** bump is required for anything a plugin repo could be relying on:

- Any change to `PluginServerContext` or `PluginClientModule`'s shape (`packages/plugin-engine/src/lib/contracts`)
- Removing or changing the signature of any exported function (`ctx.notifications.notify(...)`,
  `createRepository`, `createCrudRouter`, etc.)
- Changing the props of any exported `@inithium/ui` component a plugin might render
- Renaming or removing an exported type from `@inithium/types`/`@inithium/models`

Additive changes (new optional field, new export, new component) are **minor**. Internal refactors with
no change to any exported surface are **patch**.

## Plugin repos and version ranges

Plugin `package.json`s declare `peerDependencies` on these packages using `">=x.y.z"` ranges (see
`inithium-friends-plugin`'s `package.json` for the convention) rather than pinning exact versions — a
plugin should keep working across patch/minor platform releases and only need a version bump of its own
peer range when a platform package cuts a major.
