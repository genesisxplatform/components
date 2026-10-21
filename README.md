# GX Components

Custom components for the GX platform editor (`cms-client`) and for published
customer websites rendered through `@gxpl/sdk`.

## Provenance

This package is a hard fork of [`@cntrl-site/components`](https://github.com/cntrl-site/components),
taken at **v1.0.93** (upstream commit `5d42e52`).

Full upstream history up to that commit is preserved in this repository, so
upstream fixes can still be cherry-picked:

```bash
git fetch upstream
git log --oneline 5d42e52..upstream/main   # what has landed upstream since the fork
git cherry-pick <sha>
```

The `upstream` remote is fetch-only — pushing to it is disabled on purpose.

### Why the fork, and why 1.0.93

Upstream commit `751196f` ("update url to assetId"), released in **1.0.97**,
renamed the asset field from `url` to `assetId` throughout component schemas and
their `assetsPaths` entries.

The GX platform resolves a component's assets by walking those `assetsPaths`
dot-paths into item params that are already stored in `gx-cms`
(`cms-server` and `code-export-server`, `ProjectAssetsManager.getComponentAssets`).
Stored params use the old shape — `gallery.media.url`, `image.url` — so against
1.0.97+ asset collection silently returns nothing and published sites lose their
images.

1.0.93 is the last release before that change, and the version both the platform
and `@gxpl/sdk` were already on. Forking here keeps the asset contract aligned
with stored data while letting GX iterate on components independently.

Anything cherry-picked from upstream at or after `751196f` must either be
rewritten to the `url` shape or paired with a `gx-cms` data migration.

### Versioning

This fork starts a fresh version line — the same approach taken when `@gxpl/sdk`
was forked from `@cntrl-site/sdk-nextjs`. Version numbers here are unrelated to
upstream's; **`@gxpl/components@1.0.1`** is upstream's `1.0.93` plus GX changes.

**Do not use `1.0.0` or `0.0.0-stage`.** Both are deprecated. `1.0.0` was
published from the wrong baseline (upstream `1.0.51`) and is missing five
components the editor offers — `marquee-text`, `mercury`, `helix`,
`basic-burger` and `pretext`. npm forbids republishing a version, so the first
good release is `1.0.1`.

### Known coupling

Component previews and default content still reference `https://cdn.cntrl.site/component-assets/*`.
These are served from CNTRL's CDN. Re-hosting them under a GX-controlled origin
is tracked as follow-up work.

## Development

```bash
npm ci
npm run dev     # vite dev playground
npm run build   # emits dist/
```
