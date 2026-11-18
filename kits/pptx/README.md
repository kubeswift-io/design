# PowerPoint talk template and diagram kit

Two decks, each in a light and a dark version, generated from `tokens/tokens.json`.

| File | What it is |
| --- | --- |
| `KubeSwift-Talk-Template-Light.pptx`, `-Dark.pptx` | Start a talk here. Slide layouts and one example of each. |
| `KubeSwift-Diagram-Kit-Light.pptx`, `-Dark.pptx` | Editable diagram shapes to copy into a talk. |

Install Space Grotesk, IBM Plex Mono and Architects Daughter from [`fonts/`](../../fonts/) before opening either deck, or PowerPoint substitutes fonts and text reflows.

## Talk template

Ten slides: title, agenda, section divider, list, two columns, diagram, code, number, demo and closing with a QR code. Each slide's speaker notes state the rule it shows. Title, section and closing slides are navy in both versions; the content slides follow the theme.

The layouts are real slide layouts, so Home > New Slide offers them with their placeholders:

| Layout | Use |
| --- | --- |
| `KS Title` | Title slide. Add the outlined hexagon by duplicating the example title slide instead. |
| `KS Section` | Section divider: mono number and title. |
| `KS Content` | Eyebrow, title and a body list. |
| `KS Two Columns` | Eyebrow, title and two bodies. |
| `KS Title Only` | Eyebrow and title over the grid, for diagrams, code, numbers and demos. |
| `KS Closing` | Closing slide. Duplicate the example closing slide to keep the QR code. |

To start a talk, fill in a `talk.json` and generate the template with your title, speaker and QR link already in place:

```json
{
  "event": "KCD Porto 2026",
  "date": "",
  "title": "Running VMs, not only booting them",
  "subtitle": "One line on what the audience leaves with.",
  "speaker": "Your name",
  "role": "Role, organisation",
  "url": "https://github.com/kubeswift-io/kubeswift",
  "links": ["github.com/kubeswift-io/kubeswift"]
}
```

```sh
node kits/pptx/template.cjs light my-talk-light.pptx talk.json
node kits/pptx/template.cjs dark  my-talk-dark.pptx  talk.json
```

Any field left out keeps its placeholder. The QR code encodes `url`: dark modules on a white tile, because inverted codes fail on some phone cameras. Regenerate it rather than pasting a new image.

## Diagram kit

Eleven slides: title, ownership fills, node sizes, connectors, groups and annotations, tags and column headers, code panels, state timelines, two complete example diagrams, and a section divider.

- Copy a shape and paste it into your deck. Each node is one shape with its text inside, so it moves and copies as a unit.
- Shapes are named by role in the Selection Pane (Home > Arrange > Selection Pane), for example `Node KubeSwift-owned: Flux` or `Group frame: reconciles VM execution`.
- Node sizes are whole 48px grid cells (0.333 in). Strokes are 1.5pt. Node titles are 17pt.
- Connectors are plain lines, not glued connectors: when you move a node, move its arrows too.

## Regenerating

After changing a token or a generator:

```sh
npm install
npm run kit
```

`lib.cjs` reads the tokens, renders the blueprint grid, the logo mark and the QR code from them, and holds the drawing helpers both decks share. `generate.cjs` writes the kit and `template.cjs` the template. Do not edit the `.pptx` files by hand.
