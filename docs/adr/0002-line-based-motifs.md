# 0002. KubeSwift motifs are line-based, not tiled

Status: accepted

## Context

The KubeSwift mark is a hexagon. So is the Kairos mark, and Kairos builds its visual language from filled hexagon tiles and tessellations. Both projects share a maintainer and often appear at the same events. A KubeSwift deck covered in filled hexagon tiles would read as a Kairos sub-brand.

## Decision

KubeSwift motifs are drawn with lines:

- the carved chevron, alone or as a stream of three;
- the mark as an outlined hexagon on title slides;
- the 48px blueprint grid behind content slides.

No filled hexagon tiles, honeycombs or tessellations. One motif per surface, never behind text.

## Consequences

- The chevron is the progress and loading motif; the ChevronLoader component and `chevron-stream.svg` implement it.
- New illustrations start from outlines on the blueprint grid.
