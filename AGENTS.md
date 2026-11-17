# Working in this repository

Rules for anyone, human or agent, changing the KubeSwift design system.

- `tokens/tokens.json` is the only source of colour, type, spacing, radius, stroke and shadow values. Never write a hex colour in a stylesheet, page, SVG or generator unless it is a token value; `npm run check` fails otherwise.
- `tokens/tokens.css` is generated. Change `tokens.json`, then run `npm run build`. Never edit `tokens.css` by hand.
- The PowerPoint kit is generated. Change `kits/pptx/generate.cjs` or the tokens, then run `npm run kit`. Never edit the `.pptx` files by hand.
- Every colour token keeps a light and a dark value and a usage note that names the grounds it reads on and the contrast ratio. Text holds 4.5:1 on those grounds in both themes.
- Copy follows [docs/brand.md](docs/brand.md): sentence case, exact names in mono, no em dashes or en dashes, no marketing language.
- Diagrams follow [docs/diagrams.md](docs/diagrams.md): fill means ownership.
- Names follow [docs/naming.md](docs/naming.md).
- Record a decision that changes these rules as a new file in `docs/adr/`.
- Before opening a pull request: `npm run build && npm run check && npm run kit`, and commit the regenerated files.
