# KubeSwift design

The design system for [KubeSwift](https://github.com/kubeswift-io), Kubernetes-native VM orchestration on Cloud Hypervisor: tokens, logos, fonts, diagram rules, slide components and an editable PowerPoint kit.

Open [`index.html`](index.html) from a checkout to see the logos and every component in light and dark.

## Contents

| Path | What |
| --- | --- |
| [`tokens/tokens.json`](tokens/tokens.json) | Every colour (light and dark), type style, spacing step, radius, stroke and shadow, each with a usage note. The only source of values. |
| [`tokens/tokens.css`](tokens/tokens.css) | CSS custom properties, `@font-face` rules and type classes, generated from `tokens.json`. |
| [`docs/brand.md`](docs/brand.md) | The brand book: voice, colour, type, grid, motifs, logo, slides, accessibility. |
| [`docs/diagrams.md`](docs/diagrams.md) | Diagram rules. Fill means ownership. |
| [`docs/naming.md`](docs/naming.md) | How to write KubeSwift, its 22 kinds and its tools. |
| [`docs/status.md`](docs/status.md) | How every phase maps to a status colour. |
| [`docs/adr/`](docs/adr/) | Design decisions. |
| [`assets/logos/`](assets/logos/) | Mark and lockups as SVG, wordmark in outlines. |
| [`assets/motifs/`](assets/motifs/) | Chevron, chevron stream, title-slide hexagon, blueprint grid. |
| [`fonts/`](fonts/) | Space Grotesk, IBM Plex Mono and Architects Daughter as WOFF2, with their OFL licences. |
| [`components/`](components/) | Slide and page components: `bundle.css`, plus a preview and guidelines per component. |
| [`kits/pptx/`](kits/pptx/) | The editable PowerPoint diagram kit, light and dark, and its generator. |

## Using it

On a web page:

```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
```

Colours follow the system theme, or set `data-theme="light"` or `data-theme="dark"` on the root element.

In a talk: start from [`kits/pptx/`](kits/pptx/), in the theme your deck uses. Every deck ships in a light and a dark version.

## Changing it

```sh
npm install
npm run build   # tokens.json -> tokens.css
npm run check   # tokens.css is current and every hex colour is a token value
npm run kit     # regenerate the PowerPoint kit
```

Read [AGENTS.md](AGENTS.md) before changing anything. CI runs `npm run check` and `npm run kit` on every pull request.

## Licence

Apache-2.0, see [LICENSE](LICENSE). The fonts in [`fonts/`](fonts/) are licensed separately under the SIL Open Font License; each family's licence sits next to its files. The KubeSwift name and logo identify the KubeSwift project: use them to refer to KubeSwift, following the logo rules in [docs/brand.md](docs/brand.md), and not to suggest endorsement.
