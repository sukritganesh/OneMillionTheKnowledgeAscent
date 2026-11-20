# Changelog

Material changes to One Million: The Knowledge Ascent. Application releases use `vX.Y.Z` tags; the content library has its own version. A merge or local rebuild is not automatically a tagged release. Earlier entries below were reconstructed from repository history; they are a summary, not a claim that every change was deployed.

## Unreleased

Changes on `main` after `v1.0.0`, plus the repository procedure introduced with this file.

### Added

- Two standard-progression automobile sets, **Road Icons** and **Under the Hood**, under **Science & Technology / Automobiles**. Library v2.4.0 contains 48 curated sets and 1,020 questions overall; the 300-question Fresh Mix bank is unchanged. [Editorial and source notes](docs/SET_NOTES_AUTOMOBILES.md)
- Recorded local music and three supplemental geography sets, bringing the original library to 15 sets. [Commit 6b6c41a](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/commit/6b6c41a)
- A browsable folder library for individual 15-question sets, local folder placement, search, and 20 themed sets. [PR #3](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/3)
- Image/video questions with accessible descriptions, portable imports/exports, offline playback, and three sample sets. [PR #4](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/4)
- Four riddle sets under **Puzzles & Games / Riddles**, with source notes and solution checks. [PR #5](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/5)
- Four geography sets under **Geography / Regional Journeys**: Across Europe, Across the Americas, Africa in Focus, and Asia and the Pacific. The library now has 46 sets alongside the unchanged 300-question Fresh Mix bank. [PR #6](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/6)
- Full release validation in GitHub Actions for PRs and `main`. [PR #2](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/2)
- Portable [agent/contributor instructions](AGENTS.md), a [release and update guide](docs/RELEASING.md), and this changelog.

### Changed

- Refined the existing interface and player-facing copy across game screens. [PR #2](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/2)

### Fixed

- Modal input focus during rerenders. [Commit c209f49](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/commit/c209f49)
- Repeated narration on saved runs. [Commit 46be3f2](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/commit/46be3f2)
- Immutable content line endings on Windows. [PR #2](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/pull/2)

## 1.0.0

The original tagged implementation, ending at commit `02e11fc`. See the [v1.0.0 source](https://github.com/sukritganesh/OneMillionTheKnowledgeAscent/tree/v1.0.0) for the exact baseline.

- Offline-first, fifteen-question trivia game with lifelines, payouts, answer explanations, Fresh Mix, and curated sets.
- Local profiles, resumable games, history, statistics, custom-pack tools, and backup/restore.
- Accessibility settings, browser narration, procedural audio, and production PWA caching.
- Content validation and automated unit, component, repository, and browser tests.
