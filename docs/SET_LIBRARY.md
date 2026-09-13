# The 15-question set library

The library organizes complete, fixed Level 1–15 games. It does not reorganize the larger Fresh Mix question banks. The active catalog has 38 sets: the original 15, 20 themed additions and three image/video sets, alongside the unchanged 300-question pool. See [Question Media](QUESTION_MEDIA.md) for attachment authoring, sources and offline behaviour.

## Playing and organizing

Open **Set library** from the main menu, or **Choose a set** when starting a game. Both use the same folders, breadcrumbs, search and All sets view. Search matches titles, descriptions, themes, tags and folder labels across the entire library. Folder counts include descendants.

Use **Move** on a set in the library to choose a slash-separated destination, such as `My sets / Friday night`. Existing folder paths are suggested; typing a new path creates it implicitly. Blank means Unfiled. Empty folders disappear because folders are derived from their sets, not independent records. Moving changes only the placement—not the set ID, question order, attempts, best result or paused run.

Placements are local to this installation and shared by its profiles, like imported content. They live in the existing metadata store under `setLibrary.v1`, keyed by stable set ID. Full backups preserve them. Moving a built-in set does not edit repository files. Imported-pack exports and duplicates carry the current folder choices. Disabling/removing a custom pack hides its sets; it does not erase placement metadata or historical runs. Reimporting the same identity can therefore restore its placement.

The import screen can apply a destination to every curated set in a pack without changing its questions or banks. Leave the field blank to preserve folders in the file; older files without folders appear in Unfiled. The manual editor also offers a destination when its optional 15-level set is available.

## Repository layout and identity

`content/sets/` is the canonical editable library. Every JSON file is a schema `1.0.0` `curated-sets` pack containing exactly one set and its 15 questions. Topic directories organize the files; the set's optional `folderPath` controls human-readable in-game labels. These are deliberately separate from primary question categories and stable IDs.

For example, `content/sets/science/spaceflight/leaving-earth.json` has folder labels `Science & Nature / Spaceflight`. A mixed-topic set can have one browsing home while its questions retain different controlled primary categories. Do not derive IDs from paths or change IDs during a move.

`content/sets/manifest.json` pins the relative path, stable pack ID and exact SHA-256 of each included file. The build checks the directory recursively but never silently adds files or accepts modified hashes. It rejects missing/unlisted files, symlinks, invalid paths, duplicate IDs, duplicate prompts, broken memberships and incomplete ladders.

The frozen archive at `content/source/release-001/` is still verified on every build. Its original 15 sets were copied into individual library files with their original set IDs, question IDs, ordering and gameplay content. Only their enclosing pack identity and browsing metadata changed. The build compares the migration against the archive, while historical saved games keep their own question/provenance snapshots. The active catalog includes the pool and library, not duplicate copies of archived curated questions.

## Adding a set

1. Read `ChatGPT Generated Files/QUESTION_BANK_SPEC.md` in full, plus the schema and review rules in [Content Pipeline](CONTENT_PIPELINE.md). Use the controlled `PRIMARY_CATEGORIES` list; browsing labels do not expand it.
2. Create one file under a suitable topic directory. Use unique concept-based pack, set and question IDs. Include exactly 15 questions with ordered levels 1–15, four distinct stable-ID choices, one correct answer, a useful non-leaking hint and a concise explanation. Set every question's `usage.freshMix` to `false` and its reciprocal `usage.setIds` to this set's ID.
3. Include valid nonempty `folderPath` on built-in sets. Each label is 1–80 trimmed characters, with at most six levels. Labels cannot contain slashes, backslashes, control characters or angle brackets; dot/parent and prototype-property names are rejected. JSON imports may omit the field or use `[]` for Unfiled. This optional additive field remains compatible with schema 1.0.0.
4. Follow the prescribed difficulty ramp. Verify facts against suitable primary references and independently check calculations. Add question-level source/verification notes and a short editorial review document. Use honest metadata: assistant-authored work remains `assistant-reviewed-draft`, with `humanReviewRecommended: true`. Structural tests do not certify factual accuracy or player-calibrated difficulty.
5. Explicitly register the new file, review the manifest diff, then rebuild and validate:

```powershell
npm run register:sets -- science/spaceflight/leaving-earth.json
npm run build:content
npm run validate
```

Pass several relative paths to register several intentional additions/edits. To move a file, move it within `content/sets/`, preserve its IDs, and explicitly register its new path; the old manifest entry for the same pack ID is replaced. Update `folderPath` too only when changing the in-game home. Registration checks that unrelated registered files still match their pinned identities/hashes—it does not silently bless other edits.

Generated outputs live under `content/normalized/library/` and `src/content/generated/`. Commit them with their source and manifest changes. Do not hand-edit generated JSON or alter the archived Release 001 payloads to add new sets.

## The 20 new sets

- Science & nature: Reading the Sky; Written in Stone; Chemistry Close to Home; Light and Sound; Built to Survive; The Secret Life of Plants; Leaving Earth.
- Arts & culture: Built to Last; How Music Works; Behind the Screen; The Curious Kitchen; Tales Across the World; Between the Lines; Signs, Sounds and Scripts.
- History, technology & games: Crossroads and Sea Routes; Clues Beneath Our Feet; Built to Stand; Messages in Disguise; Across the Table; Small Numbers, Big Ideas.

Source trails, scoped rules and editorial caveats are in [Science notes](SET_NOTES_SCIENCE.md), [Culture notes](SET_NOTES_CULTURE.md) and [Discovery notes](SET_NOTES_DISCOVERY.md). Peer review tightened answer-leaking hints and overlapping questions. Human factual review and difficulty play-testing are still recommended.
