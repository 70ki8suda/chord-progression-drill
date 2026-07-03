import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const wranglerPath = new URL('../wrangler.jsonc', import.meta.url);
const wrangler = existsSync(wranglerPath) ? readFileSync(wranglerPath, 'utf8') : '';

const checks = [
  ['VexFlow CDN script', /vexflow/i, html],
  ['VexFlow piano renderer', /renderVexPianoStaff/, html],
  ['VexFlow guitar tab renderer', /renderVexGuitarTab/, html],
  ['fallback piano renderer', /fallbackStaffNotesSVG/, html],
  ['fallback guitar renderer', /fallbackGuitarSVG/, html],
  ['build script', Boolean(pkg.scripts?.build)],
  ['deploy script targets dist', /pages deploy dist/.test(pkg.scripts?.deploy || '')],
  ['deploy script targets production branch', /--branch production/.test(pkg.scripts?.deploy || '')],
  ['Wrangler project name', /chord-progression-drill/, wrangler],
  ['Wrangler dist output directory', /"pages_build_output_dir"\s*:\s*"dist"/, wrangler],
];

const failures = checks.filter(([, expected, target]) => {
  if(typeof expected==="boolean")return !expected;
  return !expected.test(target);
});

if (failures.length) {
  for (const [name] of failures) console.error(`Missing: ${name}`);
  process.exit(1);
}

console.log(`Smoke checks passed: ${checks.length}`);
