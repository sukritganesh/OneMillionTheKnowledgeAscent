# Testing Guide

## Testing model

The suite separates fast deterministic rules from browser integration:

| Layer | Tool/environment | Current focus |
| --- | --- | --- |
| Pure domain | Vitest | Ladder/payout rules, seeded shuffling and selection, reducer legality and invariants |
| Content | Vitest | Built-in catalog integrity, normalization repairs, import validation and transactional staging |
| Persistence integration | Vitest + `fake-indexeddb` | Migrations, repositories, ownership, stale writes, terminal idempotency, backups and profile transfer |
| Component interaction | React Testing Library + jsdom | Gameplay keyboard/dialog/state behavior and Content Manager workflows |
| Audio unit | Vitest | Procedural registry completeness and bounded channel values |
| Browser workflow | Playwright Chromium | Full game paths, refresh/resume, offline PWA, Back, multi-tab takeover, imports and save replacement |

Test counts are intentionally not documented as a quality target; use command output as the current record. Add tests for unique risks and regressions rather than duplicating cases to inflate a number.

## Commands

```powershell
# Strict TypeScript
npm run typecheck

# All Vitest tests once
npm test

# Watch mode
npm run test:watch

# V8 coverage: terminal summary plus coverage/index.html
npm run test:coverage

# Production Chromium workflows; builds first
npm run test:e2e

# Full CI/release validation chain (also available locally)
npm run validate
```

`npm run test:unit` currently invokes Vitest and excludes an `e2e/**` pattern; browser tests are already outside Vitest's configured `src/**/*.test.{ts,tsx}` include.

Focused examples:

```powershell
npx vitest run src/game/gameReducer.test.ts
npx vitest run src/data/data.test.ts
npx vitest run src/screens/GameplayScreen.test.tsx
npx playwright test -g "multi-tab takeover"
```

## Question additions: focused local checks

Use this path for additions through existing question schemas and game features: question files, their manifest and generated catalogs, supported image/video assets, editorial docs, and count-only test-fixture updates. If the task also changes application logic, schemas, validators, build tooling, dependencies, or CI configuration, follow the relevant [application workflow](DEVELOPMENT.md#recommended-workflow) as well. A versioned release still follows [Releasing](RELEASING.md).

1. **Review every question.** Read the [question specification](<../ChatGPT Generated Files/QUESTION_BANK_SPEC.md>) and [Set Library](SET_LIBRARY.md). Verify facts against suitable primary references, independently solve calculations and puzzles, check that exactly one answer is correct, and review distractors, hints, explanations, overlap, and the difficulty progression. Record sources and scope; retain `assistant-reviewed-draft` and `humanReviewRecommended: true`. Faster testing does not replace factual or editorial review.
2. **Register, regenerate, and validate content.** Follow the explicit registration procedure in Set Library, run `npm run build:content`, then `npm run validate:content`. Review the manifest hashes and generated report for expected totals, complete ladders, valid membership, unique IDs/prompts, and understood warnings. Never hand-edit generated files.
3. **Run focused tests.** After updating expected catalog totals where needed, run `npx vitest run src/content/content.test.ts`. Run any additional directly affected assertions; for example, a Content Manager count update needs its coverage test, not every manual-editor interaction. There is no requirement to add a duplicate structural test for each pack.
4. **Check preservation and the diff.** For additive sets, compare existing normalized question/set records with the base branch: their identities, content, and Fresh Mix membership must remain unchanged. Inspect the diff for unintended source/assets changes and run `git diff --check`. Commit the source, manifest, and reproducible outputs together.
5. **Smoke-test the additions.** Browse the intended folders and start each new set. Inspect representative questions, especially the longest prompts, choices, and hints, at the supported 1280×720 size; check answer reveal. A development server is sufficient for text-only additions. Full 15-question playthroughs are optional unless the content presents a specific risk that requires them. For new media, verify each new asset's rendering/playback, descriptions and credits, and use one production build for targeted offline checks. Avoid retesting every existing set or unrelated feature locally.
6. **Push and let CI run the full suite.** Record the focused local checks and any limitations in the PR. Wait for `Release validation` on the final head and address failures/review feedback. Do not run `npm test`, `npm run test:e2e`, or `npm run validate` locally as a routine extra gate for question-only additions. A full local suite remains available when a concrete failure or broader change justifies it.

For a count-only change in the Content Manager fixture, this focused command selects the relevant test:

```powershell
npx vitest run src/screens/ContentManagerScreen.test.tsx -t "shows built-in coverage"
```

### Local failure triage

Inspect the failed assertion and use a focused rerun or a baseline comparison when it will distinguish a regression from an existing/environment issue. Once that distinction is established, avoid repeated broad reruns and unrelated repairs during content work. Record the failing command, evidence, and CI result separately; never report a failed local command as passing because CI passed. Preserve useful traces. Do not weaken assertions, disable tests, or increase timeouts just to obtain a pass.

Fix task-caused failures. If a failure might affect the new content, prevents its targeted verification, or occurs in CI, investigate before reporting the PR ready. CI success does not excuse a known question defect or a blocked check of the additions.

## Vitest configuration

Vitest runs in jsdom. `src/tests/setup.ts` installs jest-dom matchers, `fake-indexeddb`, and a `matchMedia` test double. Tests must clean up mounted React trees and must not rely on execution order.

Randomized behavior should use explicit seeds. Time-sensitive code should use injected clocks or explicit `nowMs` values where possible. Persistence tests use unique database names and close/delete them after each case.

Production question wording should not be used to prove core rules. Domain tests use small purpose-built fixtures; built-in-content tests separately validate the real generated release.

## Coverage boundaries

Set-library regressions cover nested navigation, breadcrumbs, global search, legacy Unfiled placement, validation of folder labels, and identity-preserving import overrides. Persistence tests exercise moves and backup/restore without a database schema upgrade. Browser tests move a set with a paused run, refresh/resume it, verify retained progress, and import/export a folder-organized set. Content validation also enforces frozen archive hashes, original set/question identity and ordering, unique active prompts, and explicit registration of every library JSON file.

`npm run test:coverage` uses V8 and currently includes:

- `src/game/**/*.ts`
- `src/content/**/*.ts`
- `src/data/**/*.ts`

The configured report formats are terminal text and HTML. Application orchestration, screens, audio, and PWA code are not currently part of the coverage percentage even though some have direct tests or Playwright coverage. Do not interpret the reported percentage as whole-application coverage.

No repository-wide numeric threshold is configured. Critical pure branches—reducer transitions, payouts, selection, validation, migration, stale-write protection, and terminal commits—should be tested exhaustively regardless of the aggregate number.

## Existing Vitest risk coverage

The source test files currently cover:

- Every prize level and checkpoint boundary.
- Selection/deselection, confirmation, committed lock immutability, reveals, advancement, and all terminal outcomes.
- Hint and absolute-deadline Phone behavior, including Pause/Help consequences.
- Fresh Mix priority, curated ordering, answer-shuffle stability, and Surprise Me priority.
- Built-in release totals, level/set coverage, documented repairs, unsafe markup, malformed imports, and atomic import staging.
- Profile limits/deletion, save ownership, revisions, controller epochs/leases, idempotent history, imported-pack transactions, migrations, backup restore, and profile identity rewriting.
- Gameplay keyboard, non-color answer labels, dialogs, controller read-only state, lifeline presentation, and narration callbacks.
- Content Manager validation, import, authoring, filter/toggle, and download callbacks.

When a defect is found, first reproduce it with the smallest test at the lowest useful layer, then fix it and run the broader affected suite.

## Playwright setup

Install Chromium after `npm ci`:

```powershell
npx playwright install chromium
```

The Playwright configuration:

- Uses `e2e/` as its test directory.
- Runs one Chromium desktop project at 1440×900.
- Starts `npm run preview -- --strictPort` on `127.0.0.1:4173`.
- Runs tests within a file sequentially (`fullyParallel: false`); different files may use concurrent workers. Use `--workers=1` for a focused diagnostic rerun when browser contention is suspected.
- Uses no local retries and two retries when `CI` is set.
- Keeps traces and screenshots on failure and writes an HTML report.

`npm run test:e2e` runs a production build first. This matters because the service worker is disabled in development and the E2E module reads the generated catalog.

For Playwright UI mode, build first so `dist` exists and is current:

```powershell
npm run build
npm run test:e2e:ui
```

If another project owns port 4173, choose a free `PLAYWRIGHT_PORT` (for example, `$env:PLAYWRIGHT_PORT = '4184'` in PowerShell). Do not stop unrelated servers. The strict-port preview should fail rather than silently test a different port.

## Browser scenarios

The current `e2e/app.spec.ts` defines workflows for:

- Named-profile creation, both lifelines, selected-answer refresh, and exact resume.
- A full 15-answer millionaire run and run review.
- Production service-worker offline relaunch and absence of external gameplay requests.
- Browser Back opening Pause, then a wrong-answer result.
- Custom-pack validation/import and library visibility.
- Explicit multi-tab takeover and stale-controller read-only behavior.
- Walk-away before lock-in.
- Cross-profile replacement of the one global save.

These scenarios depend on a clean browser context per Playwright test. When diagnosing failures locally, do not reuse a manually contaminated profile as evidence.

## Accessibility and visual checks

Component tests verify core keyboard and semantic behavior, but there is no automated axe scan or pixel-diff visual-regression project configured. Manual release checks should include:

- Complete mouse-free gameplay.
- Visible focus and modal focus restoration.
- 1280×720, 1366×768, 1600×900, and 1920×1080 stage checks.
- Browser zoom, long question/answer wrapping, reduced motion, reduced glow, and increased contrast.
- Correct/incorrect/selected/locked meaning without relying on color.
- Muted play and unavailable speech synthesis.

Firefox and WebKit projects are not currently configured as release-blocking Playwright targets. Chromium is the automated browser target in this repository.

## Offline and service-worker testing

Do not validate offline behavior against `npm run dev`. Build and preview first. A meaningful offline check should:

1. Load online and wait for `navigator.serviceWorker.ready`.
2. Reload once so the page is controlled.
3. Take the browser context offline.
4. Reload and verify the title/profile flow still renders.
5. Confirm no external request is required for gameplay.

If the app has not yet been controlled by a service worker, `navigator.onLine === false` alone does not prove offline readiness.

## Validation and reports

`npm run validate` is the full CI and release gate. Routine question additions use the focused local checks above; they do not need to duplicate the full suite locally. The aggregate command includes a production build through `test:e2e` so browser tests exercise the built artifact.

Do not record a command as passing unless it was run in the current environment. Preserve Playwright traces/screenshots and the failing seed or fixture when reporting a defect.

The `Validate` GitHub Actions workflow runs the same aggregate gate on pull requests and pushes to `main`. It uses the Node.js version in `.nvmrc`, installs dependencies from the lockfile, and installs Chromium with its system dependencies on Ubuntu 24.04. Failed browser-test reports and traces are retained as artifacts for seven days. The workflow can also be started manually.
