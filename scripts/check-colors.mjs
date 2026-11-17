// Fails when a stylesheet, page, SVG or generator uses a hex colour that is not a token value.
// Every colour has to come from tokens/tokens.json; this catches drift such as #F4F5F7 next to #F5F6F8.
// Run: npm run check
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadTokens, allHex } from './lib/tokens.mjs';

const allowed = allHex(loadTokens());
const SCAN = ['components', 'assets', 'kits', 'index.html'];
const EXT = new Set(['.css', '.html', '.svg', '.mjs', '.cjs', '.js']);
const HEX = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

function* walk(p) {
  const st = statSync(p, { throwIfNoEntry: false });
  if (!st) return;
  if (st.isFile()) { yield p; return; }
  for (const e of readdirSync(p)) {
    if (e === 'node_modules' || e.startsWith('.')) continue;
    yield* walk(path.join(p, e));
  }
}

const expand = (h) => (h.length === 3 ? h.split('').map((c) => c + c).join('') : h).toUpperCase();
const problems = [];
for (const top of SCAN) {
  for (const file of walk(path.join(ROOT, top))) {
    if (!EXT.has(path.extname(file))) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(HEX)) {
        const v = '#' + expand(m[1]);
        if (!allowed.has(v)) problems.push(`${path.relative(ROOT, file)}:${i + 1}  ${m[0]} is not a token value`);
      }
    });
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} colour(s) outside tokens/tokens.json. Use a token, or add the colour to tokens.json with a usage note.`);
  process.exit(1);
}
console.log(`colours ok: every hex value matches one of ${allowed.size} token values`);
