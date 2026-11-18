# 0004. Five status colours, mapped from the API's phases

Status: accepted

## Context

The KubeSwift console colours phase chips with Angular Material defaults. Its light chip text is 3.7:1 to 4.3:1 on the chip fills, below 4.5:1 for 12px text, and `Pending` is amber on the guest page but blue on the migrations page. The design system had no status colours at all.

## Decision

- Five statuses: success, info, warning, danger, neutral. Each has a text token and a fill token, in light and dark, at 4.5:1 or better.
- Success, warning and danger keep the console's hues with darker text. Info uses brand azure on `tint-blue` instead of Material blue. Teal is never a status colour.
- Every phase of every kind maps to one status, in [status.md](../status.md). `Pending` is always warning; verb phases are always info.
- A chip always shows the phase word, so colour never carries the state alone.

## Consequences

- The console's phase chips can move to `status-*` tokens with no change in meaning except `Pending` on the migrations page.
- A new phase in the API needs a row in status.md before it ships in the console.
