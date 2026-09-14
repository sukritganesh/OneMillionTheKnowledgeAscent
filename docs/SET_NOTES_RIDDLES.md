# Riddle set editorial notes

Four new, independent 15-question ladders live in `content/sets/discovery/puzzles-and-games/riddles/`. In the game they share **Puzzles & Games / Riddles**. This is a browsing folder, not a twenty-first primary category. Logical puzzles use Sports and Games, numerical puzzles use Computation, and the opening object/word clues use their applicable existing categories.

## The four sets

- **Hidden in Plain Sight** starts with recognisable objects, moves through word transformations and letter constraints, then ends with a code describing its own digits.
- **The Midnight Detective** develops elimination into exact truth counts, a combination lock, public deductions about hats, and a consistent truth-teller assignment.
- **The Number Vault** uses small numbers and mental shortcuts: reversed digits, remainders, backwards payments, conditional switching and divisor parity.
- **The Rules of This Place** asks for guaranteed strategies and shortest solutions under explicit rules: jugs, river crossings, a bridge, fragile test objects, a checkerboard and single-batch identification.

All 60 questions are set-only; none enters Fresh Mix. Existing 870 question records, the 300-question pool, existing media and the frozen Release 001 are unchanged. Stable IDs describe each puzzle's concept rather than its position. This addition brings the active library to 42 sets, 630 curated questions and 930 questions total, with 62 at each ladder level.

## Fairness and scope

These are newly worded puzzles, not a claim to have invented familiar mechanisms such as the river crossing, bridge, switching chests or toggled locks. No riddle compilation was copied. The prompts include the rules needed to solve them; there is no hidden weather event, unmentioned relative, arbitrary number-sequence rule or assumed real-world loophole.

Important ambiguity checks:

- The self-describing code fixes its second digit at 2. Without that condition, 2020 would be another valid four-digit self-description.
- Safe-code clue counts are exact, digits are distinct, and a leading zero is expressly allowed. All 720 possible codes are checked, not just the four displayed choices.
- Hat-wearers know the hat inventory and reason perfectly; each hears earlier statements. Unused hats are not visible.
- In the switching-chests question, the informed keeper always opens an unchosen empty chest and always offers the switch. The offered switch is not conditional on whether the first choice was right.
- The jug problem defines a move, including the stopping condition for a pour. The bridge includes lamp returns and the slower walker's crossing time. The river problem permits travelling alone and specifies both forbidden unattended pairs.
- Fragile orbs are identical, unbroken orbs are reusable, and zero safe floors is a possible answer to the underlying experiment. The vial test has a perfect binary outcome, allows pooling and permits only one batch.
- The checkerboard question asks for the maximum number of dominoes, not merely whether a full tiling is possible. A construction attains the colour-count upper bound.
- Word puzzles specify English spelling, allowed operations and vowel definitions when relevant. They are intended to be read as well as narrated; letter-by-letter rules may be less comfortable with speech alone.

## Verification

`src/content/riddleSets.test.ts` reads the actual source packs and checks the authored answer references against independently computed solutions. It includes:

- Direct arithmetic, forward simulation of the snail and toll payments, digit counting, modular conditions and all 100 lock passes.
- Literal string reversal, anagrams, adjacency, alphabetical order, all one-letter BANANA moves, letter inventories and all candidate self-describing codes.
- Permutations of people, pets, keys and bags; truth tables for claims; exhaustive distinct-digit safe codes; information-state filtering for the hats; all sixteen witness-type assignments.
- Shortest-path searches over legal jug and river states and a weighted search over all legal bridge crossings.
- Drop-coverage recurrence for the two-orb problem, reachable coin states, maximum bipartite matching for the checkerboard, recursive perfect play for all smaller stone-pile positions, corridor search and binary identification patterns.

The computational checks validate the stated model and selected answer. They cannot automatically judge whether a riddle is enjoyable, whether a hint is perfectly pitched, or how quickly a player will spot its insight. The familiar opening object meanings were also read editorially; not every natural-language clue is a machine-proved proposition.

`e2e/riddles.spec.ts` finds all four sets through the actual folder browser, completes all 60 questions offline at 1280×720, reveals the hint on each set's longest prompt, measures stage/text bounds, and opens the completed 15-answer review. Existing unit and browser suites remain part of `npm run validate`.

## Limited external reference trail

Most answers follow entirely from premises supplied in the question or directly checked English spellings. The following references support the few external meanings used, not the originality of any riddle:

- [Piano Technicians Guild: piano parts](https://higherlogicdownload.s3.amazonaws.com/PTG/4712341a-15b0-41ac-8808-2332a49e0e5c/UploadedImages/teacher/Piano_Word_Search-2023.pdf): keys, strings and felt-covered hammers.
- [Collins: echo](https://www.collinsdictionary.com/us/dictionary/english/echo): reflected sound.
- [Merriam-Webster Scrabble dictionary: seabed](https://scrabble.merriam.com/finder/seabed): the sea-floor compound. BEDTIME is used in its ordinary English spelling.
- [Oxford Learner's Dictionaries: bookkeeper](https://www.oxfordlearnersdictionaries.com/us/definition/english/bookkeeper): spelling; the OO–KK–EE run is checked directly.

Reference snippets were consulted on 2026-09-13. Cambridge's pages rejected automated access, so they are not cited as verified references.

## Review status

All four packs are `assistant-reviewed-draft`, with `humanReviewRecommended: true` and no time-sensitive questions. Difficulty rises broadly from recognition and one-step elimination toward multiple constraints, invariants and strategy. Familiarity can make a classic puzzle much easier; final human difficulty calibration and play-testing are still recommended. These are not certified human-reviewed packs.
