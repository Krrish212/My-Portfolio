# Portfolio — Krishang Sharma

Static site, no build step. Open `index.html` with Live Server (or any static server) to run locally.

## Placeholder assets still needed

Drop these files into `assets/` — the site shows a styled fallback until they exist:

| File | Used for | Suggested size |
| --- | --- | --- |
| `assets/project-rl-trading.jpg` | Skill-Conditioned RL for Trading card | ~1200×750 (16:10) |
| `assets/project-atari-breakout.jpg` | Atari Breakout RL card | ~1200×750 (16:10) |
| `assets/project-nlp-pipeline.jpg` | NLP Sentiment Pipeline card | ~1200×750 (16:10) |
| `assets/project-stock-predictor.jpg` | Stock Price Predictor card | ~1200×750 (16:10) |
| `assets/project-virtuconnect.jpg` | VirtuConnect card | ~1200×750 (16:10) |
| `assets/project-cae.jpg` | Convolutional Autoencoder card | ~1200×750 (16:10) |

### Supplied assets

These are already in place — extracted from the reference designs, no action needed.

Hero portrait frames — `assets/portrait-1.jpg` (upper-left, behind) and
`assets/portrait-2.jpg` (lower-right, in front). Both 1000×1250. The frames are
`aspect-ratio: 4/5` with `object-fit: cover`, so replacements should be cropped to
4:5 or the browser will centre-crop them. 1000px wide is ~2.3× the 436px the card
renders at, which covers retina; the older ~800×1000 guidance predates the hero
resize and is now too small. `.hero__frame img` applies `filter: grayscale(1)`, so
source colour is discarded.

From the LSTM design:
`assets/lstm-train-vs-validation.png`, `assets/lstm-zoomed-validation.png`,
`assets/lstm-next-day-prediction.png`, `assets/lstm-app-summary.jpg`

From the VirtuConnect design — three survey charts, four UI glyphs, the wireframe
sheet and two prototype screenshots:
`assets/vc-preferred-features.png`, `assets/vc-preferred-activities.png`,
`assets/vc-vr-comfort.jpg`, `assets/vc-icon-back.png`, `assets/vc-icon-settings.png`,
`assets/vc-icon-profile.png`, `assets/vc-icon-home.png`, `assets/vc-wireframe.png`,
`assets/vc-prayer-space.jpg`, `assets/vc-screen-map.jpg`

### Experience card logos

`public/logos/` holds the supplied brand files (`Accenture-Logo.png`, `Barclays.png`,
`dojo.png`) and the `*-mark.png` files derived from them, which are what the cards
actually load. The originals disagree on framing and encoding — Accenture's chevron
sits in the middle 52% of a 16:9 canvas, Barclays' eagle fills its frame, and dojo is
a dark wordmark on an **opaque white plate**. The cards paint marks through a CSS
`mask`, which reads alpha only, so each derived file is cropped to its own ink and
given a real alpha channel (dojo's from luminance). To add or replace one:

1. Drop the brand file in `public/logos/`.
2. Produce a tight-cropped, transparent-background PNG beside it as `<name>-mark.png`.
3. Point `logo` in `experience-data.js` at it, and set `logoHeight` — the marks are
   cropped to their ink, so height alone balances a square mark against a wide
   wordmark (46 / 48 / 30 for the three current ones). Set `logoIsWordmark: true`
   if the mark spells the company out, so the name label under it is suppressed.

`logoTint: true` masks the mark and repaints it in the card accent, so the source
colour is discarded; set it `false` to show a multi-colour mark as-is at 90% opacity.
A missing file leaves `.has-logo` off and the letterspaced mono wordmark stands in.

### Case study downloads

Linked from the two hero action cards and the page footers. Both links are live —
they 404 until the files are added.

| File | Used for |
| --- | --- |
| `assets/skill-conditioned-rl-dissertation.pdf` | `projects/rl-trading.html` — "Read the dissertation" |
| `assets/skill-conditioned-rl-code.zip` | `projects/rl-trading.html` — "Download the code" |
| `assets/breakout-rl-report.pdf` | `projects/atari-breakout.html` — "Read the report" |
| `assets/breakout-rl-code.zip` | `projects/atari-breakout.html` — "Download the code" |
| `assets/virtuconnect-hci-report.pdf` | `projects/virtuconnect.html` — "Read the full report" (both buttons) |

## Project detail pages

Five are full case studies built on the shared `case-study.css` system:

| Page | Extras |
| --- | --- |
| `projects/rl-trading.html` | `case-study.js` (scroll reveal) |
| `projects/atari-breakout.html` | `case-study.js` |
| `projects/nlp-pipeline.html` | `nlp-case-study.css`, `nlp-demo.js` (live tokenisation demo); uses the `cs--static` variant — no scroll reveal, no card hover |
| `projects/stock-predictor.html` | uses the `cs--ruled` variant — sections divided by an explicit `.cs-rule` hairline rather than a border between them |
| `projects/virtuconnect.html` | `cs--ruled`; no page-specific stylesheet — every component it needs is in the shared system |

The remaining one (`projects/cae.html`) is an on-brand placeholder page — fill in the
content where marked `<!-- TODO: project detail content -->`.

### Case-study components

`case-study.css` is the shared design system for all five. Page-specific components live in a
sibling stylesheet (`nlp-case-study.css`); anything used by two or more pages is promoted into
`case-study.css` under a `cs-` prefix. Two variants change page-level behaviour:

- `cs--static` — cancels the card lift-and-glow (for pages whose only motion is their own).
- `cs--ruled` — swaps the between-section border for an in-section `.cs-rule` hairline.

Component-level modifiers:

- `cs-stats--bar` — one gradient accent bar across the whole metrics strip instead of a
  short bar over each stat.
- `cs-figgrid` / `cs-figgrid--3` — figures side by side (2-up, 3-up) rather than stacked.
- `cs-fig--wide` — bleeds a single figure past the 1120px measure to 1240px, for an
  artefact that is unreadable at column width. Collapses back below 1180px.
- `cs-fig--light` — light plate behind a screenshot that carries its own white canvas.
- `cs-panel--warn` — amber caution panel; qualifies a result rather than reporting failure.
- `cs-icons` / `cs-ico` / `cs-ico--new` — strip of small UI-glyph tiles; `--new` marks a
  glyph added during iteration.

Every image card (`.cs-fig`, `.cs-diagram`, `.cs-chartcard`, `.cs-skill`, `.cs-tablewrap`)
lifts and glows violet/cyan on hover, gated on `(hover: hover) and (pointer: fine)` and
disabled under `prefers-reduced-motion`. `.cs-ico` lifts without scaling — a 34px glyph
distorts when scaled.

### Copy still needed

`projects/atari-breakout.html` carries one unwritten line, marked `[PLACEHOLDER]` in the
"My contribution" block at the end of section 01. It is a six-person group project, so
the sentence naming which agents and infrastructure were yours has to be written by hand
rather than inferred from the report.
