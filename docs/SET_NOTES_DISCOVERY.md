# Discovery, engineering and games: editorial notes

## Scope

Six new independent files contain 90 questions, with exactly one question at each level from 1 through 15 in every set. All questions have `freshMix: false`; the Fresh Mix bank is unchanged. Each file contains one self-contained curated set with reciprocal membership and stable concept-based IDs, independent of its filename or folder.

| Set | Source file under `content/sets/discovery/` | In-game folder |
| --- | --- | --- |
| Crossroads and Sea Routes | `history-and-discovery/exploration/crossroads-and-sea-routes.json` | History & Discovery / Exploration |
| Clues Beneath Our Feet | `history-and-discovery/archaeology/clues-beneath-our-feet.json` | History & Discovery / Archaeology |
| Built to Stand | `science-and-technology/engineering/built-to-stand.json` | Science & Technology / Engineering |
| Messages in Disguise | `science-and-technology/communication/messages-in-disguise.json` | Science & Technology / Communication |
| Across the Table | `puzzles-and-games/board-games/across-the-table.json` | Puzzles & Games / Board Games |
| Small Numbers, Big Ideas | `puzzles-and-games/numbers/small-numbers-big-ideas.json` | Puzzles & Games / Numbers |

Pack IDs, set IDs and question IDs begin `builtin-library-` followed by the distinct topic (`trade-routes`, `archaeology`, `engineering`, `codes`, `tabletop-games`, `mental-maths`). None of these files edits the hash-protected Release 001 payloads.

## Authoring and factual review

Read and followed `ChatGPT Generated Files/QUESTION_BANK_SPEC.md`, `docs/CONTENT_PIPELINE.md` and `docs/GEOGRAPHY_CONTENT_NOTES.md`. Existing prompts in the relevant categories were inspected to avoid repeating their core questions. Each new question includes source and verification notes. All material remains `assistant-reviewed-draft`, authored by OpenAI, with human review recommended; automated schema validation does not certify factual correctness or difficulty.

References were consulted during authoring, not merely attached afterward. Examples include:

- [UNESCO Silk Roads](https://www.unesco.org/en/silk-roads/about-silk-roads?hub=196704), [Berkeley's Ibn Battuta account](https://orias.berkeley.edu/node/177), [Smithsonian Sogdian scholarship](https://sogdians.si.edu/sidebars/sogdian-metalworking/) and the [University of Washington's Periplus text](https://depts.washington.edu/silkroad/texts/periplus/periplus.html).
- Museum and research explanations of [cuneiform](https://www.britishmuseum.org/blog/how-write-cuneiform), [lost-wax casting](https://www.getty.edu/publications/bronze-guidelines/vocabulary/lost-wax-casting/), [archaeomagnetic dating](https://archeox.conted.ox.ac.uk/www.archeox.net/fact-sheets/chronology/dating-methods/archaeomagnetic-dating.html) and the [marine radiocarbon reservoir effect](https://www.radiocarbon.com/marine-reservoir-effect.htm).
- Engineering textbooks, government publications and operator documentation, including [OpenStax hydraulics](https://openstax.org/books/university-physics-volume-1/pages/14-3-pascals-principle-and-hydraulics) and [structural determinacy](https://eng.libretexts.org/Bookshelves/Civil_Engineering/Structural_Analysis_(Udoeyo)/01:_Chapters/1.03:_Equilibrium_Structures_Support_Reactions_Determinacy_and_Stability_of_Beams_and_Frames).
- [RFC 20](https://www.rfc-editor.org/rfc/rfc20.html), [NIST Hamming distance](https://xlinux.nist.gov/dads/HTML/HammingDistance.html), and university lecture material on compression, error correction and reused one-time pads.

All 15 maths questions are original derivations, so their source notes explicitly say so instead of inventing citations. Arithmetic and probability answers were independently recomputed. The 4-letter envelope question was checked by enumerating all 24 permutations (9 derangements), as well as by inclusion-exclusion. The expected wait for two consecutive heads was checked both by solving the two-state equations and by summing survival probabilities from an independent state recurrence (6 tosses). Hamming distance, prefix-code collisions, short-bit-string counts, beam-load scaling and hydraulic force ratios were also independently verified.

## Scope-sensitive facts

- Board-game prompts identify classic rules or named editions; they do not use informal house rules. CATAN uses the 2020 base-game rulebook; Scrabble uses the classic English-language game; chess rules are explicitly anchored to the 2023 FIDE Laws where the distinction matters. Go's ko question is scoped to simple ko, not superko. Standard backgammon scoring excludes optional scoring variants such as Jacoby.
- Monopoly's hotel prerequisite applies to every property in the colour group, not just the property receiving the hotel. CATAN discard rounding and the distinction between resource and development cards were checked. Pandemic specifies an unprevented infection and cubes of one colour.
- Archaeological stratigraphy is explicitly undisturbed. Radiocarbon questions avoid claiming an exact universal marine correction. Plimpton 322 is not presented as definitively the first trigonometric table; its precise purpose remains debated.
- Engineering questions state idealised assumptions where needed. The parabolic-cable question specifies loading per horizontal distance and neglects cable weight, distinguishing it from a self-weight catenary.
- The westward-circumnavigation question excludes a date-line adjustment. Its sign was checked independently: one fewer local solar day means the crew's calendar is one day behind.
- One-time-pad reuse leaks the XOR of plaintexts; it is not claimed to reveal both individual plaintexts automatically.

## Difficulty and hints

The lower levels build from familiar objects and one-step reasoning. The upper levels use archaeological interpretation, mechanical compatibility, coding bounds, conditional probability and expected waiting times. Hints are written for each question, without answer letters or dependence on shuffled order.

An additional peer review flagged three trade-history hints/distractor sets. The repeated Sogdian introductory question was replaced with the sourced Ibn Battuta/Rihla question; the embassy distractors were made historically closer; the Periplus hint no longer lists regions that directly identify its answer. Further player-based calibration, particularly of specialist Levels 11–15, is still recommended.

## Validation

All six files passed the project's `validateContentPack` with built-in origin, with zero errors. Each has one set, 15 questions, ordered levels 1–15, four distinct choices and one valid answer per question. Registration into the explicit library manifest and full-catalog/build tests are performed by the parent implementation task after these source files are stable.
