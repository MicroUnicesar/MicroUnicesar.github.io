#!/usr/bin/env node
// Verifica la internacionalización sin dependencias:
//  1. es.json y en.json tienen exactamente las mismas claves, sin valores vacíos.
//  2. Toda clave usada en plantillas o código existe en ambos diccionarios.
//  3. Los textos de los datos (src/assets/data) tienen {es, en} completos, sin TODO_TRADUCCION.
//  4. No queda texto fijo visible en las plantillas.
// Uso: node scripts/check-i18n.mjs        (falla con código 1 si hay errores)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = file => readFileSync(join(ROOT, file), 'utf8');
const errors = [];
const warnings = [];

function walkFiles(dir, test, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) walkFiles(rel, test, out);
    else if (test(rel)) out.push(rel);
  }
  return out;
}

// ---------- 1. paridad del diccionario
const es = JSON.parse(read('src/assets/i18n/es.json'));
const en = JSON.parse(read('src/assets/i18n/en.json'));
for (const key of Object.keys(es)) if (!(key in en)) errors.push(`Falta en en.json: "${key}"`);
for (const key of Object.keys(en)) if (!(key in es)) errors.push(`Falta en es.json: "${key}"`);
for (const [lang, dict] of [['es', es], ['en', en]]) {
  for (const [key, value] of Object.entries(dict)) {
    if (typeof value !== 'string' || !value.trim()) errors.push(`Valor vacío en ${lang}.json: "${key}"`);
  }
}
const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
for (const key of Object.keys(es)) {
  if (key in en && placeholders(es[key]) !== placeholders(en[key])) {
    errors.push(`Parámetros distintos en "${key}": es {${placeholders(es[key])}} / en {${placeholders(en[key])}}`);
  }
}

// ---------- 2. claves usadas
const sources = walkFiles('src/app', f => /\.(html|ts)$/.test(f) && !/\.spec\.ts$/.test(f) && !f.includes('/testing/'));
const used = new Map(); // clave -> archivo
const prefixes = new Set(); // claves dinámicas: 'event-type-' + x
const note = (key, file) => used.has(key) || used.set(key, file);
for (const file of sources) {
  const text = read(file);
  for (const m of text.matchAll(/'([a-z0-9][a-z0-9-]*)'\s*\|\s*translate/g)) note(m[1], file);
  for (const m of text.matchAll(/\(\s*'([a-z0-9][a-z0-9-]*-)'\s*\+[^)]*\)\s*\|\s*translate/g)) prefixes.add(m[1]);
  for (const m of text.matchAll(/translate\(\s*'([a-z0-9][a-z0-9-]*)'/g)) note(m[1], file);
  for (const m of text.matchAll(/\b\w*(?:Key)\s*[:=]\s*["']([a-z0-9][a-z0-9-]*)["']/g)) note(m[1], file);
  for (const m of text.matchAll(/`([a-z0-9-]+-)\$\{/g)) prefixes.add(m[1]);
}
for (const [key, file] of used) {
  if (!(key in es) || !(key in en)) errors.push(`Clave usada y no definida: "${key}" (${file})`);
}
// Claves que solo aparecen como texto en el código (listas de claves, constantes)
const allCode = sources.map(read).join('\n');
const unused = Object.keys(es).filter(key =>
  !used.has(key) && ![...prefixes].some(prefix => key.startsWith(prefix)) && !allCode.includes(`'${key}'`) && !allCode.includes(`"${key}"`));
for (const key of unused) warnings.push(`Clave sin uso: "${key}"`);

// ---------- 3. datos bilingües
function checkLocalized(node, where) {
  if (Array.isArray(node)) return node.forEach((item, i) => checkLocalized(item, `${where}[${i}]`));
  if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    if (keys.includes('es') && keys.includes('en') && keys.every(k => k === 'es' || k === 'en')) {
      for (const lang of ['es', 'en']) {
        if (typeof node[lang] !== 'string' || !node[lang].trim()) errors.push(`${where}: falta "${lang}"`);
      }
      if (node.en === 'TODO_TRADUCCION') errors.push(`${where}: traducción pendiente ("${String(node.es).slice(0, 50)}…")`);
      return;
    }
    for (const [k, v] of Object.entries(node)) checkLocalized(v, `${where}.${k}`);
  }
}
for (const file of walkFiles('src/assets/data', f => f.endsWith('.json') && !f.includes('template'))) {
  checkLocalized(JSON.parse(read(file)), relative('src/assets', file));
}

// ---------- 4. texto fijo en plantillas
const ALLOWED = new Set(['DOI', 'UNICESAR', 'Facebook', 'Instagram', 'X']);
for (const file of sources.filter(f => f.endsWith('.html'))) {
  let text = read(file).replace(/<!--[\s\S]*?-->/g, '');
  text = text.replace(/\{\{[\s\S]*?\}\}/g, ' ');
  text = text.replace(/@(?:if|for|switch|case|else if)\s*\([^{]*\)\s*\{/g, ' ').replace(/@(?:else|default|empty)\s*\{/g, ' ').replace(/@let [^;]*;/g, ' ');
  for (const m of text.matchAll(/>([^<>]+)</g)) {
    const t = m[1].replace(/[{}]/g, ' ').replace(/&#64;/g, '@').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
    if (t.length > 1 && /[A-Za-zÁ-ÿ]{2,}/.test(t) && !ALLOWED.has(t) && !/^[\w.+-]+@[\w.-]+$/.test(t)) errors.push(`Texto fijo en ${file}: "${t.slice(0, 70)}"`);
  }
  for (const m of text.matchAll(/\s(?:placeholder|title|alt|aria-label|label)="([^"]*[A-Za-zÁ-ÿ]{2,}[^"]*)"/g)) {
    if (m[1] && !ALLOWED.has(m[1])) errors.push(`Atributo con texto fijo en ${file}: "${m[1].slice(0, 70)}"`);
  }
}

// ---------- informe
const claves = Object.keys(es).length;
console.log(`i18n: ${claves} claves es/en, ${used.size} usadas directamente, ${sources.length} archivos revisados.`);
for (const w of warnings) console.log(`  aviso: ${w}`);
for (const e of errors) console.error(`  ERROR: ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} error(es) de internacionalización.`);
  process.exit(1);
}
console.log('i18n: correcto.');
