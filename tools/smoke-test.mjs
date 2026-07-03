import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const checks = [
  ['VexFlow CDN script', /vexflow/i],
  ['VexFlow piano renderer', /renderVexPianoStaff/],
  ['VexFlow guitar tab renderer', /renderVexGuitarTab/],
  ['fallback piano renderer', /fallbackStaffNotesSVG/],
  ['fallback guitar renderer', /fallbackGuitarSVG/],
];

const failures = checks.filter(([, pattern]) => !pattern.test(html));

if (failures.length) {
  for (const [name] of failures) console.error(`Missing: ${name}`);
  process.exit(1);
}

console.log(`Smoke checks passed: ${checks.length}`);
