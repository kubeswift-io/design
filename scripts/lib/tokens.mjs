// Shared token reader: loads tokens/tokens.json and resolves colour aliases per theme.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TOKENS_PATH = path.join(ROOT, 'tokens', 'tokens.json');

export function loadTokens(file = TOKENS_PATH) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

const ALIAS = /^\{(.+)\}$/;

export function themes(tok) {
  return tok.color.themes.map((t) => t.id);
}

// Raw value of a colour token for a theme; a missing theme falls back to the first theme.
export function rawColor(tok, name, theme) {
  const t = tok.color.tokens.find((x) => x.name === name);
  if (!t) throw new Error(`unknown colour token: ${name}`);
  if (typeof t.value === 'string') return t.value;
  return t.value[theme] ?? t.value[themes(tok)[0]];
}

// Fully resolved value (aliases followed) of a colour token for a theme.
export function resolveColor(tok, name, theme, depth = 0) {
  if (depth > 16) throw new Error(`alias chain too deep at ${name}`);
  const v = rawColor(tok, name, theme);
  const m = ALIAS.exec(v);
  return m ? resolveColor(tok, m[1], theme, depth + 1) : v;
}

// { tokenName: '#RRGGBB' } for every colour token whose resolved value is a hex colour.
export function palette(tok, theme) {
  const out = {};
  for (const t of tok.color.tokens) {
    const v = resolveColor(tok, t.name, theme);
    if (v.startsWith('#')) out[t.name] = v.toUpperCase();
  }
  return out;
}

// Every hex value any colour token resolves to, in any theme (upper case, with #).
export function allHex(tok) {
  const set = new Set();
  for (const th of themes(tok)) for (const v of Object.values(palette(tok, th))) set.add(v);
  return set;
}
