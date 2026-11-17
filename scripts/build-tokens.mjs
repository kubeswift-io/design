// Generates tokens/tokens.css from tokens/tokens.json. Run: npm run build
// With --check, exits 1 if tokens.css is out of date instead of writing it.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadTokens, themes, rawColor } from './lib/tokens.mjs';

const tok = loadTokens();
const OUT = path.join(ROOT, 'tokens', 'tokens.css');
const ids = themes(tok);
const first = ids[0];
const cssVal = (v) => {
  const m = /^\{(.+)\}$/.exec(v);
  return m ? `var(--${m[1]})` : v;
};
const decl = (name, v) => `  --${name}: ${cssVal(v)};`;

function colorBlock(theme, onlyOverrides) {
  const lines = [];
  for (const t of tok.color.tokens) {
    const v = rawColor(tok, t.name, theme);
    if (onlyOverrides && typeof t.value === 'string') continue;
    if (onlyOverrides && t.value[theme] === undefined) continue;
    lines.push(decl(t.name, v));
  }
  return lines.join('\n');
}

const out = [];
out.push('/* KubeSwift: generated from tokens.json by scripts/build-tokens.mjs. Do not edit. */', '');
for (const f of tok.type.fonts) {
  out.push(`@font-face { font-family: "${f.family}"; src: url("../${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style || 'normal'}; font-display: swap; }`);
}
out.push('', `:root, [data-theme="${first}"] {`, colorBlock(first, false), '}', '');
for (const th of ids.slice(1)) {
  const block = colorBlock(th, true);
  out.push(`[data-theme="${th}"] {`, block, `  color-scheme: ${th};`, '}', '');
  out.push(`@media (prefers-color-scheme: ${th}) {`, `  :root:not([data-theme]) {`, block.replace(/^/gm, '  '), `    color-scheme: ${th};`, '  }', '}', '');
}
out.push(':root {');
for (const fam of Object.keys(tok)) {
  if (['name', 'version', 'color', 'type', 'shadow'].includes(fam)) continue;
  if (!tok[fam] || !Array.isArray(tok[fam].tokens)) continue;
  for (const t of tok[fam].tokens) out.push(decl(t.name, t.value));
}
for (const t of tok.shadow?.tokens || []) out.push(decl(t.name, t.value));
for (const [k, stack] of Object.entries(tok.type.families)) out.push(`  --font-${k}: ${stack};`);
out.push('}', '');
for (const g of tok.type.groups) {
  out.push(`/* ${g.name} */`);
  for (const s of g.styles) {
    const fam = s.family || g.family;
    const props = [`font-family: var(--font-${fam})`, `font-size: ${s.fontSize}`, `font-weight: ${s.fontWeight}`];
    if (s.lineHeight !== undefined) props.push(`line-height: ${s.lineHeight}`);
    if (s.letterSpacing) props.push(`letter-spacing: ${s.letterSpacing}`);
    out.push(`.${s.name} { ${props.join('; ')}; }`);
  }
  out.push('');
}
const css = out.join('\n');

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== css) {
    console.error('tokens/tokens.css is out of date. Run: npm run build');
    process.exit(1);
  }
  console.log('tokens.css is up to date');
} else {
  writeFileSync(OUT, css);
  console.log('wrote', path.relative(ROOT, OUT));
}
