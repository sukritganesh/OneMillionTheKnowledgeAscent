# Science and nature set authoring notes

## Scope

Seven new, self-contained curated sets add 105 questions. Each contains one question at every level from 1 through 15, with reciprocal set membership and `freshMix: false`. The larger Fresh Mix question bank is unchanged.

| File under `content/sets/science/` | Title | In-game folder |
| --- | --- | --- |
| `living-world/built-to-survive.json` | Built to Survive | Science & Nature / Living World |
| `living-world/secret-life-of-plants.json` | The Secret Life of Plants | Science & Nature / Living World |
| `earth-sky/written-in-stone.json` | Written in Stone | Science & Nature / Earth & Sky |
| `earth-sky/reading-the-sky.json` | Reading the Sky | Science & Nature / Earth & Sky |
| `how-things-work/chemistry-close-to-home.json` | Chemistry Close to Home | Science & Nature / How Things Work |
| `how-things-work/light-and-sound.json` | Light and Sound | Science & Nature / How Things Work |
| `spaceflight/leaving-earth.json` | Leaving Earth | Science & Nature / Spaceflight |

Pack, set, and question identities use distinct `builtin-library-<topic>-...` IDs. Question suffixes name the underlying concept, not its position in an array. Moving a file or changing a folder does not change these identities.

## Authoring and difficulty

The working question specification, content-pipeline instructions, and geography authoring notes were read before authoring. Existing Science, Nature and Earth, and Astronomy and Space prompts were reviewed to avoid repeating their central facts. Spaceflight emphasizes missions and navigation, leaving the original astronomy set's stellar and planetary questions intact.

- Early levels use familiar objects, organisms, and historical milestones.
- Middle levels introduce mechanisms and relevant vocabulary, with choices from the same domain.
- Later levels distinguish closely related processes and use explicit hypothetical conditions rather than obscure dates or transient records.
- Final questions address scaling limits, water potential, metastability, conditional atmospheric instability, buffer dilution, immersed interference, and orbital phasing.
- Hints point to a relationship or principle, without referring to answer order. Explanations are original, concise summaries rather than copied source passages.

The calculations were independently checked: surface-area/volume scaling, signed water potentials, dry versus saturated lapse-rate comparisons, ideal particle concentrations, weak-acid dilution, buffer ratios, wave speed, beat frequency, inverse-square intensity, polarizer transmission, and refractive fringe spacing. Their approximation conditions are stated in the prompts and recorded in question-level `verificationNotes`.

Independent editorial review prompted softer hints for the wet-bulb and atmospheric-thickness questions: they now suggest an observation or comparison without supplying the causal answer or the direction of the relationship.

## Source verification

Every new question has question-level `sourceNotes` containing a direct URL and `verificationNotes`. The named references below were consulted during authoring; the individual records contain the specific section supporting each question. Failed or mismatched page lookups were replaced with working, relevant references before handoff.

- [OpenStax Biology 2e: gas exchange](https://openstax.org/books/biology-2e/pages/39-1-systems-of-gas-exchange), [osmoregulation](https://openstax.org/books/biology-2e/pages/41-1-osmoregulation-and-osmotic-balance), [plant transport](https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants), and [plant responses](https://openstax.org/books/biology-2e/pages/30-6-plant-sensory-systems-and-responses).
- [Cornell Lab of Ornithology: hummingbird research discussion](https://academy.allaboutbirds.org/live-event/how-high-energy-hummingbirds-survive-a-qa-with-the-experts/) and [American Physiological Society: the multifunctional fish gill](https://journals.physiology.org/doi/full/10.1152/physrev.00050.2003).
- [National Park Service: minerals](https://www.nps.gov/subjects/geology/minerals.htm), [igneous rocks](https://www.nps.gov/subjects/geology/igneous.htm), and [metamorphic rocks](https://www.nps.gov/subjects/geology/metamorphic.htm); [USGS: mantle melting and water](https://www.usgs.gov/faqs/are-tectonic-plates-floating-magma).
- [National Weather Service: atmospheric pressure forces](https://www.weather.gov/source/zhu/ZHU_Training_Page/winds/pressure_winds/Pressure.htm), [layer thickness](https://www.weather.gov/source/zhu/ZHU_Training_Page/Miscellaneous/Heights_Thicknesses/thickness_temperature.htm), and [weather theory](https://www.weather.gov/media/zhu/ZHU_Training_Page/Met_Tutorials/Weather_Theory.pdf).
- [American Chemical Society: baking soda chemistry](https://www.acs.org/education/resources/k-8/inquiryinaction/fifth-grade/chapter-3/baking-soda-vs-baking-powder.html), [Maillard chemistry research](https://pubs.acs.org/doi/abs/10.1021/acs.jafc.7b00882), [USGS: water hardness](https://www.usgs.gov/water-science-school/science/hardness-water), and [OpenStax Chemistry 2e: buffers](https://openstax.org/books/chemistry-2e/pages/14-6-buffers).
- [OpenStax University Physics: polarization](https://openstax.org/books/university-physics-volume-3/pages/1-7-polarization), [single-slit diffraction](https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction), and [two-slit interference](https://openstax.org/books/university-physics-volume-3/pages/3-1-youngs-double-slit-interference).
- [NASA: spaceflight trajectories](https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/), [ion propulsion](https://science.nasa.gov/mission/dawn/technology/ion-propulsion/), [radioisotope generators](https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/power-radioisotope-thermoelectric-generators/), and [orbital periods and rendezvous](https://ntrs.nasa.gov/api/citations/19830004863/downloads/19830004863.pdf).

## Review status and limits

All seven packs declare `author: OpenAI`, `reviewStatus: assistant-reviewed-draft`, `humanReviewRecommended: true`, and zero time-sensitive questions. Every question is explicitly non-time-sensitive. No current mission status, current record, medical advice, or forecast is used as an answer.

The repository's pack validator accepts the seven new files without errors, including level order, membership, categories, choices, field limits, and folder paths. Source-linked assistant review is not human editorial certification: factual review and player-based difficulty calibration are still recommended, as required by the project specification. The final levels deliberately mix specialist concepts with reasoning and may play differently for subject experts.
