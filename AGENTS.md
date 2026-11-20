# Repository working agreement

These instructions travel with the repository and apply to all work here. They do not require a particular editor, assistant, or locally installed skill. Follow the user's task scope; ask only when a material decision or authorization is missing.

## Before changing files

- Read [README](README.md) and the relevant sections of [Development](docs/DEVELOPMENT.md). Inspect the current branch, status, staged changes, and diff first.
- Preserve existing user work, including changes unrelated to the task. Do not reset, discard, or commit it without authorization.
- Work on a focused branch from current `main`; use `codex/<description>` for assistant-created branches. Do not develop directly on `main`.
- Keep changes proportional to the request. Preserve the game's visual direction, offline operation, accessibility, and existing player data.

## Implementation and content

- Follow [Architecture](docs/ARCHITECTURE.md): keep game rules deterministic, storage access in repositories/adapters, and rendering in screens/components.
- Preserve stable content identities, saved-game compatibility, profiles, history, and imports. Persistence changes need migrations and meaningful compatibility tests.
- Before authoring questions, read [QUESTION_BANK_SPEC](<ChatGPT Generated Files/QUESTION_BANK_SPEC.md>) in full, plus [Content Pipeline](docs/CONTENT_PIPELINE.md) and [Set Library](docs/SET_LIBRARY.md). These are the portable authoring standards; a missing personal skill is not a reason to skip them.
- Individual sets belong under `content/sets/<topic>/`, one complete 15-level game per file, with a meaningful in-game `folderPath`. Keep them separate from the Fresh Mix banks. Preserve IDs when moving files.
- Verify facts or puzzle solutions, record sources and editorial notes, and retain honest draft/review metadata. Follow [Question Media](docs/QUESTION_MEDIA.md) for image/video provenance, permissions, accessibility, and offline assets.
- Explicitly register changed sets with `npm run register:sets -- <relative-set-path>`, then run `npm run build:content`. Commit source, manifest, and generated outputs together. Never hand-edit `content/normalized/` or `src/content/generated/`, or modify the frozen `content/source/release-001/` archive.
- Never commit credentials, local backups, browser data, logs, build output, or temporary research files.

## Validation and change records

- For documentation-only changes, review accuracy, relative links, and `git diff --check`; application tests are unnecessary locally unless executable behavior or configuration changes too.
- For application changes, run type-checking, relevant focused tests, `npm test`, and `npm run build`. Run browser tests for navigation, media, persistence, PWA, or cross-tab changes. Add tests when they meaningfully protect behavior, not just to mirror a trivial edit.
- For question additions using existing schemas and features, follow [focused content checks](docs/TESTING.md#question-additions-focused-local-checks): fact-check every question, register and rebuild the catalog, run content validation and focused tests, verify existing content is preserved, and smoke-test the new sets. Do not routinely run the full local application suite. Source files, supported media assets, generated catalogs, docs, and count-only fixture updates fit this path; changes to application logic, schemas, validators, build tooling, dependencies, or CI require the relevant application checks.
- The [CI workflow](.github/workflows/validate.yml) runs the full `npm run validate` gate on PRs and pushes to `main`; require it to pass on the final PR head. Release candidates still require full local validation and the [release procedure](docs/RELEASING.md).
- Investigate local failures narrowly. Once evidence establishes an unrelated pre-existing or environment failure, record it and let CI assess the branch rather than repeatedly running broad local suites. Fix task-caused failures and resolve failures that prevent checking the new content; do not weaken assertions or timeouts to get a pass.
- Add a concise entry to [CHANGELOG](CHANGELOG.md) under **Unreleased** for material features, fixes, content additions, or workflow changes. Update affected guides in the same PR. Do not invent release dates or treat a merge as a published release.
- Git commits and PRs record repository changes; this file does not automatically monitor edits. Player scores, profiles, imports, and local folder moves belong to browser storage and in-app backups, not the changelog.

## Commits and pull requests

1. Review the final diff and explicitly stage only task files. Use focused commits with the existing `feat:`, `fix:`, `content:`, `docs:`, or `test:` style as appropriate.
2. Push the branch normally and open a PR against `main`. Describe the problem, resulting behavior, validation performed, and material limitations. Link related sources or notes when useful.
3. Check CI and review feedback for the current head. Fix actionable issues and resolve conflicts without losing either side's intended changes. Never force-push, bypass protections, or use admin merging.
4. If asked only to create a PR, leave it open and report its URL and check status. Merge only when explicitly authorized for that PR and its current changes. Use a merge commit unless repository policy or the user specifies otherwise, and verify GitHub reports it merged.
5. A merge does not rebuild a local server, publish a deployment, or activate a waiting service worker. Use [Releasing](docs/RELEASING.md) for those separate steps and report which actually completed.

Keep the final handoff brief: what changed, checks run, PR state, and any remaining limitations. Installed skills can assist this workflow, but machine-specific paths and tools are not prerequisites for contributors.
