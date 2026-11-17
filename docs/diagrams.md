# Diagrams

Architecture diagrams carry most KubeSwift talks. Every diagram uses the same rules, so a reader who has seen one can read the next without a legend.

## Fill means ownership

| Fill | Token | Means | Examples |
| --- | --- | --- | --- |
| Teal tint | `tint-teal` | KubeSwift owns and reconciles it | KubeSwift controller, `SwiftGuestPool`, swiftletd |
| Blue tint | `tint-blue` | Kubernetes or another project owns it | Flux, kube-scheduler, an `OCIRepository` |
| Accent fill | `accent-fill`, text `on-accent-fill`, subtitle `accent-fill-sub` | The thing everything converges on | Kubernetes API, Cloud Hypervisor, the running VM |
| Outline only | no fill, `stroke` border | A neutral resource or input | OCI config, a Service, a Pod |
| Dashed outline | `stroke` or `accent`, dashed | A group, an in-progress state, or an imperative action | "reconciles configuration", `Importing`, a node drain |

Use at most one accent-fill node per diagram. If two things look equally central, the diagram has two messages; split it.

## Nodes

- Rounded rectangle, `radius-node`, `stroke-node` border in `stroke`.
- Title in `slide-node` (34px, 600), optional second line in `slide-node-sub` in `sub`. Centre both.
- Kind names inside nodes are written exactly (see Naming); the sans face is fine inside a node title.
- Snap node edges to the 48px grid. Keep 32px or more between nodes.

## Connectors

- Straight or orthogonal lines only, `stroke-node` in `stroke`, with an open arrowhead at the target.
- One arrow means one relationship. Do not draw a two-headed arrow; draw two arrows or name the loop.
- Fan-out: a short stem from the source, a horizontal bar, then a short arrow into each target.

## Groups

- A dashed frame in `accent` around the nodes it groups, `radius-node`, with a lowercase mono label inside its top-left corner in `accent`: "reconciles configuration".
- Groups do not nest more than one level.

## Annotations

- The speaker's aside, in `hand` (`slide-annotation`) in `accent`, rotated between -2 and -4 degrees, optionally with a short arrow in `accent` pointing at the node it is about.
- Two per slide at most. An annotation is never the only place a fact appears if the fact matters; it repeats or sharpens what the speaker says.

## Takeaway line

When a diagram needs a one-line conclusion, close the slide with a `rule` line across the content width and the sentence below it in `slide-body` at 700 in `ink`.

## PowerPoint

Diagrams in exported decks stay native shapes and connectors, never images, so a speaker can move a node or retitle it. At 13.333 in wide, divide px by 2 for points: 3px borders are 1.5pt, 34px node titles are 17pt. Arrowheads use the open "arrow" head.
