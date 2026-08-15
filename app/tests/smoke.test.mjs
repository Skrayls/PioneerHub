import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [html, js, css] = await Promise.all(['index.html', 'app.js', 'styles.css'].map(file => readFile(new URL(file, root), 'utf8')));
assert.match(html, /PioneerHub yra nepriklausomas projektas/);
assert.match(html, /niekam neduok wallet passphrase/i);
assert.match(html, /TESTNET/);
assert.match(js, /Testnet scenarijus/);
assert.doesNotMatch(html, /seed phrase|private key|connect wallet/i);
assert.match(css, /@media/);
