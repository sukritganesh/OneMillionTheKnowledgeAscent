# Culture set authoring notes

## Additions

Seven self-contained packs add 105 questions, all exclusively for curated play (`freshMix: false`). Each file contains one set, with exactly one question at each level from 1 to 15. Pack, set, and question IDs use distinct `builtin-library-<topic>-...` namespaces; folder names are not identity.

| File under `content/sets/culture/` | Set | Folder |
| --- | --- | --- |
| `architecture/built-to-last.json` | Built to Last | Arts & Culture / Architecture |
| `music/how-music-works.json` | How Music Works | Arts & Culture / Music |
| `cinema/behind-the-screen.json` | Behind the Screen | Arts & Culture / Film |
| `food/the-curious-kitchen.json` | The Curious Kitchen | Everyday Life / Food & Drink |
| `mythology/tales-across-the-world.json` | Tales Across the World | Arts & Culture / Mythology |
| `books/between-the-lines.json` | Between the Lines | Arts & Culture / Books & Language |
| `language/signs-sounds-and-scripts.json` | Signs, Sounds, and Scripts | Arts & Culture / Books & Language |

## Editorial approach

The question-bank specification, content-pipeline documentation, and geography authoring notes were read before authoring. Existing catalog prompts in the six relevant cultural categories were reviewed, followed by a cross-category check for writing-system topics. The new sets avoid the existing Hamlet, Odyssey, film-auteur, diegetic-sound, tritone, Maillard-reaction, Rosetta-decipherment, and Linear-B-language questions. Familiar subjects sometimes recur with distinct concepts, such as identifying Hangul versus understanding its alphabetic composition.

Foundation questions use recognizable objects and stories. Intermediate questions introduce terminology and relationships. The upper ladder emphasizes structural distinctions and reasoning: pendentives versus squinches, string nodes and natural harmonics, perspective in a dolly zoom, starch retrogradation, the substitute condition in Inana's Descent, narrative metalepsis, and the semantic/phonetic division in Chinese compound characters. These are provisional editorial levels, not measured difficulty scores.

Mythology questions name the relevant tradition or text instead of treating one version as universal. No questions rely on current rankings, active records, officeholders, changing populations, or religious truth claims. Every question includes four choices, an independent hint, explanation, and source/verification notes. Sources are provenance for editorial work, not a claim that automated structural validation establishes truth.

## Sources consulted

Specialist facts were checked in institutional references and primary texts, including:

- UNESCO World Heritage entries for [Djenné](https://whc.unesco.org/en/list/116), [Shibam](https://whc.unesco.org/en/list/192), and the [Taj Mahal](https://whc.unesco.org/en/list/252); Columbia's [Hagia Sophia dome briefing](https://projects.mcah.columbia.edu/medieval-architecture/htm/or/ma_or_discuss_hs_dome.htm); and the Met's [muqarnas collection record](https://www.metmuseum.org/art/collection/search/447256).
- Met collection records for [mbira-family lamellaphones](https://www.metmuseum.org/art/collection/search/503679), [sheng](https://www.metmuseum.org/art/collection/search/505403), and [sarangi](https://www.metmuseum.org/art/collection/search/503204); UNSW's [clarinet acoustics](https://newt.phys.unsw.edu.au/jw/clarinetacoustics.html) and [string harmonics](https://phys.unsw.edu.au/jw/strings.html); and [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/).
- Yale's film-analysis chapters on [cinematography](https://filmanalysis.yale.edu/cinematography/), [editing](https://filmanalysis.yale.edu/editing/), and [sound](https://filmanalysis.yale.edu/sound/); the [Smithsonian Cinématographe record](https://www.si.edu/object/nmah_759313); and Screen Scotland's educational [film glossary](https://screeningshorts.org.uk/glossary/).
- CIMMYT's [nixtamalization explainer](https://www.cimmyt.org/news/what-is-nixtamalization/), the Exploratorium's [egg and custard science](https://annex.exploratorium.edu/cooking/eggs/flan-pop.html), and King Arthur Baking's [tangzhong](https://www.kingarthurbaking.com/blog/2021/02/05/tangzhong-method-soft-pillowy-cinnamon-rolls) and [bread storage](https://www.kingarthurbaking.com/blog/2020/07/08/the-best-way-to-store-yeast-bread) explanations.
- Te Papa's account of [Māui and the sun](https://www.tepapa.govt.nz/about/our-buildings/rongomaraeroa-our-marae/wharenui-te-hono-ki-hawaiki), the Smithsonian's [Maya creation account](https://maya.nmai.si.edu/the-maya/creation-story-maya), UCL's translation of [Isis and Ra](https://www.ucl.ac.uk/museums-static/digitalegypt/literature/isisandra.html), and Oxford's translation of [Inana's Descent](https://etcsl.orinst.ox.ac.uk/section1/tr141.htm).
- Poetry Foundation definitions of [villanelle](https://www.poetryfoundation.org/education/glossary/villanelle), [sestina](https://www.poetryfoundation.org/education/glossary/sestina), and [blank verse](https://www.poetryfoundation.org/education/glossary/blank-verse); Hamburg's scholarly [metalepsis entry](https://www-archiv.fdm.uni-hamburg.de/lhn/node/51.html); and Aristotle's [Poetics](https://classics.mit.edu/Aristotle/poetics.2.2.html).
- Unicode 16's writing-system chapters [6](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-6/), [18](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/), and [20](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-20/), its [Indic FAQ](https://www.unicode.org/faq/indic.html), and the International Phonetic Association's [handbook resources](https://www.internationalphoneticassociation.org/node/125).

Question-level source notes provide additional references. Some reference pages are overview chapters rather than pinpoint passages, and website access can change; a human editor should review the cited materials and playtest difficulty before certification. All seven packs explicitly remain `assistant-reviewed-draft`, with `humanReviewRecommended: true` and zero time-sensitive questions.

## Structural checks

The repository's `validateContentPack(..., { origin: 'built-in' })` validator was run on all seven files: all passed with no errors. The parent integration task registers their manifest entries and performs release-wide duplicate, catalog, and application checks. Neither immutable release source payloads nor general-pool questions were edited by this authoring task.
