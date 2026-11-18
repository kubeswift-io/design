# KubeSwift brand book

KubeSwift is Kubernetes-native VM orchestration on Cloud Hypervisor: VMs as first-class CRDs. This system covers the logo, colour, type, the blueprint grid, the diagram language and the slide components used in KubeSwift talks, docs and project pages. Light and dark are equal themes; every slide deck ships in both.

## Voice

Write the way an engineer explains a system to another engineer at a whiteboard.

- **Name the job.** Lead with what the reader is trying to do, then the mechanism. "Running VMs, not only booting them." Not "Unlock the power of virtualization."
- **Show the command.** If it can be typed, show it in mono: `kubectl get swiftguests`, `swiftctl`, the YAML field that changes. The command is the proof.
- **Use exact names.** Kinds in PascalCase and mono (`SwiftGuestPool`), never paraphrased ("guest pools"). Versions, phases and fields as they appear in the API. See [Naming](naming.md).
- **Calm and exact.** Numbers with units and a source, states not adjectives. "Applied CRD is not a running guest." Not "blazing fast", "supercharged", "seamless", "next-generation".
- **Sentence case** for titles, buttons and headings. Uppercase only in mono eyebrows, labels and tags.
- **Punctuation.** No em dashes or en dashes in any copy; use a comma, a colon or a new sentence. The middle dot separates eyebrow parts: `02 · ARCHITECTURE`. No exclamation marks. No emoji.
- **One message per slide.** A slide title can be two short sentences when the second is the turn: "Two control loops. One Kubernetes API."
- **I and you.** Talks speak as "I" (the speaker) and "you" (the operator). Docs speak to "you". The project is "KubeSwift", never "we" in docs.

Real titles from the decks that set the tone:

> Running VMs, not only booting them
>
> Resource applied ≠ VM ready.
>
> Git should own outcomes, not every action.

## Colour

The palette comes from the mark. Four brand colours, then semantic tokens that switch per theme.

- `azure` is the everyday ink of the mark and wordmark on light grounds.
- `teal` is the speed accent. Use it for the Swift half of the wordmark on dark, tag fills, the highlighted line of code, the chevron motif and section numerals on navy. Never as a large fill. Never as text on a light ground: it is 1.67:1 on `mist`. Where teal must be text on light, use `teal-text`.
- `navy` is the dark ground of title, section and closing slides, and of code panels.
- `mist` is the light ground.

Paint with the semantic tokens, never with the four brand colours directly:

- Page: `bg`, cards and panels `surface`, large dark bands `slab`.
- Text: `ink` for headings and primary text, `sub` for body copy and subtitles, `muted` for captions. Every one holds 4.5:1 on `bg`, `surface`, `tint-teal` and `tint-blue` in both themes. `faint` exists because the brand pages use it; it misses 4.5:1 on light, so do not use it for text a reader needs.
- Labels, eyebrows, annotations and stat numbers: `accent` (azure on light, teal on dark).
- Text on a teal fill is always `on-speed` (navy). Never white on teal: 1.81:1.
- Lines: `stroke` for diagram borders and arrows, `rule` for decorative dividers only (below 3:1, never an input border), `grid` for the blueprint grid.
- Focus: a 2px solid `focus` ring with a 2px offset.
- Status: phase chips use the five `status-*` pairs (success, info, warning, danger, neutral), never the brand colours. The phase-to-status map is in [status.md](status.md).

## Type

Three families, each with one job.

- **Space Grotesk** (`sans`) for everything people read: titles, body, node labels. Bold 700 for titles, 600 for node titles, 400 for body. Tight tracking on large sizes (`-0.03em` at slide-title, `-0.04em` at display).
- **IBM Plex Mono** (`mono`) for eyebrows, labels, tags, code, commands, versions, hostnames and kind names. Uppercase with wide tracking for labels (`0.12em` to `0.16em`); normal case for code.
- **Architects Daughter** (`hand`) only for handwritten annotations on slides and diagrams. Never in UI, docs or body text.

Fonts are self-hosted under [`fonts/`](../fonts/), each with its OFL licence. Do not load them from a CDN on pages that may run offline or air-gapped. Install the three families before presenting a PowerPoint export, or the deck falls back to system fonts and reflows.

Slide styles (`slide-*`) are sized for a 1920 x 1080 canvas; in PowerPoint at 13.333 in wide, divide px by 2 for points (64px title = 32pt). Web styles (`web-*`) come from the brand pages; the two mono web styles are under 12px, so set 12px on new pages.

## Grid, spacing and shape

- Content slides sit on the **blueprint grid**: `grid` lines every 48px (`space-48`) over `bg`. Snap node edges and region boundaries to it. Title, section and closing slides are plain `navy` with no grid.
- Slide padding: `slide-pad-top` 96px, `slide-pad-x` 120px, `slide-pad-bottom` 72px.
- Gaps: `space-12` inside a group, `space-28` between columns, `space-64` between regions.
- Corners: `radius-node` (6px) for nodes, tags and frames. Larger radii (`radius-panel`, `radius-card`) only for code panels and web cards.
- Borders do the work shadows do elsewhere. Nodes are outlined at `stroke-node` (3px); column headers sit under a `stroke-rule` (2px) rule in `ink`; rows are separated by `stroke-hair` in `rule`. Slides use no shadows.

## Motifs

- **The carved chevron** is the brand's atom: the forward cut inside the mark. Pulled out and repeated it becomes the loading and progress motif ([`chevron-stream.svg`](../assets/motifs/chevron-stream.svg)) and the `ChevronLoader` component. Teal on dark, azure on light.
- **The outlined hexagon** on title slides: the mark drawn as two offset outlines in teal at partial opacity with a dashed `rule` crosshair, bleeding off the right edge ([`hexagon-outline.svg`](../assets/motifs/hexagon-outline.svg)). Title slides only.
- **The blueprint grid** behind content slides ([`blueprint-grid-light.svg`](../assets/motifs/blueprint-grid-light.svg), [`blueprint-grid-dark.svg`](../assets/motifs/blueprint-grid-dark.svg)).

Use one motif per surface, never behind text. Do not use filled hexagon tiles or tessellations: that is the Kairos visual language, and KubeSwift stays line-based.

## Logo

- The mark is a regular hexagon with a chevron carved out as negative space. It is one ink and never traps a second colour.
- Lockups: horizontal and stacked, light and dark, in [`assets/logos/`](../assets/logos/). On light: mark and wordmark in `azure`. On dark: mark and "Kube" in white, "Swift" in `teal`.
- The wordmark is one word, "Kube" at 400 and "Swift" at 700, tracking `-0.02em`. The heavier half marks the speed half of the name.
- Clear space: at least the height of the carved chevron on every side. Minimum height 24px on screen for the horizontal lockup, 16px for the mark alone.
- Single-ink contexts use `kubeswift-mark-black.svg` (`mark-black`) or `kubeswift-mark-white.svg`.
- Never recolour the mark outside these inks, outline it, rotate it, put it on teal, or place it over the grid or the hexagon motif.

## Diagrams

Architecture diagrams are the most used part of this system. The fill of a node says who owns it; the full rules are in [Diagrams](diagrams.md). In short: `tint-teal` for KubeSwift, `tint-blue` for Kubernetes and external systems, `accent-fill` for the API or runtime everything converges on, outline only for neutral resources, dashed for groups and in-progress states, `hand` annotations in `accent` for the speaker's asides.

## Slides

- Every deck ships in two versions, light and dark, from the same source. Diagrams stay editable shapes in both, never pictures. Start from the [PowerPoint kit](../kits/pptx/).
- Structure: title slide (navy, outlined hexagon), section dividers (navy, `slide-numeral` in teal), content slides on the grid, closing slide (navy, takeaways, links, QR).
- Content slide header: `slide-eyebrow` in `accent` as `NN · LABEL`, then `slide-title` in `ink`, top-left, the same position on every slide. The logo sits top-right at 26px.
- A takeaway line closes a slide when it needs one: a `rule` above, `slide-body` at 700 in `ink`.
- Code panels: 10 to 14 lines, line numbers in `code-muted`, the one line that matters highlighted with `code-highlight` and its value in `code-value`.

## Iconography

KubeSwift has no icon set. Use the chevron motif, mono labels and tags instead of icons. If an icon is unavoidable, use a stroked line icon at `stroke-node` weight in `stroke` or `accent`, never filled, never emoji.

## Accessibility

- Text holds 4.5:1 on its ground in both themes; the usage note on each colour token names the grounds and ratios.
- Known misses kept from the sources: `faint` on light (4.40:1), `code-muted` line numbers (2.84:1), `rule` lines (decorative, below 3:1).
- Never tell states apart by teal versus blue alone: pair the fill with a label or a dashed border.
- Status chips always show the phase word; success and danger differ mainly in hue.
