// KubeSwift talk template: slide layouts and one example of each, in a light and a dark version.
// Every colour is read from tokens/tokens.json (see lib.cjs). Type sizes follow the slide-* styles: px / 2 = pt.
// Usage: node kits/pptx/template.cjs                          (writes both variants next to this file)
//        node kits/pptx/template.cjs light out.pptx [talk.json]
// talk.json fills the title and closing slides: { event, date, title, subtitle, speaker, role, url, links: [] }.
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const { L, D, markPng, gridPng, qrPng, SANS, MONO, g, X0, XW, XR, makeHelpers, write } = require('./lib.cjs');

const DEFAULT_TALK = {
  event: 'Event name',
  date: '',
  title: 'Talk title, two lines at most',
  subtitle: 'One line on what the audience leaves with.',
  speaker: 'Speaker name',
  role: 'Role, organisation',
  url: 'https://github.com/kubeswift-io/kubeswift',
  links: ['github.com/kubeswift-io/kubeswift', 'kubeswift-io.github.io/design'],
};

// slide-* type styles in points
const PT = { display: 68, numeral: 90, section: 66, title: 32, subtitle: 19, body: 15, eyebrow: 12, label: 12, code: 14 };

async function build(VARIANT, OUT, TALK) {
const P0 = VARIANT === 'dark' ? D : L;   // content slides
const PN = D;                             // navy slides (title, section, closing) in both variants
const IMG = {
  grid: await gridPng(P0.bg, P0.grid),
  markContent: await markPng(P0['brand-ink']),
  markNavy: await markPng(PN['brand-ink']),
  // dark modules on a white tile: inverted codes fail on some phone cameras
  qr: await qrPng(TALK.url, PN.navy, L.surface),
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace: SANS, bodyFontFace: SANS };
pres.title = TALK.title;
pres.author = TALK.speaker;
pres.company = 'KubeSwift';

const eyebrowPh = (P, y = 0.6, w = 8.5) => ({ placeholder: { options: { name: 'eyebrow', type: 'body', x: X0, y, w, h: 0.3, fontFace: MONO, fontSize: PT.eyebrow, color: P.accent, charSpacing: 2, margin: 0, valign: 'middle' }, text: '' } });
const titlePh = (P) => ({ placeholder: { options: { name: 'title', type: 'title', x: X0, y: 1.0, w: XW, h: 0.75, fontFace: SANS, fontSize: PT.title, bold: true, color: P.ink, charSpacing: -1, margin: 0, valign: 'middle', align: 'left' }, text: '' } });
const bodyPh = (P, name, x, w) => ({ placeholder: { options: { name, type: 'body', x, y: 2.1, w, h: 4.2, fontFace: SANS, fontSize: PT.body, color: P.sub, margin: 0, valign: 'top', lineSpacingMultiple: 1.25 }, text: '' } });
const markContent = { image: { x: 11.30, y: 0.62, w: 0.26, h: 0.26, data: IMG.markContent } };

// ---- layouts: each one appears under Home > New Slide ----
pres.defineSlideMaster({
  title: 'KS Title', background: { color: PN.navy },
  objects: [
    { image: { x: X0, y: 0.833, w: 0.444, h: 0.444, data: IMG.markNavy } },
    { placeholder: { options: { name: 'eyebrow', type: 'body', x: X0, y: 2.0, w: 7.6, h: 0.3, fontFace: MONO, fontSize: 13, color: PN.teal, charSpacing: 2.3, margin: 0, valign: 'middle' }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: X0, y: 2.4, w: 7.1, h: 2.1, fontFace: SANS, fontSize: PT.display - 14, bold: true, color: PN.ink, charSpacing: -2, margin: 0, valign: 'bottom', align: 'left', lineSpacingMultiple: 0.95 }, text: '' } },
    { placeholder: { options: { name: 'subtitle', type: 'body', x: X0, y: 4.7, w: 7.4, h: 0.6, fontFace: SANS, fontSize: PT.subtitle, color: PN.muted, margin: 0, valign: 'top' }, text: '' } },
    { placeholder: { options: { name: 'speaker', type: 'body', x: X0, y: 5.9, w: 7.4, h: 0.75, fontFace: SANS, fontSize: PT.body + 1, color: PN.ink, margin: 0, valign: 'top' }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'KS Section', background: { color: PN.navy },
  objects: [
    { image: { x: X0, y: 6.3, w: 0.33, h: 0.33, data: IMG.markNavy } },
    { placeholder: { options: { name: 'number', type: 'body', x: X0, y: 2.0, w: 6, h: 1.45, fontFace: MONO, fontSize: PT.numeral, color: PN.teal, margin: 0, valign: 'middle' }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: X0, y: 3.55, w: XW, h: 1.2, fontFace: SANS, fontSize: PT.section, bold: true, color: PN.ink, charSpacing: -3, margin: 0, valign: 'middle', align: 'left' }, text: '' } },
  ],
});
pres.defineSlideMaster({ title: 'KS Content', background: { data: IMG.grid }, objects: [markContent, eyebrowPh(P0), titlePh(P0), bodyPh(P0, 'body', X0, XW)] });
pres.defineSlideMaster({ title: 'KS Two Columns', background: { data: IMG.grid }, objects: [markContent, eyebrowPh(P0), titlePh(P0), bodyPh(P0, 'left', X0, 5.5), bodyPh(P0, 'right', X0 + 6.17, 5.5)] });
pres.defineSlideMaster({ title: 'KS Title Only', background: { data: IMG.grid }, objects: [markContent, eyebrowPh(P0), titlePh(P0)] });
pres.defineSlideMaster({ title: 'KS Closing', background: { color: PN.navy }, objects: [{ image: { x: X0, y: 0.833, w: 0.444, h: 0.444, data: IMG.markNavy } }] });

const { T, wordmark, header, node, arrow, mlabel, caption, rule, ann, curvedPointer, takeaway, code, hexMotif } = makeHelpers(pres, VARIANT);
function slide(layout, notes) { const s = pres.addSlide({ masterName: layout }); if (notes) s.addNotes(notes); return s; }
const mono = (text, P) => ({ text, options: { fontFace: MONO, color: P.ink, fontSize: PT.body - 1 } });

// =====================================================================
// 1. Title
{
  const P = PN;
  const s = slide('KS Title', 'Title slide. Navy in both themes, with the outlined hexagon bleeding off the right edge. Eyebrow: the event and date in mono caps. Title: sentence case, two lines at most. Subtitle: one line. Speaker: name, then role and organisation.');
  hexMotif(s, P);
  wordmark(s, P, 1.42, 0.8, 2.5, 0.5, 22, P.teal);
  s.addText([TALK.event, TALK.date].filter(Boolean).join(' · ').toUpperCase(), { placeholder: 'eyebrow' });
  s.addText(TALK.title, { placeholder: 'title' });
  s.addText(TALK.subtitle, { placeholder: 'subtitle' });
  s.addText([
    { text: TALK.speaker, options: { bold: true, color: P.ink, breakLine: true } },
    { text: TALK.role, options: { color: P.muted, fontSize: PT.body } },
  ], { placeholder: 'speaker' });
}

// =====================================================================
// 2. Agenda
{
  const P = P0;
  const s = slide('KS Title Only', 'Agenda: one row per section, numbered like the section dividers. Four or five rows; more means the talk has too many sections for its slot.');
  header(s, P, '00 · AGENDA', 'What this talk covers');
  const rows = [
    ['01', 'The problem', 'What operators do today, and where it breaks.'],
    ['02', 'Architecture', 'The controllers, the API and the launcher Pod.'],
    ['03', 'Demo', 'A guest from apply to Running.'],
    ['04', 'What is next', 'Open work, and where to help.'],
  ];
  const y0 = 2.15, rh = 0.95;
  rows.forEach(([n, t, d], i) => {
    const y = y0 + i * rh;
    rule(s, P, X0, y, XW, i === 0);
    T(s, n, { x: X0, y: y + 0.2, w: 1.0, h: 0.55, fontFace: MONO, fontSize: 24, color: P.accent, valign: 'middle', objectName: `Agenda number ${n}` });
    T(s, t, { x: X0 + 1.2, y: y + 0.2, w: 4.2, h: 0.55, fontSize: 22, bold: true, color: P.ink, valign: 'middle', objectName: `Agenda title ${n}` });
    T(s, d, { x: X0 + 5.6, y: y + 0.2, w: XW - 5.6, h: 0.55, fontSize: PT.body, color: P.sub, valign: 'middle', objectName: `Agenda detail ${n}` });
  });
  rule(s, P, X0, y0 + rows.length * rh, XW, false);
}

// =====================================================================
// 3. Section divider
{
  const P = PN;
  const s = slide('KS Section', 'Section divider: navy in both themes. The number is mono teal and matches the eyebrows of the slides that follow (01 · LABEL).');
  s.addText('01', { placeholder: 'number' });
  s.addText('Section title', { placeholder: 'title' });
  wordmark(s, P, X0 + 0.45, 6.27, 2.5, 0.4, 16, P.teal);
}

// =====================================================================
// 4. Content with a list
{
  const P = P0;
  const s = slide('KS Content', 'Content slide with a list. The title states the message as a sentence. Three to five items; past five, split the slide. Commands, kinds and fields go in mono.');
  header(s, P, '01 · LABEL', 'One message per slide, written as a sentence');
  // paragraph options go on the first run only: pptxgenjs starts a new paragraph at every run that has a bullet
  const b = (runs, last) => runs.map((r, i) => {
    const o = Object.assign({}, r.options || {});
    if (i === 0) Object.assign(o, { bullet: { indent: 18 }, paraSpaceAfter: 10 });
    if (i === runs.length - 1 && !last) o.breakLine = true;
    return { text: r.text, options: o };
  });
  const items = [
    [{ text: 'Lead with the job the operator is doing, then the mechanism.' }],
    [{ text: 'Show the command when it can be typed: ' }, mono('kubectl get swiftguests', P)],
    [{ text: 'Write kinds as the API names them: ' }, mono('SwiftGuestPool', P), { text: ', not "guest pools".' }],
    [{ text: 'Numbers carry a unit and a source.' }],
  ];
  s.addText(items.flatMap((it, i) => b(it, i === items.length - 1)), { placeholder: 'body' });
  takeaway(s, P, 'A takeaway line closes the slide when it needs one.');
}

// =====================================================================
// 5. Two columns
{
  const P = P0;
  const s = slide('KS Two Columns', 'Two columns compare two things. Each column has a mono label over a 1pt ink rule; rows are separated by hairline rules. Keep the rows parallel: row two on the left answers row two on the right.');
  header(s, P, '01 · COMPARISON', 'Resource applied is not VM ready');
  const cols = [
    ['RESOURCE APPLIED', ['The API server stored the SwiftGuest', 'kubectl apply returned 0', 'Flux reports the Kustomization ready']],
    ['VM READY', ['The launcher Pod is scheduled and running', 'Cloud Hypervisor booted the guest', 'The SwiftGuest reports Running']],
  ];
  cols.forEach(([lab, rows], c) => {
    const x = X0 + c * 6.17, w = 5.5;
    mlabel(s, P, lab, x, 2.0, w, { size: PT.label });
    rule(s, P, x, 2.4, w, true);
    rows.forEach((r, i) => {
      const y = 2.4 + i * 0.85;
      T(s, r, { x, y: y + 0.15, w, h: 0.55, fontSize: 17, color: P.ink, valign: 'middle', objectName: `Row ${c + 1}.${i + 1}` });
      rule(s, P, x, y + 0.85, w, false);
    });
  });
  takeaway(s, P, 'Git owns the outcome. The controller reports whether it happened.');
}

// =====================================================================
// 6. Diagram
{
  const P = P0;
  const s = slide('KS Title Only', 'Diagram slide. Copy nodes, arrows and annotations from the diagram kit (KubeSwift-Diagram-Kit). Fill says ownership: tint-teal KubeSwift, tint-blue Kubernetes or another project, accent fill for the one convergence point, outline for neutral resources. Snap edges to the grid.');
  header(s, P, '02 · ARCHITECTURE', 'Diagrams stay editable shapes');
  const y = g(9), h = g(3), w = g(8);
  const nodes = [['Flux', 'blue', 'applies manifests'], ['Kubernetes API', 'strong', 'SwiftGuest'], ['controller-manager', 'teal', 'reconciles guests'], ['launcher Pod', 'none', 'Cloud Hypervisor']];
  nodes.forEach(([t, k, sub], i) => {
    const x = X0 + i * g(9);
    node(s, P, x, y, w, h, t, { kind: k, sub, tsize: 15 });
    if (i < nodes.length - 1) arrow(s, P, x + w, y + h / 2, x + g(9), y + h / 2);
  });
  ann(s, P, 'one convergence point per diagram', g(10), g(14.3), 4.6, 0.45, -3);
  curvedPointer(s, P, g(14.6), g(12.4), 0.5, 0.75);
  takeaway(s, P, 'Every node is one shape with its text inside, so it moves as a unit.');
}

// =====================================================================
// 7. Code
{
  const P = P0;
  const s = slide('KS Title Only', 'Code slide. 10 to 14 lines at 14pt, the one line that matters highlighted. Use the exact apiVersion and field names the API serves. The explanation on the right says what that line does.');
  header(s, P, '02 · API', 'One field decides whether the guest runs');
  code(s, P, X0, g(6), 6.6, 5.25, [
    [['apiVersion: ', 'k'], ['swift.kubeswift.io/v1alpha1', 'i']],
    [['kind: ', 'k'], ['SwiftGuest', 'i']],
    [['metadata:', 'k']],
    [['  name: ', 'k'], ['sample', 'i']],
    [['  namespace: ', 'k'], ['default', 'i']],
    [['spec:', 'k']],
    [['  imageRef:', 'k']],
    [['    name: ', 'k'], ['ubuntu-noble', 'i']],
    [['  guestClassRef:', 'k']],
    [['    name: ', 'k'], ['default', 'i']],
    [['  seedProfileRef:', 'k']],
    [['    name: ', 'k'], ['minimal', 'i']],
    [['  runPolicy: ', 'k'], ['Running', 'v']],
  ], { hl: [12], lh: 0.36, top: 0.3 });
  const x = 8.0, w = XR - 8.0;
  mlabel(s, P, 'LINE 13', x, g(6), w, { size: PT.label });
  rule(s, P, x, g(6) + 0.4, w, true);
  T(s, [{ text: 'runPolicy', options: { fontFace: MONO, color: P.ink } }, { text: ' is the desired run state: Running, Stopped, RestartOnFailure or Always. The image, class and seed profile describe the guest; this line decides whether it runs.' }],
    { x, y: g(6) + 0.6, w, h: 2.0, fontSize: 17, color: P.sub, lineSpacingMultiple: 1.25, objectName: 'Code explanation' });
  T(s, 'From config/samples/disk-boot in kubeswift-io/kubeswift.', { x, y: g(6) + 2.8, w, h: 0.6, fontSize: 13, color: P.muted, lineSpacingMultiple: 1.15, objectName: 'Code source' });
}

// =====================================================================
// 8. Statement with a number
{
  const P = P0;
  const s = slide('KS Title Only', 'Number slide. One number in accent at display size, its unit and meaning in one line, and the source underneath. Use it for the one figure the audience should repeat.');
  header(s, P, '02 · SCOPE', 'One number, its unit and its source');
  T(s, '22', { x: X0, y: 2.0, w: 4.2, h: 2.4, fontSize: 150, bold: true, color: P.accent, charSpacing: -6, valign: 'middle', objectName: 'Stat number' });
  T(s, 'custom resource kinds, all v1alpha1, across ten API groups', { x: X0 + 4.4, y: 2.55, w: 6.9, h: 1.3, fontSize: 28, bold: true, color: P.ink, charSpacing: -0.5, valign: 'middle', lineSpacingMultiple: 1.05, objectName: 'Stat meaning' });
  rule(s, P, X0, 4.75, XW, false);
  T(s, [{ text: 'Source: ' }, { text: 'config/crd/bases', options: { fontFace: MONO, color: P.sub } }, { text: ' in kubeswift-io/kubeswift' }],
    { x: X0, y: 4.9, w: XW, h: 0.4, fontSize: 14, color: P.muted, valign: 'middle', objectName: 'Stat source' });
}

// =====================================================================
// 9. Demo
{
  const P = P0;
  const s = slide('KS Title Only', 'Demo slide. Show the commands you are about to run, in the order you run them, so the audience can follow if the terminal font is small. Keep a recording one click away and say so on the slide.');
  header(s, P, '03 · DEMO', 'Watch a guest go from apply to Running');
  mlabel(s, P, 'SHELL', X0, g(6), 3, { size: PT.label });
  code(s, P, X0, g(6) + 0.4, 7.4, 2.5, [
    [['$ ', 'p'], ['kubectl apply -f swiftguest-sample.yaml', 'i']],
    [['$ ', 'p'], ['kubectl get swiftguests -w', 'i']],
    [['$ ', 'p'], ['swiftctl console sample', 'i']],
  ], { numbers: false, lh: 0.5, top: 0.45, size: 16 });
  const x = X0 + 8.0, w = XR - x;
  mlabel(s, P, 'IF THE DEMO FAILS', x, g(6), w, { size: PT.label });
  rule(s, P, x, g(6) + 0.4, w, true);
  caption(s, P, 'A recording of the same steps is linked in the speaker notes. Switch to it after one retry.', x, g(6) + 0.6, w, 1.3, { size: 15 });
}

// =====================================================================
// 10. Closing
{
  const P = PN;
  const s = slide('KS Closing', 'Closing slide: navy in both themes. Three takeaways, the links in mono, and a QR code for the slides or the repository. The QR is generated from talk.json (url); regenerate rather than pasting a new image.');
  wordmark(s, P, 1.42, 0.8, 2.5, 0.5, 22, P.teal);
  T(s, 'TAKEAWAYS', { x: X0, y: 1.9, w: 7, h: 0.3, fontFace: MONO, fontSize: 13, color: P.teal, charSpacing: 2.3, valign: 'middle', objectName: 'Closing eyebrow' });
  const tk = ['Say each takeaway as one sentence.', 'Three, in the order the talk made them.', 'Each points back to a slide they saw.'];
  tk.forEach((t, i) => {
    const y = 2.4 + i * 0.9;
    T(s, String(i + 1).padStart(2, '0'), { x: X0, y, w: 0.8, h: 0.7, fontFace: MONO, fontSize: 24, color: P.teal, valign: 'middle', objectName: `Takeaway number ${i + 1}` });
    T(s, t, { x: X0 + 0.95, y, w: 6.9, h: 0.7, fontSize: 20, bold: true, color: P.ink, valign: 'middle', objectName: `Takeaway ${i + 1}` });
  });
  rule(s, P, X0, 5.35, 7.85, false);
  T(s, TALK.links.join('\n'), { x: X0, y: 5.55, w: 7.85, h: 0.9, fontFace: MONO, fontSize: 15, color: P.ink, lineSpacingMultiple: 1.35, objectName: 'Links' });
  T(s, [{ text: TALK.speaker, options: { bold: true, color: P.ink } }, { text: '  ' + TALK.role, options: { color: P.muted } }],
    { x: X0, y: 6.55, w: 7.85, h: 0.4, fontSize: PT.body, valign: 'middle', objectName: 'Speaker' });
  const qx = 9.55, qy = 2.0, qs = 2.95;
  s.addImage({ data: IMG.qr, x: qx, y: qy, w: qs, h: qs, altText: `QR code: ${TALK.url}` });
  T(s, 'SLIDES AND CODE', { x: qx, y: qy + qs + 0.2, w: qs, h: 0.3, fontFace: MONO, fontSize: 12, color: P.teal, charSpacing: 2, align: 'center', valign: 'middle', objectName: 'QR label' });
  T(s, TALK.url.replace(/^https?:\/\//, ''), { x: qx - 0.4, y: qy + qs + 0.55, w: qs + 0.8, h: 0.3, fontFace: MONO, fontSize: 11, color: P.muted, align: 'center', valign: 'middle', objectName: 'QR url' });
}

await write(pres, OUT);
}

(async () => {
  const [variant, out, talkFile] = process.argv.slice(2);
  const TALK = Object.assign({}, DEFAULT_TALK, talkFile ? JSON.parse(fs.readFileSync(talkFile, 'utf8')) : {});
  if (variant) return build(variant, path.resolve(out || `KubeSwift-Talk-Template-${variant === 'dark' ? 'Dark' : 'Light'}.pptx`), TALK);
  for (const v of ['light', 'dark']) await build(v, path.join(__dirname, `KubeSwift-Talk-Template-${v === 'dark' ? 'Dark' : 'Light'}.pptx`), TALK);
})().catch((e) => { console.error(e); process.exit(1); });
