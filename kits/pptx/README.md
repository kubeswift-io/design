# PowerPoint diagram kit

Editable diagram shapes for KubeSwift talks, in a light and a dark version:

- `KubeSwift-Diagram-Kit-Light.pptx`
- `KubeSwift-Diagram-Kit-Dark.pptx`

Eleven slides: title, ownership fills, node sizes, connectors, groups and annotations, tags and column headers, code panels, state timelines, two complete example diagrams, and a section divider. Each slide's speaker notes state the rule it shows.

## Using the shapes

- Copy a shape and paste it into your deck. Each node is one shape with its text inside, so it moves and copies as a unit.
- Shapes are named by role in the Selection Pane (Home > Arrange > Selection Pane), for example `Node KubeSwift-owned: Flux` or `Group frame: reconciles VM execution`.
- Node sizes are whole 48px grid cells (0.333 in). Strokes are 1.5pt. Node titles are 17pt.
- Connectors are plain lines, not glued connectors: when you move a node, move its arrows too.
- Install Space Grotesk, IBM Plex Mono and Architects Daughter from [`fonts/`](../../fonts/) before opening the kit, or PowerPoint substitutes fonts and text reflows.

## Regenerating

The kit is generated from `tokens/tokens.json`. After changing a token:

```sh
npm install
npm run kit
```

`generate.cjs` reads the tokens, renders the blueprint grid and the logo mark from them, and writes both files. Do not edit the `.pptx` files by hand; change the generator or the tokens.
