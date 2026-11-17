# Naming

How to write KubeSwift's names in slides, docs, code samples and the console. The kinds, groups and short names below are taken from the CRDs in [kubeswift-io/kubeswift](https://github.com/kubeswift-io/kubeswift) (`config/crd/bases`).

## The project

- **KubeSwift**: one word, capital K and capital S. Never "Kubeswift", "Kube Swift", "Kube-Swift" or "KS" in running text.
- **kubeswift** in lowercase only where the context is lowercase: the GitHub organisation (`kubeswift-io`), repository and image names, hostnames, API groups (`*.kubeswift.io`), Helm release and namespace names (`kubeswift-system`).
- The one-line description: "Kubernetes-native VM orchestration on Cloud Hypervisor". Use it as written.

## Kinds

Write a kind exactly as the API defines it, in PascalCase and in mono, with no plural "s" glued on: "three `SwiftGuest` resources", not "three SwiftGuests". Short names (`sg`, `sgpool`) are for commands only; never use them in prose or on a diagram node.

There are 22 kinds, all `v1alpha1`, across ten API groups. Every kind carries the `Swift` prefix except `Cluster`; write it as "`Cluster` (fleet)" wherever a Kubernetes reader could take it for a core concept.

| Kind | Short | API group | Scope | Purpose |
| --- | --- | --- | --- | --- |
| `SwiftGuest` | `sg` | `swift.kubeswift.io` | Namespaced | A VM instance |
| `SwiftGuestClass` | `sgc` | `swift.kubeswift.io` | Cluster | CPU, memory and disk template |
| `SwiftGuestPool` | `sgpool` | `swift.kubeswift.io` | Namespaced | Fleet of identical VMs |
| `SwiftVolumeAttachment` | `sva` | `swift.kubeswift.io` | Namespaced | A PVC hot-plugged into a running guest |
| `SwiftImage` | `si` | `image.kubeswift.io` | Namespaced | Disk image source |
| `SwiftSeedProfile` | `ssp` | `seed.kubeswift.io` | Namespaced | cloud-init (NoCloud) config |
| `SwiftKernel` | `sk` | `kernel.kubeswift.io` | Namespaced | Kernel and initramfs OCI artifact |
| `SwiftGPUProfile` | `sgp` | `gpu.kubeswift.io` | Namespaced | GPU passthrough request (native backend) |
| `SwiftGPUNode` | `sgn` | `gpu.kubeswift.io` | Cluster | Per-node GPU inventory |
| `SwiftSnapshot` | `ssnap` | `snapshot.kubeswift.io` | Namespaced | VM snapshot, disk or memory and disk |
| `SwiftRestore` | `srst` | `snapshot.kubeswift.io` | Namespaced | Restore from a snapshot |
| `SwiftSnapshotSchedule` | `sss` | `snapshot.kubeswift.io` | Namespaced | Cron-scheduled snapshots with keep-last retention |
| `SwiftMigration` | `smig` | `migration.kubeswift.io` | Namespaced | Move a guest between nodes |
| `SwiftSandbox` | `sbox` | `sandbox.kubeswift.io` | Namespaced | Ephemeral OCI-rootfs microVM |
| `SwiftSandboxPool` | `sboxpool` | `sandbox.kubeswift.io` | Namespaced | Warm pool of pre-booted sandboxes |
| `SwiftArtifactPlacement` | `sap` | `sandbox.kubeswift.io` | Namespaced | OCI artifacts prepared on a warm pool's nodes |
| `SwiftArtifactVerificationPolicy` | `savp` | `sandbox.kubeswift.io` | Cluster | Which keys and signed claims artifacts must carry |
| `SwiftArtifactExportPolicy` | `saep` | `sandbox.kubeswift.io` | Cluster | Where sandbox outputs may be pushed, with which credentials |
| `Cluster` | `ksc` | `fleet.kubeswift.io` | Namespaced | Member cluster federated by the gateway hub |
| `SwiftClusterStorageLocation` | `csloc` | `storage.kubeswift.io` | Cluster | Registry for pushed artifacts, set once for the cluster |
| `SwiftStorageLocation` | `sloc` | `storage.kubeswift.io` | Namespaced | A namespace's own registry, overriding the cluster's |

On slides, write the API version the code serves today (`v1alpha1`). Do not round it up.

A kind that is planned but not in the API yet is not written in mono and not drawn as a CRD node; describe it in words until it ships.

## Components and tools

Lowercase, in mono, as typed:

| Name | What it is |
| --- | --- |
| `swiftctl` | The command-line tool: console, SSH, lifecycle, describe, `swiftctl image publish` |
| `controller-manager` | The KubeSwift controllers |
| `swiftletd` | The per-guest agent in the launcher Pod |
| `kubeswift-gateway` | The fleet hub the console talks to; federates member `Cluster` resources |
| `kubeswift-ui` | The console's image and repository. In prose: "the KubeSwift console" |
| `kubeswift-dra-driver` | The Kubernetes DRA driver for GPU allocation |
| `gpu-discovery` | The DaemonSet that fills `SwiftGPUNode` |
| `kubeswift-guest-agent` | The in-guest agent |

## Terms

- **launcher Pod**: the Pod that runs one guest's hypervisor. Lowercase "launcher", capital "Pod".
- **SwiftGPU**: the native GPU allocation backend (discovery plus profiles), as opposed to Kubernetes DRA.
- **warm pool**: a `SwiftSandboxPool`'s pre-booted slots; **checkout** takes one.
- **disk boot** and **direct kernel boot**: the two boot paths, lowercase.

## Third-party names

Write other projects as they write themselves: Kubernetes, Cloud Hypervisor, QEMU, Flux, Flux Operator, OCI, ORAS, Zot, cosign, Multus, OVN-Kubernetes, Kube-OVN, Keycloak, KubeVirt, Kata Containers, Firecracker, NVIDIA DRA. Do not abbreviate Kubernetes to "k8s" on slides.

## Writing rules

- Kinds, fields, commands, versions, phases and hostnames go in mono. Product and project names go in the sans face.
- Field paths are written as in YAML: `spec.replicas`, `SwiftGuestPool.spec.service`.
- Phases are written as the API reports them, in mono: `Pending`, `Importing`, `Ready`. Their colours are in [status.md](status.md).
