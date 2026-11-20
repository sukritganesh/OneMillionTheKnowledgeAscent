# Automobile sets: editorial notes

Library v2.4.0 adds two independent 15-question games under **Science & Technology / Automobiles**. Their source files live in `content/sets/discovery/science-and-technology/automobiles/`. Both use the standard difficulty ladder; neither is a special hard-mode set. The folder is a browsing label, not a new primary category. Every question has a unique concept-based ID, four choices, an individual hint, explanation, source URL and verification scope. All use `usage.freshMix: false`.

## Themes and progression

| Levels | Road Icons | Under the Hood |
| --- | --- | --- |
| 1–3: Foundation | Familiar manufacturer, badge and film car | Instruments, engine cooling and an EV's energy store |
| 4–5: Accessible | Luxury mascot and a famous model launch | Tire tread and ignition voltage |
| 6–8: Intermediate | Engine placement, safety history and Mini packaging | Regeneration, ABS and turbocharger drive |
| 9–10: Advanced | Citroën suspension and the 1991 Le Mans winner | Cornering geometry and octane's meaning |
| 11–12: Expert | Structural constraints and a steering-linked headlamp | Charge cooling and four-stroke valve timing |
| 13–14: Elite | Miura packaging and Lotus ground effect | Ideal Ackermann geometry and dry-sump lubrication |
| 15: Millionaire | How Honda CVCC ignites a lean main charge | A simple planetary-transmission reduction puzzle |

The higher questions test useful mechanical distinctions and reasoning, rather than production serial numbers or changing performance records. Correct answer positions are distributed 4/4/3/4 in Road Icons and 4/3/4/4 in Under the Hood; runtime choice shuffling still applies. Difficulty remains an editorial estimate, especially where a car enthusiast may find a supposedly difficult question familiar.

## Sources and factual scope

References were checked on 2026-11-20. Exact links are stored in each question's `metadata.sourceNotes`, with scope in `verificationNotes`. Questions and explanations are original wording; no media or manufacturer logos are bundled.

Road Icons uses primary manufacturer records and museum/film records:

- Volkswagen's Type 1 history and Ferrari's 2023 annual-report trademark section establish the Beetle and Prancing Horse identities.
- The official Back to the Future site records writer/producer Bob Gale's discussion of the DeLorean choice. Rolls-Royce's Charles Sykes history identifies its mascot.
- [Ford's launch history](https://corporate.ford.com/corporate/corporate/articles/history/mustang-worlds-fair/) distinguishes the April 1964 public launch from press previews and the 1965 model-year designation.
- Porsche's 911 history is scoped to classic road cars, not competition derivatives. Volvo's account concerns Bohlin's three-point design, not the invention of all seat belts. BMW Group's Mini history supports space-saving packaging without a disputed absolute "first" claim.
- Stellantis/DS's 70-year history identifies hydropneumatic suspension. Mazda's R26B history confirms the four-rotor 1991 Le Mans winner. Mercedes-Benz's postwar history connects the 300 SL's high frame sides to its door design.
- [The Henry Ford's Tucker collection](https://www.thehenryford.org/collections/explore/sets/detail/preston-tucker-and-the-tucker-48) documents the steering-linked center lamp. Lamborghini's Miura history establishes the transverse rear-mid-mounted V12.
- [Classic Team Lotus](https://classicteamlotus.co.uk/en/about/team-lotus-register-2/type-78/) describes the Type 78's Venturi-shaped sidepods and skirts. [Honda's technical history](https://global.honda/en/tech/serial/ACCORD_50th_part01/) describes the richer auxiliary mixture and flame jet into the lean main charge. No claim is made about compliance with today's emissions rules.

Under the Hood uses Ford's owner documentation, DENSO's radiator and ignition-coil guidance, the U.S. Department of Energy's Alternative Fuels Data Center, Continental's tire and timing-belt technical material, Bosch, Garrett, Eaton, EIA, Porsche and MathWorks:

- EV storage and regeneration are distinguished from charging equipment and friction brakes. No claim is made that all braking energy is recoverable.
- ABS is described as wheel-pressure modulation, not a promise of shorter stopping distances on every surface. Turbocharger drive is explicitly conventional exhaust-gas drive, excluding electrically assisted variants.
- [Garrett's technical guide](https://www.garrettmotion.com/wp-content/uploads/2019/10/GAM_Turbo-Tech-101_BASIC.pdf) supports charge-air cooling; density comparison assumes comparable pressure. EIA supports knock resistance, not a universal power benefit from premium fuel.
- The camshaft question assumes a conventional four-stroke piston engine. The Ackermann question specifies ideal low-speed geometry, not racing geometry with tire slip. Porsche's GT3 technical account supports the dry-sump oil-supply benefit under high acceleration.
- [MathWorks' planetary-gear model](https://www.mathworks.com/help/sdl/ref/planetarygear.html) supplies the kinematic relation for a simple planetary set. Compound and double-pinion arrangements are outside the question's scope.

## Independent calculation checks

For the camshaft question, intake/compression/power/exhaust occupy two crankshaft revolutions. The valve sequence repeats once, so `3000 / 2 = 1500 rpm`.

For the finale, use `Ns × (sun speed − carrier speed) + Nr × (ring speed − carrier speed) = 0`. With 30 sun teeth, 90 ring teeth, a stationary ring and 1,200 rpm sun speed, `30 × (1200 − c) + 90 × (0 − c) = 0`, giving `c = 300 rpm`. Substitution yields zero; the other three numerical choices do not. A 30-tooth planet satisfies `90 = 30 + 2 × 30`, so the tooth counts describe a realizable simple geometry. The hint points out the moving carrier without supplying the reduction formula.

## Validation and review status

Register both source paths explicitly, regenerate with `npm run build:content`, and run `npm run validate`. Expected totals are 48 sets, 720 curated questions, 300 Fresh Mix questions, 1,020 questions overall, 53 sources and 68 questions at each level. The original one-shot release, frozen archive and earlier editorial reports remain historical records.

All new questions retain `assistant-reviewed-draft`, `humanReviewRecommended: true` and non-time-sensitive metadata. Source checking and executable structural checks do not constitute human review or empirical difficulty calibration.
