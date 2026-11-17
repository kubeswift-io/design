# StatusChip

A resource's phase, written exactly as the API reports it, in a small mono chip coloured by status. For the console's tables and drawers, docs and status slides.

- Provide: the phase text and its status, from the map in [docs/status.md](../../docs/status.md): `data-status="success" | "info" | "warning" | "danger" | "neutral"`. No `data-status` renders neutral.
- The phase word is always shown; colour never carries the state alone.
- An empty phase is a muted placeholder in plain text, not a chip.
- Don't invent phase names or merge two phases into one chip; don't use teal for a status.
