# Naming

How to write KubeSwift's names in slides, docs and code samples.

## The project

- **KubeSwift**: one word, capital K and capital S. Never "Kubeswift", "Kube Swift", "Kube-Swift" or "KS" in running text.
- **kubeswift** in lowercase only where the context is lowercase: the GitHub organisation (`kubeswift-io`), repository names, hostnames, the API group (`swift.kubeswift.io`), Helm release and namespace names.
- The one-line description: "Kubernetes-native VM orchestration on Cloud Hypervisor". Use it as written.

## Kinds

Custom resource kinds are written exactly as the API defines them, in PascalCase and in mono, with no plural "s" glued on: "three `SwiftGuest` resources", not "three SwiftGuests".

| Kind | Role |
| --- | --- |
| `SwiftGuest` | One virtual machine |
| `SwiftGuestPool` | A fleet of guests with replicas and an update strategy |
| `SwiftGuestClass` | Resource shape for guests |
| `SwiftImage` | A VM disk image, imported from OCI |
| `SwiftKernel` | Kernel and initramfs for direct-kernel boot |
| `SwiftSeedProfile` | Seed configuration for guests |
| `SwiftSandbox` | A sandbox microVM |
| `SnapshotSchedule` | Recurring snapshots |
| `GPUCellPool` | GPU capacity for guests |

Most kinds carry the `Swift` prefix. `SnapshotSchedule` and `GPUCellPool` do not. Check with the API before adding a kind to a slide.

The API version on slides is the one the code serves today (`swift.kubeswift.io/v1alpha1`). Do not round it up.

## Components and tools

Lowercase, in mono, as typed:

- `swiftctl`: the command-line tool.
- `swiftletd`: the per-guest agent in the launcher Pod.
- `kubeswift-spin`: KubeSwift for edge AI.

## Third-party names

Write other projects as they write themselves: Kubernetes, Cloud Hypervisor, QEMU, Flux, Flux Operator, OCI, ORAS, Zot, KubeVirt, Kata Containers, Firecracker, NVIDIA DRA. Do not abbreviate Kubernetes to "k8s" on slides.

## Writing rules

- Kinds, fields, commands, versions and hostnames go in mono. Product and project names go in the sans face.
- Field paths are written as in YAML: `spec.replicas`, `spec.template.spec.imageRef`.
- States are written as the API reports them, in mono: `Pending`, `Importing`, `Ready`.
