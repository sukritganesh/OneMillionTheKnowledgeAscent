# Image and video questions

Questions may include an optional `media` array of one to three attachments. Text-only packs and version 1 saves remain valid. This is an additive field, not a new question-bank format; the 300-question Fresh Mix bank is unchanged.

## Authoring contract

```json
{
  "media": [{
    "kind": "image",
    "src": "data:image/png;base64,<actual base64 file bytes>",
    "mimeType": "image/png",
    "alt": "A curved blue line crosses a square grid.",
    "credit": "Creator and work title",
    "license": "CC0",
    "sourceUrl": "https://example.org/original-work"
  }]
}
```

The placeholder above must be replaced with real file bytes. For video, use `kind: "video"`, a supported video MIME type and a matching data URL. Also supply `description`: an equivalent, non-spoiling account of the motion and all meaningful audio. Silent videos should explicitly say they are silent. Descriptions may also accompany images, for example to explain that a diagram is not to scale.

Supported types are JPEG (`image/jpeg`), PNG, WebP, MP4 and WebM. MP4/H.264 and WebM/VP8 or VP9 are practical browser targets; validating a container signature does not guarantee that every browser can decode its codec. SVG, GIF, HTML, scripts, arbitrary URLs and iframe/YouTube embeds are not supported.

Imported media must be embedded. Limit each decoded attachment to **1 MiB** and the complete UTF-8 JSON pack, including base64 overhead, to **5 MiB**. These limits apply to pasted JSON, files and object-based import preparation. Bad attachments reject the whole import before installation. JSON export and duplication preserve attachments. The manual question form remains a text-only authoring tool; use JSON import for media packs.

Each attachment needs nonempty alt text, credit, license and an HTTPS source-page URL. Naming a license is not proof of permission: verify the original source and any restrictions before redistributing. Do not use unattributed search-result thumbnails, copyrighted soundtracks or images of uncertain provenance.

## Writing fair visual questions

- Keep the prompt understandable if a player uses the text description; avoid “what is this?” without context.
- Describe observable features in alt text. Do not put the answer, artist's name or identifying title there when recognition is the question.
- Source credits are withheld during the question and shown after the answer reveal and in review. File names in built-in packs are hashes, not answer titles. This is spoiler reduction, not anti-cheat security: all answers and asset metadata exist locally.
- Clearly distinguish scientific animations, false-colour composites and time-lapses from ordinary photographs. State relevant scale changes and time compression.
- Preserve the normal 15-level difficulty ladder. A picture should help the question, not substitute for a good hint, four credible choices or a clear explanation.
- Do not make essential information depend solely on a soundtrack. Provide an equivalent description of speech and sound; this release does not provide timed caption tracks.

## Built-in assets and offline operation

Built-in attachments use `/question-media/<sha256>.<extension>` and live in `public/question-media/`. The set pipeline checks that the file stays inside that directory, matches its hash and declared type, and is at most **6 MiB**, the service-worker per-file cache ceiling. Register the referring set explicitly with `npm run register:sets -- <set-path>` and rebuild with `npm run build:content`.

Keep hashed files immutable and append-only once released: old saves and game reviews may still reference them. Do not replace or remove a published asset just because its question has changed. New bytes require a new filename. Provenance for the initial assets is in [media sources](../content/media-sources.json).

The production PWA precaches these files with the app; first installation must finish online. Development mode does not install a service worker. Video playback fetches the complete local/cached file and creates a temporary Blob URL, allowing the browser to handle seeking without offline HTTP range requests. Blob URLs are revoked on question changes and unmount.

## Player behaviour and persistence

Images use contained sizing rather than cropping; they can be enlarged in a keyboard-accessible dialog. Numbered controls switch between attachments. Videos have native controls and never autoplay. Playback pauses on question changes, game dialogs, loss of game control, document hiding and closing an answer-review section. Video playback lowers game music; narration replay pauses video. The game's master mute also applies to question video.

An unavailable or undecodable asset shows a readable error plus its description/alt text. It does not remove the question or answer controls. Playing a video or enlarging an image never changes answer order or the game timer. Media controls and dialogs do not trigger A–D answer shortcuts.

Resolved questions copy media into saved games and historical reviews. Embedded custom assets therefore survive a pack update or removal, and full backups carry their bytes. Defensive save, import and backup validation rejects unsafe media while continuing to accept legacy questions without media. Existing **25 MiB** full-backup limits still apply: repeated media-heavy games can make backups larger because snapshots are self-contained, not deduplicated. Keep custom clips short and compress images appropriately.

## Sample sets and verification

The three new sets add 45 questions, with 20 media-bearing questions (including a two-image comparison) and 25 text-only questions:

- **A Closer Look: Art** — Hokusai, Bruegel and Van Gogh, then printmaking and conservation.
- **Earth from Above** — Galileo's turning Earth, a hurricane's eye and remote sensing.
- **Moonlight and Shadows** — phases, eclipse geometry and orbital reasoning.

The six images and four silent WebM videos total about 8 MiB. WebM was selected so the samples also work in Chromium builds without H.264. Media are sourced from The Met's public-domain collection and NASA; original downloaded renditions are bundled without content edits. Their per-question references document factual sources. These remain `assistant-reviewed-draft`, with human review and difficulty play-testing recommended—not certified human-reviewed content.

`npm run validate` checks the full content manifest, source hashes, unit regressions and browser flows. `e2e/media.spec.ts` plays all 45 new questions offline, checks actual video decoding/playback and pause behaviour, exercises gallery enlargement, checks credits at reveal, and measures layout at 1280×720.

If another project occupies the default test port (4173), set `PLAYWRIGHT_PORT` to a free local port before running validation. CI continues to use the default.
