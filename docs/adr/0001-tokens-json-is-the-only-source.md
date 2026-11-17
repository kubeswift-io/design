# 0001. tokens.json is the only source of colour and type values

Status: accepted

## Context

Before this repository, KubeSwift's colours lived inside each deliverable: the KCD UK 2026 deck, the slide template, the brand guidelines page and the logo pages each declared their own values. They had already drifted. The light ground was `#F5F6F8` in the decks and `#F4F5F7` on the brand pages; the KubeSwift-owned node tint was `#D2F5F1` in the KCD deck and `#C4F3EE` in the slide template.

## Decision

- `tokens/tokens.json` holds every colour, type style, spacing step, radius, border width and shadow. Colour tokens carry a light and a dark value and a usage note naming the grounds they read on.
- `tokens/tokens.css` is generated from it (`npm run build`) and never edited by hand.
- Generators (the PowerPoint kit) read `tokens.json` directly.
- `npm run check` fails when `tokens.css` is stale, or when any stylesheet, page, SVG or generator uses a hex colour that is not a token value.
- The two drifted pairs resolve to the decks' values: `mist` is `#F5F6F8`, `tint-teal` is `#D2F5F1`. The other values are recorded in the tokens' usage notes.

## Consequences

- Changing a colour is one edit in `tokens.json`, then `npm run build` and `npm run kit`.
- A new colour needs a token and a usage note before anything can use it.
- The design system page in Claude mirrors this repository; changes are made here first.
