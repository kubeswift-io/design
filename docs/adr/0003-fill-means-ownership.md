# 0003. In diagrams, fill means ownership

Status: accepted

## Context

KubeSwift is explained mostly through architecture diagrams in talks. The decks already coloured nodes consistently without writing the rule down: teal tints for what KubeSwift reconciles, blue tints for Kubernetes and Flux, navy for the API or runtime everything converges on, dashed outlines for groups and in-progress states.

## Decision

The fill of a diagram node states who owns the thing it names, as set out in [diagrams.md](../diagrams.md): `tint-teal` for KubeSwift, `tint-blue` for Kubernetes and other projects, `accent-fill` for the single convergence point, outline only for neutral resources, dashed for groups, in-progress states and imperative actions.

## Consequences

- A diagram has at most one `accent-fill` node.
- Fill alone never carries a distinction the audience must not miss; a subtitle or label repeats it.
- The PowerPoint kit's shapes are built from these rules and named by role in the Selection Pane.
