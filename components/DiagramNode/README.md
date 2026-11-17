# DiagramNode

A box in an architecture diagram. Its fill says who owns the thing it names; see the Diagrams section for the full rules.

- Provide: a title (`.ks-node-title`) and optionally one subtitle line (`.ks-node-sub`).
- Variants: no class for a neutral resource; `.ks-teal` for anything KubeSwift owns; `.ks-blue` for Kubernetes and other projects; `.ks-strong` for the one thing the diagram converges on (at most one per diagram); `.ks-dashed` for an in-progress state or an imperative action.
- Connectors: straight `.ks-arrow` lines with an open head, in `stroke`.
- Groups: `.ks-group` with a lowercase mono `.ks-group-label`, one level deep.
- Do snap nodes to the 48px grid. Don't tell two nodes apart by teal versus blue alone when the difference matters; add a subtitle or a label.
