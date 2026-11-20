# Releasing and updating the game

Use [AGENTS.md](../AGENTS.md) for the branch/PR workflow and [Development](DEVELOPMENT.md) for local commands. A merged PR, a versioned release, and an updated running game are separate events. The repository's [GitHub Actions workflow](../.github/workflows/validate.yml) validates changes; it does not publish builds or create releases.

## Versions and release notes

| Record | Meaning and update rule |
| --- | --- |
| `package.json` and `package-lock.json` version | Application release version. Keep both in sync when preparing a versioned release. |
| Git tag `vX.Y.Z` | Exact application release commit. Never move or reuse a published tag. |
| `content/sets/manifest.json` version | Active content library version, independent of the application version. Update for intentional library revisions and regenerate derived catalogs. |
| Pack and persistence schema versions | Compatibility contracts, not release counters. Change only with the corresponding validation/migration work. |
| [CHANGELOG.md](../CHANGELOG.md) | Human-readable changes. Accumulate entries under Unreleased until an actual versioned release. |

At the time this guide was added, the application version and latest tag were `1.0.0` / `v1.0.0`, while the active content library was `2.3.0`. These numbers need not match. Frozen Release 001 content has its own historical metadata and must not be rewritten for a new application release.

For application releases, use a patch increment for compatible fixes, minor for compatible features/content, and major for breaking changes. A documentation-only PR does not need a version bump or tag. An intentional deployment between tagged releases can use a verified commit; record that SHA and leave its notes under Unreleased.

## Prepare a release PR

1. Start a focused branch from current `main`, inspect the changes since the last tag, and choose the intended scope/version. Follow the ordinary PR procedure; do not mix unrelated local edits into the release.
2. Update the application version and lockfile together, for example `npm version 1.1.0 --no-git-tag-version` for a planned 1.1.0 release. The number is an example, not the next predetermined release.
3. Move the relevant Unreleased notes into a section for that version, leaving an empty Unreleased section. Use the actual publication date when known; do not guess a future date. Include compatibility notes and any backup or migration steps.
4. If content changed, follow [Set Library](SET_LIBRARY.md), regenerate the catalog, and review the source/manifest/generated diff. Verify authoring notes and asset provenance under [Question Media](QUESTION_MEDIA.md).
5. From the repository root, run the release gate:

```powershell
npm ci
npx playwright install chromium
npm run validate
```

On Linux, install browser system dependencies with `npx playwright install --with-deps chromium`. Playwright defaults to port 4173; if another service uses it, select a free port with `PLAYWRIGHT_PORT` (for example, `$env:PLAYWRIGHT_PORT = '4184'` in PowerShell before running validation). Do not stop unrelated servers or test against an unrelated existing preview. See [Testing](TESTING.md) for the test layers and recovery checks.

6. Exercise the production build and upgrade path below. Record the commands, results, and any unresolved limitations in the PR. Wait for CI and review feedback on the final head, then merge with authorization.

## Publish a versioned release

After the release PR is merged and publication is authorized:

1. Fetch and fast-forward local `main` to the intended remote commit, with a clean release checkout. Verify its version, changelog, and successful validation. If newer unrelated work has landed, identify the intended release commit explicitly.
2. Create an annotated `vX.Y.Z` tag on that verified commit, push that tag, and create the GitHub release using the corresponding changelog notes. Tagging and publishing are deliberate actions, not side effects of building.
3. Build the same commit and publish its `dist/` directory to the intended static host. Record the commit/tag, destination URL, and verification results in the GitHub release or PR. Do not commit `dist/`. This repo does not currently prescribe a hosting provider or automated deployment pipeline.

For an untagged update, build the requested verified commit and record its SHA and destination in the PR without inventing a release/tag. Verify the actual served game after deployment; a successful build alone does not prove the host or browser has updated.

## Run or update a local production game

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

This serves the production build locally; it is not a public deployment. Vite's development server (`npm run dev`, normally port 5173) intentionally does not register the service worker and is unsuitable for offline release verification.

Use the **same origin as the player's existing production game** when updating it. If it already runs at `http://127.0.0.1:5173`, use `--port 5173` for its replacement production preview. Scheme, hostname, and port all matter: `localhost`, `127.0.0.1`, or a new port have separate browser storage. Prefer separate origins for development and regular play. Replace only the game's own server after identifying it; `--strictPort` prevents silently switching to another port.

## Verify an update, including an existing installation

1. Before testing an upgrade, export a full backup from **Settings & Data**. Keep it outside Git. Use a separate test browser profile for destructive experiments.
2. Load the updated production URL online. Allow the service worker to download the new build. On an existing installation, use **Settings → Apply Update** when offered, from a safe non-game screen; then let the app reload. Rebuilding, merging, or refreshing alone may leave the old cached game active.
3. Check the intended changes. For new sets, verify their names, folder placement, and expected manifest count in **Set library** / **Choose a Set**. Confirm existing profiles, history, imported packs, folder moves, and a saved game's resume still work. A fresh browser load alone does not test migration from the previous build.
4. Once offline readiness is reported, disconnect the browser from the network and reload. Play representative questions, including images/video if affected, and check audio and keyboard controls. Reconnect after testing.
5. Record the tested URL, build commit, and fresh-install/upgrade/offline results. Do not report a deployment or upgrade as verified unless it was actually observed.

Do not clear IndexedDB or reset local data to make an update appear. Cache updates should preserve player data. If no update is offered, check which server/build is being served and the service-worker status before changing storage; see [Troubleshooting](TROUBLESHOOTING.md).

## Recovery

Keep the previous known-good build/tag and release notes available. If an update fails, stop promotion and inspect the failure before replacing the served build. Roll back application files only when the older code can read the current database and saved-game formats; migrations can make an automatic downgrade unsafe. Prefer a forward fix when compatibility is uncertain. Restore an exported backup only as a deliberate player-approved recovery step, since it replaces local data. Record the correction in the changelog and use a new tag for any replacement release.
