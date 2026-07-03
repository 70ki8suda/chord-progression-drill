# Chord Progression Drill

ピアノとギターでコード進行を毎日練習するための静的Webアプリです。

公開版: https://chord-progression-drill.pages.dev/

## Features

- 日替わりの実曲コード進行ドリル
- 基礎進行、セカンダリードミナント、裏コード、テンションの練習
- キー変更と全キー対応のリファレンス
- コード単体・進行全体の音再生
- VexFlow によるピアノ五線譜とギターTAB表示
- ギターコードダイアグラム表示

## Local Development

```bash
npm test
npm run build
python3 -m http.server 8788
```

Then open:

```text
http://localhost:8788/
```

## Deploy

Cloudflare Pages に `dist/index.html` だけをアップロードします。

```bash
npm run deploy
```

## Structure

- `index.html` - app source
- `tools/build-pages.mjs` - copies the app into `dist/`
- `tools/smoke-test.mjs` - lightweight static checks
- `wrangler.jsonc` - Cloudflare Pages project config

## Notes

The app intentionally stays as a single static HTML file. VexFlow is loaded from CDN, and the notation view falls back to the built-in SVG renderers if VexFlow is unavailable.
