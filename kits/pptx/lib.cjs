// Shared by the PowerPoint generators (generate.cjs for the diagram kit, template.cjs for the talk template).
// Every colour is read from tokens/tokens.json; images (grid, mark, QR) are rendered from the tokens at build time.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..', '..');
const tok = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens', 'tokens.json'), 'utf8'));
const MARK_PATH = 'M50,4 L89.8,27 L89.8,73 L50,96 L10.2,73 L10.2,27 Z M34,30 L70,50 L34,70 L48,70 L54,50 L48,30 Z';

// ---- resolve colour tokens per theme (aliases included) ----
const byName = Object.fromEntries(tok.color.tokens.map((t) => [t.name, t]));
function resolve(name, theme, depth = 0) {
  const t = byName[name];
  if (!t || depth > 16) throw new Error('token ' + name);
  const v = typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value.light);
  const m = /^\{(.+)\}$/.exec(v);
  if (m) return resolve(m[1], theme, depth + 1);
  return v;
}
const hex = (v) => v.replace('#', '').toUpperCase();
function palette(theme) {
  const p = {};
  for (const t of tok.color.tokens) {
    const v = resolve(t.name, theme);
    if (v.startsWith('#')) p[t.name] = hex(v);
  }
  return p;
}
const L = palette('light'), D = palette('dark');

const png = async (svg) => 'image/png;base64,' + (await sharp(Buffer.from(svg)).png({ palette: true, compressionLevel: 9 }).toBuffer()).toString('base64');

async function markPng(color) {
  return png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512"><path fill="#${color}" fill-rule="evenodd" d="${MARK_PATH}"/></svg>`);
}
async function gridPng(bg, line) {
  // 48px pitch on a 1920 x 1080 slide, rendered at 1.5x
  const W = 2880, H = 1620, step = 72;
  let lines = '';
  for (let x = 0; x < W; x += step) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = 0; y < H; y += step) lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  return png(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#${bg}"/><g stroke="#${line}" stroke-width="2">${lines}</g></svg>`);
}
// QR code: dark modules on a light tile with a four-module quiet zone, the form every phone camera reads.
async function qrPng(text, dark, light) {
  const QRCode = require('qrcode');
  const q = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const n = q.modules.size, quiet = 4, cell = 16, size = (n + quiet * 2) * cell;
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (q.modules.get(r, c)) d += `M${(c + quiet) * cell},${(r + quiet) * cell}h${cell}v${cell}h-${cell}z`;
  }
  return png(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#${light}"/><path fill="#${dark}" d="${d}"/></svg>`);
}

// ---- layout constants ----
const SANS = 'Space Grotesk', MONO = 'IBM Plex Mono', HAND = 'Architects Daughter';
const G = 1 / 3;                 // one 48px grid cell in inches (1920px = 13.333in)
const g = (n) => n * G;
const X0 = 0.833, XW = 11.667, XR = X0 + XW;

// ---- drawing helpers, bound to one presentation and variant ----
function makeHelpers(pres, VARIANT) {
  function T(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: SANS, valign: 'top' }, o)); }
  function wordmark(s, P, x, y, w, h, size, swiftColor) {
    T(s, [{ text: 'Kube', options: { color: P['brand-ink'] } }, { text: 'Swift', options: { color: swiftColor || P['brand-swift'], bold: true } }],
      { x, y, w, h, fontSize: size, valign: 'middle', objectName: 'Logo wordmark' });
  }
  function header(s, P, eyebrow, title) {
    s.addText(eyebrow, { placeholder: 'eyebrow' });
    s.addText(title, { placeholder: 'title' });
    wordmark(s, P, 11.62, 0.57, 0.9, 0.36, 13);
  }
  const KIND_NAME = { none: 'neutral', teal: 'KubeSwift-owned', blue: 'external', strong: 'convergence point' };
  function node(s, P, x, y, w, h, title, o = {}) {
    const kind = o.kind || 'none';
    const fill = { none: null, teal: P['tint-teal'], blue: P['tint-blue'], strong: P['accent-fill'] }[kind];
    const strong = kind === 'strong';
    const tc = strong ? P['on-accent-fill'] : P.ink;
    const sc = strong ? P['accent-fill-sub'] : P.sub;
    const runs = [{ text: title, options: { bold: true, fontSize: o.tsize || 17, color: tc, breakLine: !!o.sub } }];
    if (o.sub) runs.push({ text: o.sub, options: { fontSize: o.ssize || 13, color: sc, paraSpaceBefore: 4 } });
    const opts = {
      shape: pres.shapes.ROUNDED_RECTANGLE, x, y, w, h, rectRadius: 0.042,
      line: { color: strong ? P['accent-fill'] : P.stroke, width: 1.5, dashType: o.dashed ? 'dash' : 'solid' },
      fontFace: SANS, align: 'center', valign: 'middle', margin: [4, 8, 4, 8],
      objectName: `Node ${o.dashed ? 'in progress' : KIND_NAME[kind]}: ${title}`,
    };
    if (fill) opts.fill = { color: fill };
    s.addText(runs, opts);
  }
  function arrow(s, P, x1, y1, x2, y2, o = {}) {
    const line = { color: o.color || P.stroke, width: 1.5, dashType: o.dash ? 'dash' : 'solid' };
    if (!o.noHead) line.endArrowType = 'arrow';
    s.addShape(pres.shapes.LINE, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: x2 < x1, flipV: y2 < y1, line, objectName: o.name || (o.noHead ? 'Connector segment' : 'Connector'),
    });
  }
  function group(s, P, x, y, w, h, label) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.042, line: { color: P.accent, width: 1.5, dashType: 'dash' }, objectName: `Group frame: ${label}` });
    T(s, label, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.28, fontFace: MONO, fontSize: 12, color: P.accent, valign: 'middle', objectName: `Group label: ${label}` });
  }
  function mlabel(s, P, text, x, y, w, o = {}) {
    T(s, text, { x, y, w, h: 0.28, fontFace: MONO, fontSize: o.size || 11, color: o.color || P.accent, charSpacing: 2, valign: 'middle', align: o.align || 'left', objectName: `Label: ${text}` });
  }
  function caption(s, P, text, x, y, w, h = 0.5, o = {}) {
    T(s, text, { x, y, w, h, fontSize: o.size || 13, color: o.color || P.sub, align: o.align || 'left', lineSpacingMultiple: 1.15, objectName: 'Caption' });
  }
  function rule(s, P, x, y, w, strong) {
    s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: strong ? P.ink : P.rule, width: strong ? 1 : 0.75 }, objectName: strong ? 'Column rule' : 'Rule' });
  }
  function tag(s, P, text, x, y, o = {}) {
    const size = o.size || 10.5;
    const w = o.w || (text.length * ((size * 0.6 + 0.8) / 72) + 0.3);
    const kind = o.kind || 'outline';
    const opts = {
      shape: pres.shapes.ROUNDED_RECTANGLE, x, y, w, h: 0.32, rectRadius: 0.042,
      fontFace: MONO, fontSize: size, bold: false, charSpacing: 0.8, align: 'center', valign: 'middle', margin: 0,
      color: kind === 'fill' ? P['on-speed'] : kind === 'dashed' ? P.accent : P.ink,
      line: { color: kind === 'fill' ? P.teal : kind === 'dashed' ? P.accent : P.ink, width: 1, dashType: kind === 'dashed' ? 'dash' : 'solid' },
      objectName: `Tag ${kind}: ${text}`,
    };
    if (kind === 'fill') opts.fill = { color: P.teal };
    s.addText(text, opts);
    return w;
  }
  function ann(s, P, text, x, y, w, h, rot = -3, o = {}) {
    T(s, text, { x, y, w, h, fontFace: HAND, fontSize: 17, color: P.accent, rotate: rot, valign: 'middle', align: o.align || 'left', objectName: `Annotation: ${text}` });
  }
  function curvedPointer(s, P, x, y, w, h, name) {
    // a hand-drawn style pointer from top-right to bottom-left, open arrowhead at the end
    s.addShape(pres.shapes.CUSTOM_GEOMETRY, {
      x, y, w, h, objectName: name || 'Annotation pointer',
      line: { color: P.accent, width: 1.5, endArrowType: 'arrow' },
      points: [{ x: w, y: 0, moveTo: true }, { x: 0, y: h, curve: { type: 'quadratic', x1: w * 0.15, y1: h * 0.05 } }],
    });
  }
  function takeaway(s, P, text, y = 6.5) {
    rule(s, P, X0, y, XW, false);
    T(s, text, { x: X0, y: y + 0.12, w: XW, h: 0.38, fontSize: 16, bold: true, color: P.ink, valign: 'middle', objectName: 'Takeaway' });
  }
  function code(s, P, x, y, w, h, lines, o = {}) {
    const lh = o.lh || 0.36, top = o.top || 0.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.11, fill: { color: P['code-bg'] }, line: { color: VARIANT === 'dark' ? P.rule : P['code-bg'], width: 0.75 }, objectName: 'Code panel' });
    (o.hl || []).forEach((i) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y: y + top + i * lh, w, h: lh, fill: { color: P.teal, transparency: 86 }, line: { type: 'none' }, objectName: 'Code highlight' });
      s.addShape(pres.shapes.RECTANGLE, { x, y: y + top + i * lh, w: 0.028, h: lh, fill: { color: P.teal }, line: { type: 'none' }, objectName: 'Code highlight bar' });
    });
    const runs = [];
    lines.forEach((segs, i) => {
      const pre = o.numbers === false ? [] : [{ text: String(i + 1).padStart(2, ' ') + '   ', options: { color: P['code-muted'] } }];
      const parts = pre.concat(segs.map(([t, k]) => ({ text: t, options: {
        color: k === 'v' ? P['code-value'] : k === 'k' ? P['code-key'] : k === 'p' ? P['code-value'] : P['code-ink'], bold: k === 'v',
      } })));
      parts[parts.length - 1].options.breakLine = i < lines.length - 1;
      runs.push(...parts);
    });
    T(s, runs, { x: x + 0.3, y: y + top, w: w - 0.5, h: lh * lines.length, fontFace: MONO, fontSize: o.size || 14, lineSpacing: lh * 72, objectName: 'Code text' });
  }
  function freeform(s, x, y, w, h, pts, sc, ox, oy, line, name) {
    const points = pts.map(([px, py], i) => ({ x: (px - ox) * sc, y: (py - oy) * sc, ...(i === 0 ? { moveTo: true } : {}) }));
    points.push({ close: true });
    s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x, y, w, h, points, line, objectName: name });
  }
  // The outlined hexagon motif of the title slide: two offset hexagon outlines and the chevron in teal at partial
  // opacity, with a dashed crosshair, bleeding off the right edge. Title slides only.
  function hexMotif(s, P) {
    const sc = 1 / 144, OX = 1160, OY = 90;
    const hx = [[450, 40], [805, 245], [805, 655], [450, 860], [95, 655], [95, 245]];
    const hexJ = [[452, 46], [800, 248], [808, 652], [448, 856], [98, 650], [92, 250]];
    const chev = [[310, 270], [630, 450], [310, 630], [435, 630], [488, 450], [435, 270]];
    s.addShape(pres.shapes.LINE, { x: (OX + 450) * sc, y: OY * sc, w: 0, h: 900 * sc, line: { color: P.rule, width: 0.75, dashType: 'dash' }, objectName: 'Crosshair vertical' });
    s.addShape(pres.shapes.LINE, { x: OX * sc, y: (OY + 450) * sc, w: (1920 - OX) * sc, h: 0, line: { color: P.rule, width: 0.75, dashType: 'dash' }, objectName: 'Crosshair horizontal' });
    const bb = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
    for (const [pts, ln, nm] of [[hexJ, { color: P.teal, width: 0.75, transparency: 70 }, 'Hexagon sketch'], [hx, { color: P.teal, width: 1.5, transparency: 45 }, 'Hexagon'], [chev, { color: P.teal, width: 1.5, transparency: 45 }, 'Chevron']]) {
      const [x1, y1, x2, y2] = bb(pts);
      freeform(s, (OX + x1) * sc, (OY + y1) * sc, (x2 - x1) * sc, (y2 - y1) * sc, pts, sc, x1, y1, ln, nm);
    }
  }
  return { T, wordmark, header, node, arrow, group, mlabel, caption, rule, tag, ann, curvedPointer, takeaway, code, freeform, hexMotif };
}

// pptxgenjs 4.0.1 writes one <a:pPr> per text run, so a paragraph with several runs (a bullet with an inline mono
// command, the two-colour wordmark) carries several. The schema allows one; readers disagree on which they keep
// (LibreOffice takes the last and drops the bullet). Keep the first, which holds the paragraph's own options.
function dedupeParagraphProps(xml) {
  return xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (whole, inner) => {
    let seen = false;
    const out = inner.replace(/<a:pPr\b[^>]*\/>|<a:pPr\b[^>]*>[\s\S]*?<\/a:pPr>/g, (m) => (seen ? '' : ((seen = true), m)));
    return '<a:p>' + out + '</a:p>';
  });
}
// pptxgenjs 4.0.1 ignores `compression` in writeFile under Node; stream() honours it.
async function write(pres, OUT) {
  const JSZip = require('jszip');
  const zip = await JSZip.loadAsync(await pres.stream({ compression: true }));
  // folder entries break opening and co-editing through some cloud services; the files alone are a valid package
  // (zip.remove on a folder would also drop its files, so delete the entries themselves)
  for (const name of Object.keys(zip.files)) if (zip.files[name].dir) delete zip.files[name];
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/(slides|slideLayouts|slideMasters)\/[^/]+\.xml$/.test(n))) {
    zip.file(name, dedupeParagraphProps(await zip.file(name).async('string')), { createFolders: false });
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } }));
  console.log('wrote', path.relative(process.cwd(), OUT));
}

module.exports = { ROOT, tok, L, D, MARK_PATH, markPng, gridPng, qrPng, SANS, MONO, HAND, G, g, X0, XW, XR, makeHelpers, write };
