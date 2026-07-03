import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(new URL('../index.html', import.meta.url)));
const dist = new URL('../dist/', import.meta.url);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
copyFileSync(new URL('../index.html', import.meta.url), new URL('index.html', dist));

console.log(`Built ${root}/dist`);
