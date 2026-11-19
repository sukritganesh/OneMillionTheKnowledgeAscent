# Regional Journeys: geography authoring notes

## Scope and organization

Library v2.3.0 adds four independent 15-question games under **Geography / Regional Journeys**. Their editable files are in `content/sets/geography/regional-journeys/`; each file has its own stable pack and set IDs. All 60 questions use the existing `Geography` category and `usage.freshMix: false`. No question bank or archived Release 001 payload is changed.

| Set | File | Range | Countries-and-capitals question |
| --- | --- | --- | --- |
| Across Europe | `across-europe.json` | Cities, fjords, lakes, Baltic coasts and geodesy | Level 3: Lisbon / Portugal |
| Across the Americas | `across-the-americas.json` | Mountain parks, islands, wetlands and connected drainage systems | Level 3: Lima / Peru |
| Africa in Focus | `africa-in-focus.json` | Desert landscapes, landmarks, inland deltas and lake drainage | Level 3: Accra / Ghana |
| Asia and the Pacific | `asia-and-the-pacific.json` | Pacific coasts, island chains, seasonal rivers and paleogeography | Level 3: Wellington / New Zealand |

Each set has exactly one `capitals`-tagged question, following the pattern of the earlier geography supplement. The older supplement's requirements are not a new global category rule.

## Authoring and review

The applicable repository instructions are `ChatGPT Generated Files/QUESTION_BANK_SPEC.md`, `docs/CONTENT_PIPELINE.md`, `docs/SET_LIBRARY.md`, and the editorial safeguards in `docs/GEOGRAPHY_CONTENT_NOTES.md`. No separate question-authoring `SKILL.md` was present in the repository or available skills.

The intended progression is:

- Levels 1–3: recognizable places and straightforward location or capital associations.
- Levels 4–5: accessible island, country and landmark relationships.
- Levels 6–8: regional detail, including river outlets, neighboring islands and mountain systems.
- Levels 9–10: multi-place relationships, coastal geometry, seasonal flow and inland drainage.
- Levels 11–12: less familiar islands, parks, lakes and landform origins.
- Levels 13–14: specific regional features, river connections, geodesy and basin properties.
- Level 15: precise watershed routes or geographic mechanisms requiring several connected ideas.

Questions use four distinct choices of comparable type, a single answer reference, an individual hint and a short explanation. Correct answer positions are distributed 3/4/4/4 within each set. Prompts avoid changing population counts, disputed sovereignty, vague superlatives and current political officeholders. Capital status is treated as a stable geographic fact, not a claim of perpetual validity.

Every question records source URLs and verification notes, checked on 2026-11-19. Facts and hints were reviewed for scope and overlap with the existing catalog. Related topics can recur with a different central fact: the new Europe set asks about the Wachau valley, not which river flows through Vienna; the Americas finale asks for an exact downstream route at Two Ocean Pass, not the existing Triple Divide Peak question. New wording does not claim originality for geographic facts.

These remain **assistant-reviewed-draft**, with human review recommended. Validation checks structure and integration; it cannot certify factual truth or how difficult players will find a question. In particular, regional familiarity can greatly change the difficulty of later location questions. Human factual review and difficulty play-testing remain recommended.

## Source trail and wording decisions

The full source trail is attached to each question's `metadata.sourceNotes`; these are the principal references and editorial boundaries for the harder material:

- Europe: [UNESCO Wadden Sea](https://whc.unesco.org/en/list/1314/), [Ohrid extension decision](https://whc.unesco.org/en/decisions/7366/), [Curonian Spit](https://whc.unesco.org/en/list/994/), [Białowieża Forest](https://whc.unesco.org/en/list/33/), [Wachau](https://whc.unesco.org/en/list/970/), [Struve Geodetic Arc](https://whc.unesco.org/en/list/1187/), and [High Coast / Kvarken](https://whc.unesco.org/en/list/898/). The Wadden Sea question concerns the named World Heritage property; the Iberian question says **most**, not exclusively Spain and Portugal. Kvarken's emergence is land uplift after ice unloading, not a claim that global sea level is falling.
- Americas: [Canadian Hydrographic Service sailing directions](https://publications.gc.ca/collections/collection_2024/mpo-dfo/Fs74-48-2024-9-eng.pdf), [Pantanal](https://whc.unesco.org/en/list/999/), [Gros Morne](https://whc.unesco.org/en/list/419/), [Parks Canada Nahanni hydrology](https://parks.canada.ca/pn-np/nt/nahanni/nature/hydrologie-hydrology), [NASA Perito Moreno](https://science.nasa.gov/earth/earth-observatory/perito-moreno-glacier-argentina-78754/), [NASA Casiquiare](https://science.nasa.gov/earth/earth-observatory/when-rivers-take-a-weird-turn-154394/), and [Two Ocean Pass research](https://www.mdpi.com/2073-4441/12/6/1629). The falls question distinguishes Iguazú's actual border from nearby Paraguay. The glacier is distinct from the separately named Perito Moreno National Park. The final question explicitly selects **Atlantic Creek**; the Pacific branch follows a different route.
- Africa: [ESA Atlas Mountains](https://www.esa.int/Applications/Observing_the_Earth/Earth_from_Space_Africa_s_Atlas_Mountains), [UNESCO Namib Sand Sea](https://whc.unesco.org/en/list/1430/), [USGS inland Niger delta](https://eros.usgs.gov/earthshots/niger-river-inland-delta-mali), [USGS Lake Turkana](https://eros.usgs.gov/earthshots/lake-turkana-kenya-and-ethiopia), [Djibouti's Lake Assal submission](https://whc.unesco.org/en/tentativelists/5959), [IUCN Bemaraha assessment](https://whc.unesco.org/document/153579), [NASA Lake Chad](https://science.nasa.gov/earth/earth-observatory/lake-chads-water-wetlands-and-dunes-154407/), and [Tanganyika drainage research indexed by FAO](https://agris.fao.org/search/en/providers/122535/records/65df4370b766d82b1800f92c). The inland Niger delta is distinguished from the coastal delta. Fog is scoped to the Namib Sand Sea. Tanganyika's question is about its **surface outflow**, not the share of water lost to evaporation. The Assal source is a state-submitted tentative-list description, not evidence of World Heritage inscription.
- Asia and the Pacific: [UNESCO Komodo](https://whc.unesco.org/en/list/609/), [Mekong River Commission geography](https://www.mrcmekong.org/geography/), [Puerto-Princesa](https://whc.unesco.org/en/list/652/), [Ujung Kulon](https://whc.unesco.org/en/list/608/), [East Rennell](https://whc.unesco.org/en/list/854/), [NASA Lena delta](https://science.nasa.gov/earth/earth-observatory/lena-river-delta-russia-7343/), [NASA Balkhash](https://science.nasa.gov/earth/earth-observatory/lake-balkhash-91230/), [Balkhash hydrology research](https://www.zin.ru/labs/brackish/pdfs/2019/balkhash_lake.pdf), and [National Museum of Ethnology research on Wallacea](https://www.minpaku.ac.jp/assets/pages/research/publication/research-publications/bulletin/houkoku_49-3.pdf). Tonle Sap's reversal is explicitly seasonal. Balkhash uses relative salinity rather than claiming uniformly fresh water. Wallacea's question concerns the absence of a **continuous land bridge**, not an absolute barrier to all animal movement.

## Integration checks

Register the four files explicitly with `npm run register:sets -- <paths>`, then run `npm run build:content` and `npm run validate`. The active totals are 46 curated sets, 690 curated questions, 300 Fresh Mix questions, 990 questions overall, 51 sources and 66 questions at each level. The five pre-existing normalization repairs remain unchanged.

Registration pins each new source's SHA-256. The catalog validator checks IDs, duplicate prompts, choice references, category membership, exact ladders and reciprocal set membership. Existing catalog and content-manager tests assert the new totals. Compare prior question records by ID to ensure the addition preserves all 930 existing records; smoke-play each new set through its folder to check navigation, hints and answer review.

Validation on 2026-11-19 passed: type-checking, content hashes, 133 unit/component tests, production build and all 19 existing browser tests. Additional local browser smoke runs completed all four new games offline at 1280×720, including hints, layout bounds and the 15-answer review. A record-by-record comparison confirmed that all 930 prior questions were unchanged. These checks do not replace the editorial review described above.
