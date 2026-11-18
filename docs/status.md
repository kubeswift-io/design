# Status

How a KubeSwift phase is shown: in the console, in docs and on slides. Every phase maps to one of five statuses, and each status has a text token and a fill token that hold 4.5:1 in both themes.

| Status | Tokens | Means |
| --- | --- | --- |
| success | `status-success` on `status-success-bg` | A healthy end state |
| info | `status-info` on `status-info-bg` | Work in progress that is expected to finish |
| warning | `status-warning` on `status-warning-bg` | Waiting to start, or running but partly healthy |
| danger | `status-danger` on `status-danger-bg` | Failed; needs a person |
| neutral | `status-neutral` on `status-neutral-bg` | Inactive by choice, or unknown |

## Rules

- A phase chip always shows the phase word, as the API reports it. Colour never carries the state alone: the success green and the danger red differ mainly in hue.
- `Pending` is always warning, on every kind. The verb phases (`Importing`, `Pulling`, `StopAndCopy`, `Restoring` and the rest) are always info.
- An empty phase shows a muted placeholder, not a chip.
- Teal is not a status colour. It stays the brand's speed accent and, in diagrams, the fill of what KubeSwift owns.
- In diagrams, a state timeline keeps the diagram rules: in-progress states are dashed, the converged state is `accent-fill`. Status colours are for chips, not diagram nodes.

## Phase map

Taken from the `status.phase` enums in the CRDs.

| Kind | success | info | warning | danger | neutral |
| --- | --- | --- | --- | --- | --- |
| `SwiftGuest` | `Running` | | `Pending`, `Scheduling` | `Failed` | `Stopped` |
| `SwiftImage` | `Ready` | `Importing`, `Validating`, `Preparing`, `Snapshotting` | `Pending` | `Failed` | |
| `SwiftKernel` | `Ready` | `Pulling` | `Pending` | `Failed` | |
| `SwiftMigration` | `Completed` | `Validating`, `Preparing`, `StopAndCopy`, `Resuming` | `Pending` | `Failed` | `Cancelled` |
| `SwiftSandbox` | `Running`, `Completed` | `Materializing`, `Exporting` | `Pending` | `Failed` | |
| `SwiftSandboxPool` | `Ready` | `Warming` | `Pending`, `Degraded` | | |
| `SwiftSnapshot` | `Ready` | `Capturing`, `Uploading` | `Pending` | `Failed` | |
| `SwiftRestore` | `Ready` | `Downloading`, `Restoring`, `Resuming` | `Pending` | `Failed` | |
| `SwiftVolumeAttachment` | `Attached` | `Attaching`, `Detaching` | `Pending` | `Failed` | |
| `SwiftGPUNode` | `Ready` | `Discovering` | | `Error` | |
| `SwiftSnapshotSchedule` | `Active` | | | | `Suspended` |

Kinds without a phase (`SwiftGuestPool`, `Cluster`, the policies and storage locations) report a `Ready` condition: `True` is success, `False` is danger, `Unknown` is neutral.

## The console today

The console colours phases with Angular Material defaults. Two things differ from this page:

- Its light chip text (`#1E8E3E`, `#D93025`, `#B06000`, `#1A73E8`) is 3.7:1 to 4.3:1 on its chip fills, below 4.5:1 for 12px text. The tokens keep the hues and darken the text.
- `Pending` is warning on the guest page but info on the migrations page. This page makes it warning everywhere.
