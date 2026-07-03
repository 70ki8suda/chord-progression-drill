# VexFlow Notation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render piano staff notation and guitar tablature with VexFlow while preserving the current static app behavior and fallback rendering.

**Architecture:** Keep `index.html` as the app source. Add VexFlow as a CDN script, split the existing hand-drawn notation functions into fallback helpers, and add VexFlow adapter/render functions for piano staves and guitar tabs. Add a Wrangler config so non-app docs and Git metadata are excluded from Cloudflare Pages deployment.

**Tech Stack:** Static HTML, browser JavaScript, SVG, VexFlow, Wrangler / Cloudflare Pages.

---

## Chunk 1: Source Control And Test Harness

### Task 1: Add Local Smoke Test

**Files:**
- Create: `tools/smoke-test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write a failing smoke test**

Create `tools/smoke-test.mjs` that reads `index.html` and checks for required strings:

```js
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const checks = [
  ['VexFlow CDN script', /vexflow/i],
  ['VexFlow piano renderer', /renderVexPianoStaff/],
  ['VexFlow guitar tab renderer', /renderVexGuitarTab/],
  ['fallback piano renderer', /fallbackStaffNotesSVG/],
  ['Wrangler project name', /chord-progression-drill/],
];

const failures = checks.filter(([, pattern]) => !pattern.test(html));
if (failures.length) {
  for (const [name] of failures) console.error(`Missing: ${name}`);
  process.exit(1);
}

console.log(`Smoke checks passed: ${checks.length}`);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH" node tools/smoke-test.mjs`

Expected: FAIL with missing VexFlow renderer strings.

- [ ] **Step 3: Add `package.json` script**

```json
{
  "scripts": {
    "test": "node tools/smoke-test.mjs"
  }
}
```

- [ ] **Step 4: Commit test harness**

```bash
git add package.json tools/smoke-test.mjs
git commit -m "test: add notation smoke test"
```

## Chunk 2: VexFlow Rendering

### Task 2: Add VexFlow Piano And Tab Rendering

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Rename current renderers to fallbacks**

Rename:

- `staffNotesSVG` to `fallbackStaffNotesSVG`
- `guitarSVG` to `fallbackGuitarSVG`

Update all call sites so behavior remains unchanged before VexFlow is added.

- [ ] **Step 2: Add VexFlow CDN script**

Add this before the app script:

```html
<script src="https://unpkg.com/vexflow/build/cjs/vexflow.js"></script>
```

- [ ] **Step 3: Add note conversion helpers**

Add helpers:

```js
function vexKey(o) { ... }
function vexAccidental(o) { ... }
function addVexAccidentals(note, spelled) { ... }
```

- [ ] **Step 4: Implement `renderVexPianoStaff(key, lh, rh)`**

Use VexFlow SVG renderer, treble and bass staves, one `StaveNote` per hand, and fallback on failure.

- [ ] **Step 5: Implement `renderVexGuitarTab(name, sh, f)`**

Use `TabStave` and one `TabNote` built from the resolved absolute frets.

- [ ] **Step 6: Wire notation panel to VexFlow**

Update `scorePanel()` so each chord shows:

- VexFlow piano grand staff
- VexFlow tab when available
- existing chord diagram fallback/form diagram

- [ ] **Step 7: Run smoke test**

Run: `PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH" npm test`

Expected: PASS.

- [ ] **Step 8: Commit VexFlow renderer**

```bash
git add index.html
git commit -m "feat: render notation with VexFlow"
```

## Chunk 3: Deploy Configuration And Verification

### Task 3: Add Cloudflare Pages Deploy Config

**Files:**
- Create: `wrangler.jsonc`

- [ ] **Step 1: Add deploy config**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "chord-progression-drill",
  "pages_build_output_dir": ".",
  "upload_source_maps": false,
  "rules": [
    { "type": "Text", "globs": ["**/*.html"] }
  ],
  "exclude": [".git", "docs", "versions", "node_modules"]
}
```

- [ ] **Step 2: Run local static smoke test**

Run: `PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH" npm test`

Expected: PASS.

- [ ] **Step 3: Deploy to Cloudflare Pages**

Run: `PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH" npx wrangler pages deploy . --project-name chord-progression-drill`

Expected: Deployment complete with a Pages URL.

- [ ] **Step 4: Verify public URL**

Run:

```bash
curl -sS -D - https://chord-progression-drill.pages.dev/ -o /tmp/chord-page.html | sed -n '1,20p'
perl -0777 -ne 'print $1 if /<title>(.*?)<\/title>/s' /tmp/chord-page.html
```

Expected: HTTP 200 and title `コード進行ドリル`.

- [ ] **Step 5: Commit deploy config**

```bash
git add wrangler.jsonc
git commit -m "chore: configure Cloudflare Pages deploy"
```
