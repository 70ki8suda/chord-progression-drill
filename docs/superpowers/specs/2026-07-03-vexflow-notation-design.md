# VexFlow Notation Design

## Goal

Improve notation accuracy for the chord progression drill by rendering piano staff notation and guitar tablature with VexFlow while preserving the current single-file static app and existing chord diagram fallback.

## Scope

- Replace the hand-drawn piano staff SVG with VexFlow-rendered treble and bass staves.
- Add VexFlow-rendered guitar tablature for the existing guitar fingering data.
- Keep the existing chord diagram because it is still useful for form recognition.
- Keep the app deployable as static HTML on Cloudflare Pages.
- Keep the current audio, quiz, daily drill, reference, and song data behavior unchanged.

## Architecture

The app will load VexFlow from a CDN in `index.html`. Rendering functions will detect whether `window.Vex.Flow` is available. If VexFlow is available, piano staff and guitar tab rendering will use VexFlow SVG output. If VexFlow is unavailable or throws, the app will fall back to the existing hand-drawn SVG functions so the notation panel still works offline or during CDN failure.

Existing music-domain helpers remain the source of truth:

- `spell(key, midi)` continues to determine note spelling and accidentals.
- `progVoicings(key, chords)` continues to produce left-hand and right-hand piano voicings.
- `guitarFor(pc, type, prevF)` continues to select a guitar shape.

New adapter helpers will convert existing data into VexFlow inputs:

- MIDI note plus `spell()` result to `StaveNote` keys such as `c#/4` and `bb/3`.
- Existing guitar shape data to `TabNote` positions such as `{ str: 2, fret: "5" }`.

## Piano Staff Rendering

Each chord is displayed as one vertical harmony:

- Right hand notes render as one `StaveNote` on a treble stave.
- Left hand notes render as one `StaveNote` on a bass stave.
- Both notes use a quarter-note duration because the notation is instructional, not rhythmic.
- Accidentals are attached per note key based on `spell(key, midi).acc`.
- Staves are connected visually as a compact grand staff.

VexFlow handles ledger lines, notehead collision rules, and accidental placement more accurately than the current custom SVG.

## Guitar Tablature Rendering

Each selected guitar chord renders as one `TabNote` on a six-line `TabStave`.

The tab data is derived from the existing shape:

- Muted strings are skipped.
- Open strings use fret `0`.
- Fretted notes use the resolved absolute fret number.
- String numbering follows VexFlow's convention: string `1` is the high E string, string `6` is the low E string. Existing shape indexes are converted from low-to-high order into this convention.

The existing chord diagram remains next to the VexFlow tab for quick fingering recognition.

## Failure Handling

If VexFlow is missing or a render call fails:

- Piano notation falls back to the current hand-drawn `staffNotesSVG()` output.
- Guitar tab is omitted, while the existing chord diagram remains visible.
- A console warning is acceptable; no visible error banner is needed because the app should stay focused on practice.

## Deployment

The new docs and Git metadata must not be included in Cloudflare Pages uploads. Deployments should use a small `wrangler.jsonc` configuration with:

- project name `chord-progression-drill`
- output directory `.`
- exclude rules for `.git`, `docs`, and `versions`

## Verification

- Open the app locally and confirm notation panels render without JavaScript errors.
- Confirm VexFlow is loaded and SVGs are inserted for piano staff and tab.
- Simulate missing VexFlow and confirm fallback rendering still works.
- Deploy with Wrangler and verify the public URL returns HTTP 200 with title `コード進行ドリル`.
