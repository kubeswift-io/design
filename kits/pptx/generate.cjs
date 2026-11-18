// KubeSwift diagram kit: editable PowerPoint shapes. Every colour is read from tokens/tokens.json,
// and the grid and logo images are rendered from the tokens at build time (see lib.cjs).
// Usage: node kits/pptx/generate.cjs            (writes both variants next to this file)
//        node kits/pptx/generate.cjs light out.pptx
const pptxgen = require('pptxgenjs');
const path = require('path');
const { L, D, markPng, gridPng, SANS, MONO, HAND, G, g, X0, XW, XR, makeHelpers, write } = require('./lib.cjs');

async function build(VARIANT, OUT) {
const P0 = VARIANT === 'dark' ? D : L;   // content slides
const PN = D;                             // navy slides (title, divider) in both variants
const IMG = {
  grid: await gridPng(P0.bg, P0.grid),
  markContent: await markPng(P0['brand-ink']),
  markNavy: await markPng(D['brand-ink']),
};


const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace: SANS, bodyFontFace: SANS };
pres.title = 'KubeSwift diagram kit';
pres.author = 'KubeSwift';

pres.defineSlideMaster({
  title: 'KS Content',
  background: { data: IMG.grid },
  objects: [
    { image: { x: 11.30, y: 0.62, w: 0.26, h: 0.26, data: IMG.markContent } },
    { placeholder: { options: { name: 'eyebrow', type: 'body', x: X0, y: 0.6, w: 8.5, h: 0.3, fontFace: MONO, fontSize: 12, color: P0.accent, charSpacing: 2, margin: 0, valign: 'middle' }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: X0, y: 1.0, w: XW, h: 0.75, fontFace: SANS, fontSize: 32, bold: true, color: P0.ink, margin: 0, valign: 'middle', align: 'left' }, text: '' } },
  ],
});
pres.defineSlideMaster({ title: 'KS Navy', background: { color: PN.navy }, objects: [] });

const { T, header, node, arrow, group, mlabel, caption, rule, tag, ann, curvedPointer, takeaway, code, freeform, hexMotif } = makeHelpers(pres, VARIANT);
function slide(layout, notes) { const s = pres.addSlide({ masterName: layout }); if (notes) s.addNotes(notes); return s; }

// =====================================================================
// 1. Title (KCD UK title composition)
{
  const P = PN;
  const s = slide('KS Navy', 'Title slide of the kit. The composition is the KubeSwift title slide: logo top-left, mono eyebrow in teal, display title, subtitle, footer, outlined hexagon bleeding off the right edge. Duplicate this slide to start a deck.');
  hexMotif(s, P);
  s.addImage({ data: IMG.markNavy, x: X0, y: 0.833, w: 0.444, h: 0.444, altText: 'KubeSwift logo' });
  T(s, [{ text: 'Kube', options: { color: P.ink } }, { text: 'Swift', options: { color: P.teal, bold: true } }], { x: 1.42, y: 0.8, w: 2.5, h: 0.5, fontSize: 22, valign: 'middle', objectName: 'Logo wordmark' });
  T(s, 'KUBESWIFT DESIGN SYSTEM', { x: X0, y: 2.2, w: 8, h: 0.3, fontFace: MONO, fontSize: 13, color: P.teal, charSpacing: 2.3, valign: 'middle' });
  T(s, 'Diagram kit', { x: X0, y: 2.6, w: 8.0, h: 1.2, fontSize: 68, bold: true, color: P.ink, valign: 'middle' });
  T(s, `Editable shapes for architecture slides, ${VARIANT} theme.\nCopy a shape, paste it, retitle it.`, { x: X0, y: 4.0, w: 7.4, h: 0.85, fontSize: 19, color: P.muted, lineSpacingMultiple: 1.2 });
  T(s, 'Colours from tokens.json · 48px blueprint grid · 1.5pt strokes', { x: X0, y: 6.3, w: 8, h: 0.35, fontFace: MONO, fontSize: 13, color: P.muted, charSpacing: 0.8, valign: 'middle' });
}

// =====================================================================
// 2. Ownership
{
  const P = P0;
  const s = slide('KS Content', 'The fill of a node says who owns the thing it names. Use at most one convergence-point node per diagram. Every node is one shape: the text lives inside it, so moving it moves the label. Shapes are named in the Selection Pane by role.');
  header(s, P, '01 · OWNERSHIP', 'Fill means ownership.');
  const items = [
    ['teal', 'KubeSwift controller', 'reconciles guests', 'tint-teal', 'KubeSwift owns it', 'controllers, SwiftGuestPool, swiftletd'],
    ['blue', 'Flux', 'applies manifests', 'tint-blue', 'Kubernetes or another project owns it', 'Flux, kube-scheduler, OCIRepository'],
    ['strong', 'Kubernetes API', 'SwiftGuestPool', 'accent-fill', 'Everything converges on it', 'the API, Cloud Hypervisor, the VM'],
    ['none', 'OCI config', null, 'outline', 'A neutral resource or input', 'a Service, a Pod, an artifact'],
    ['dashed', 'Importing', 'in progress', 'dashed', 'In progress, a group, or imperative', 'Importing, kubectl drain'],
  ];
  const w = g(6), gap = g(1), x0 = g(3);
  items.forEach(([k, t, sub, tokn, meaning, ex], i) => {
    const x = x0 + i * (w + gap);
    node(s, P, x, g(8), w, g(3), t, { kind: k === 'dashed' ? 'none' : k, dashed: k === 'dashed', sub });
    mlabel(s, P, tokn.toUpperCase(), x, g(11) + 0.2, w);
    caption(s, P, meaning, x, g(11) + 0.55, w, 0.75, { color: P.ink, size: 14 });
    caption(s, P, ex, x, g(11) + 1.4, w, 0.55, { color: P.muted, size: 12 });
  });
  takeaway(s, P, 'One convergence point per diagram. Two equally central things mean two messages: split the slide.');
}

// =====================================================================
// 3. Node sizes
{
  const P = P0;
  const s = slide('KS Content', 'Three node sizes. Widths and heights are whole grid cells (48px, 0.333in), so nodes snap to the blueprint grid. Large: 17pt title and a 13pt second line. Medium: 17pt title only. Small: 15pt title for dense diagrams with six or more nodes.');
  header(s, P, '01 · NODE SIZES', 'Three sizes, snapped to the grid.');
  const rows = [
    ['L · TWO LINES', g(8), g(8), g(3), 17, true],
    ['M · ONE LINE', g(13), g(7), g(2), 17, false],
    ['S · DENSE', g(17), g(6), g(1.5), 15, false],
  ];
  const cols = [['teal', 'SwiftGuestPool', 'fleet desired state'], ['blue', 'kube-scheduler', 'places the launcher Pod'], ['none', 'Launcher Pod', 'swiftletd + VM runtime']];
  rows.forEach(([lab, y, w, h, ts, two]) => {
    mlabel(s, P, lab, X0, y + h / 2 - 0.14, 2.2);
    cols.forEach(([k, t, sub], i) => {
      node(s, P, g(9) + i * g(9), y, w, h, t, { kind: k, sub: two ? sub : null, tsize: ts });
    });
  });
  T(s, `${'L'}  8 × 3 cells    M  7 × 2 cells    S  6 × 1.5 cells    gap ≥ 1 cell`, { x: g(9), y: g(19.2), w: 9, h: 0.3, fontFace: MONO, fontSize: 11, color: P.muted, valign: 'middle', objectName: 'Size legend' });
}

// =====================================================================
// 4. Connectors
{
  const P = P0;
  const s = slide('KS Content', 'Connectors are straight or orthogonal lines at 1.5pt with an open arrowhead at the target. One arrow per relationship: show a loop as two arrows with labels, never a two-headed arrow. Fan-out uses a stem, a bar and one arrow into each target.');
  header(s, P, '02 · CONNECTORS', 'Straight or orthogonal. One arrow per relationship.');
  // panel A straight
  mlabel(s, P, 'STRAIGHT', X0, g(6.5), 4);
  node(s, P, g(3), g(8), g(6), g(2), 'OCI config');
  arrow(s, P, g(9), g(9), g(12), g(9));
  node(s, P, g(12), g(8), g(6), g(2), 'Flux', { kind: 'blue' });
  // panel B orthogonal
  mlabel(s, P, 'ORTHOGONAL', g(21), g(6.5), 4);
  node(s, P, g(21), g(8), g(6), g(2), 'Kubernetes API', { kind: 'strong' });
  arrow(s, P, g(24), g(10), g(24), g(12), { noHead: true });
  arrow(s, P, g(24), g(12), g(30), g(12));
  node(s, P, g(30), g(11), g(6), g(2), 'Controller', { kind: 'teal' });
  // panel C fan-out
  mlabel(s, P, 'FAN-OUT', X0, g(14), 4);
  node(s, P, g(8), g(15), g(6), g(1.5), 'OCI Registry', { kind: 'strong', tsize: 15 });
  arrow(s, P, g(11), g(16.5), g(11), g(17.25), { noHead: true });
  arrow(s, P, g(5.25), g(17.25), g(16.75), g(17.25), { noHead: true });
  [[g(2.75), 'Config bundle', 'blue'], [g(8.5), 'Golden VM disk', 'teal'], [g(14.25), 'Kernel', 'teal']].forEach(([x, t, k]) => {
    arrow(s, P, x + g(2.5), g(17.25), x + g(2.5), g(18));
    node(s, P, x, g(18), g(5), g(1.5), t, { kind: k, tsize: 13 });
  });
  // panel D two relationships
  mlabel(s, P, 'TWO RELATIONSHIPS, TWO ARROWS', g(21), g(14), 5);
  node(s, P, g(21), g(15.5), g(5), g(3), 'Kubernetes API', { kind: 'strong', tsize: 15 });
  node(s, P, g(31), g(15.5), g(5), g(3), 'Controller', { kind: 'teal', tsize: 15 });
  arrow(s, P, g(31), g(16.5), g(26), g(16.5));
  arrow(s, P, g(26), g(17.5), g(31), g(17.5));
  T(s, 'watches spec', { x: g(26), y: g(16.5) - 0.32, w: g(5), h: 0.28, fontFace: MONO, fontSize: 11, color: P.accent, align: 'center', valign: 'middle', objectName: 'Connector label' });
  T(s, 'writes status', { x: g(26), y: g(17.5) + 0.05, w: g(5), h: 0.28, fontFace: MONO, fontSize: 11, color: P.accent, align: 'center', valign: 'middle', objectName: 'Connector label' });
}

// =====================================================================
// 5. Groups and annotations
{
  const P = P0;
  const s = slide('KS Content', 'Group frames are dashed, in the accent colour, with a lowercase mono label inside the top-left corner. One level of nesting at most. Annotations are the speaker\'s asides in Architects Daughter, rotated about -3 degrees, two per slide at most. Close a diagram with a takeaway line when it needs one.');
  header(s, P, '03 · GROUPS AND ANNOTATIONS', 'Frame what belongs together. Annotate sparingly.');
  group(s, P, g(3), g(6.5), g(9), g(10), 'reconciles configuration');
  node(s, P, g(4.5), g(8.5), g(6), g(2), 'OCI config');
  arrow(s, P, g(7.5), g(10.5), g(7.5), g(12.5));
  node(s, P, g(4.5), g(12.5), g(6), g(2.5), 'Flux', { kind: 'blue', tsize: 20 });
  arrow(s, P, g(10.5), g(13.75), g(15), g(13.75));
  node(s, P, g(15), g(12.5), g(8), g(2.5), 'Kubernetes API', { kind: 'strong', tsize: 20 });
  ann(s, P, 'same CRDs, no special Flux integration', g(16), g(7.5), g(14), 0.5, -3);
  curvedPointer(s, P, g(18), g(9.2), g(1.5), g(3));
  group(s, P, g(25.5), g(9.5), g(11), g(7), 'reconciles VM execution');
  arrow(s, P, g(23), g(13.75), g(27), g(13.75));
  node(s, P, g(27), g(12.5), g(8), g(2.5), 'KubeSwift controller', { kind: 'teal' });
  takeaway(s, P, 'Takeaway line: a rule across the content width and one sentence in bold.', 6.45);
}

// =====================================================================
// 6. Labels: tags and column headers
{
  const P = P0;
  const s = slide('KS Content', 'Tags are uppercase mono labels. Filled teal for the one status that matters most on the slide; outline for a neutral fact; dashed for early or experimental. Column headers are a rule in ink, an uppercase mono label in accent, an optional tag, then body copy.');
  header(s, P, '04 · LABELS', 'Tags and column headers.');
  const tags = [['fill', 'KEY STATUS', 'filled · the one status that matters'], ['outline', 'NEUTRAL FACT', 'outline · a version, a platform'], ['dashed', 'EARLY', 'dashed · early or experimental']];
  let x = X0;
  tags.forEach(([k, t, cap]) => {
    tag(s, P, t, x, g(6.5), { kind: k });
    caption(s, P, cap, x, g(6.5) + 0.42, 3.5, 0.3, { size: 12, color: P.muted });
    x += 3.9;
  });
  const cols = [
    ['VMS & HYPERVISORS', 'CLOUD HYPERVISOR', 'outline', ['Disk-boot Linux and Windows VMs', 'Direct-kernel boot and OCI sandboxes', 'QEMU where needed']],
    ['KUBERNETES API & FLEETS', 'V1ALPHA1', 'fill', ['SwiftGuest / SwiftGuestPool CRDs', 'Controller-managed VMs in launcher Pods', 'Services, scheduling and kubectl']],
    ['ARTIFACTS & HARDWARE', 'OCI', 'outline', ['Golden VM disks and kernels via OCI', 'GPU passthrough: native or DRA', 'The swiftctl CLI']],
  ];
  const cw = (XW - 2 * 0.4) / 3;
  cols.forEach(([lab, t, k, items], i) => {
    const cx = X0 + i * (cw + 0.4), y = g(10.5);
    rule(s, P, cx, y, cw, true);
    mlabel(s, P, lab, cx, y + 0.14, cw);
    tag(s, P, t, cx, y + 0.52, { kind: k, size: 10 });
    T(s, items.map((it, j) => ({ text: it, options: { breakLine: j < items.length - 1, paraSpaceAfter: 6 } })), { x: cx, y: y + 1.05, w: cw, h: 1.4, fontSize: 15, color: P.sub, objectName: 'Column body' });
  });
}

// =====================================================================
// 7. Code
{
  const P = P0;
  const s = slide('KS Content', 'Code panels: 10 to 14 lines of real code at 14pt. Highlight the one line the slide is about and colour its value teal. Shell panels drop the line numbers and use a teal $ prompt.');
  header(s, P, '05 · CODE', 'One panel, one highlighted line.');
  mlabel(s, P, 'YAML', X0, g(5.8), 3);
  code(s, P, X0, g(6.8), 6.6, 4.3, [
    [['apiVersion: ', 'k'], ['swift.kubeswift.io/v1alpha1', 'i']],
    [['kind: ', 'k'], ['SwiftGuestPool', 'i']],
    [['metadata: ', 'k'], ['{ name: web, namespace: workloads }', 'i']],
    [['spec:', 'k']],
    [['  replicas: ', 'k'], ['5', 'v']],
    [['  updateStrategy: ', 'k'], ['{ type: RollingUpdate }', 'i']],
    [['  template:', 'k']],
    [['    spec:', 'k']],
    [['      guestClassRef: ', 'k'], ['{ name: web-small }', 'i']],
    [['      imageRef: ', 'k'], ['{ name: web-v1 }', 'i']],
  ], { hl: [4], lh: 0.36, top: 0.35 });
  mlabel(s, P, 'SHELL', 8.0, g(5.8), 3);
  code(s, P, 8.0, g(6.8), XR - 8.0, 1.75, [
    [['$ ', 'p'], ['kubectl get swiftguests', 'i']],
    [['$ ', 'p'], ['flux get sources oci', 'i']],
    [['$ ', 'p'], ['swiftctl', 'i']],
  ], { numbers: false, lh: 0.36, top: 0.33 });
  ann(s, P, 'one field, two more VMs', 8.0, g(14), 4.4, 0.45, -3);
  curvedPointer(s, P, 7.55, g(13.9), 0.4, 0.55);
}

// =====================================================================
// 8. States
{
  const P = P0;
  const s = slide('KS Content', 'A state timeline: write states as the API reports them. Dashed marks the in-progress state; the accent fill marks the state the system converges on. Use the takeaway line to say what the timeline means.');
  header(s, P, '06 · STATES', 'Applied is not ready.');
  rule(s, P, X0, g(6.3), XW, true);
  mlabel(s, P, 'STATE TIMELINE', X0, g(6.3) + 0.12, 4);
  const st = [['SwiftImage applied', 'none', g(8), false], ['Pending', 'none', g(6), false], ['Importing', 'none', g(6), true], ['Ready', 'strong', g(6), false]];
  let x = g(3);
  st.forEach(([t, k, w, d], i) => {
    node(s, P, x, g(8.5), w, g(2), t, { kind: k, dashed: d });
    if (i < st.length - 1) arrow(s, P, x + w, g(9.5), x + w + g(2), g(9.5));
    x += w + g(2);
  });
  rule(s, P, X0, g(12.8), XW, true);
  mlabel(s, P, 'IMPERATIVE ACTION BESIDE DESIRED STATE', X0, g(12.8) + 0.12, 6);
  node(s, P, g(3), g(15), g(8), g(2.5), 'Git / Flux', { kind: 'blue', sub: 'owns spec.replicas' });
  node(s, P, g(14), g(15), g(8), g(2.5), 'KubeSwift', { kind: 'teal', sub: 'owns observed status' });
  node(s, P, g(25), g(15), g(8), g(2.5), 'kubectl drain', { dashed: true, sub: 'an operator action' });
  takeaway(s, P, 'Gate on the state you need, not on the resource being applied.', 6.45);
}

// =====================================================================
// 9. Example: two control loops
{
  const P = P0;
  const s = slide('KS Content', 'A complete example built only from kit shapes: two group frames, five nodes, one convergence point, one annotation, a takeaway line. Duplicate it and retitle the nodes.');
  header(s, P, '07 · EXAMPLE', 'Two control loops. One Kubernetes API.');
  group(s, P, g(2.5), g(6.3), g(9.5), g(9.2), 'reconciles configuration');
  node(s, P, g(3.75), g(7.7), g(6.5), g(2), 'OCI config');
  arrow(s, P, g(7), g(9.7), g(7), g(11.5));
  node(s, P, g(3.75), g(11.5), g(6.5), g(3), 'Flux', { kind: 'blue', tsize: 20 });
  arrow(s, P, g(10.25), g(13), g(13), g(13));
  node(s, P, g(13), g(11.5), g(9), g(3), 'Kubernetes API', { kind: 'strong', tsize: 20 });
  arrow(s, P, g(17.5), g(14.5), g(17.5), g(16.25));
  node(s, P, g(13), g(16.25), g(9), g(2), 'SwiftGuest / SwiftGuestPool', { tsize: 14 });
  arrow(s, P, g(22), g(13), g(27), g(13));
  group(s, P, g(26.25), g(9.5), g(10.5), g(9.75), 'reconciles VM execution');
  node(s, P, g(27), g(11.5), g(9), g(3), 'KubeSwift controller', { kind: 'teal' });
  arrow(s, P, g(31.5), g(14.5), g(31.5), g(16.25));
  node(s, P, g(27), g(16.25), g(9), g(2), 'Pod  →  Cloud Hypervisor  →  VM', { tsize: 13 });
  ann(s, P, 'same CRDs, no special Flux integration', g(13), g(7), g(12), 0.5, -3);
  curvedPointer(s, P, g(16), g(8.6), g(1.2), g(2.6));
  takeaway(s, P, 'Flux reads OCI artifacts, then reconciles the same Kubernetes CRDs.', 6.55);
}

// =====================================================================
// 10. Example: execution path
{
  const P = P0;
  const s = slide('KS Content', 'A left-to-right chain example: four large nodes, one per ownership role, with supporting resources below as medium neutral nodes.');
  header(s, P, '07 · EXAMPLE', 'The VM becomes a Kubernetes workload.');
  const steps = [['SwiftGuestPool', 'fleet desired state', 'teal'], ['SwiftGuest', 'one guest per replica', 'teal'], ['Launcher Pod', 'swiftletd + VM runtime', 'blue'], ['Cloud Hypervisor', 'runs the virtual machine', 'strong']];
  steps.forEach(([t, sub, k], i) => {
    const x = g(3) + i * g(9);
    node(s, P, x, g(7), g(7.5), g(3), t, { kind: k, sub });
    if (i < 3) arrow(s, P, x + g(7.5), g(8.5), x + g(9), g(8.5));
  });
  rule(s, P, X0, g(12), XW, true);
  mlabel(s, P, 'SUPPORTING CRDS', X0, g(12) + 0.12, 4);
  ['SwiftGuestClass', 'SwiftImage', 'SwiftSeedProfile', 'SwiftKernel'].forEach((t, i) => node(s, P, g(3) + i * g(9), g(13.5), g(7.5), g(2), t, { tsize: 15 }));
  takeaway(s, P, 'The Pod launches the hypervisor; the guest keeps its own kernel, disk and lifecycle.', 6.3);
}

// =====================================================================
// 11. Section divider
{
  const P = PN;
  const s = slide('KS Navy', 'Section divider: navy in both deck themes, the section number in mono teal, the title in white. The number matches the eyebrows of the slides that follow.');
  T(s, '02', { x: X0, y: 2.0, w: 6, h: 1.45, fontFace: MONO, fontSize: 90, color: P.teal, valign: 'middle', objectName: 'Section number' });
  T(s, 'Section title', { x: X0, y: 3.55, w: 11, h: 1.2, fontSize: 66, bold: true, color: P.ink, valign: 'middle', objectName: 'Section title' });
  s.addImage({ data: IMG.markNavy, x: X0, y: 6.3, w: 0.33, h: 0.33, altText: 'KubeSwift logo' });
  T(s, [{ text: 'Kube', options: { color: P.ink } }, { text: 'Swift', options: { color: P.teal, bold: true } }], { x: X0 + 0.45, y: 6.27, w: 2.5, h: 0.4, fontSize: 16, valign: 'middle', objectName: 'Logo wordmark' });
}

await write(pres, OUT);
}

(async () => {
  const [variant, out] = process.argv.slice(2);
  if (variant) return build(variant, path.resolve(out || `KubeSwift-Diagram-Kit-${variant === 'dark' ? 'Dark' : 'Light'}.pptx`));
  for (const v of ['light', 'dark']) await build(v, path.join(__dirname, `KubeSwift-Diagram-Kit-${v === 'dark' ? 'Dark' : 'Light'}.pptx`));
})().catch((e) => { console.error(e); process.exit(1); });
