import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [html, js, css] = await Promise.all(['index.html', 'app.js', 'styles.css'].map(file => readFile(new URL(file, root), 'utf8')));
assert.match(html, /PioneerHub yra nepriklausomas projektas/);
assert.match(html, /niekam neduok wallet passphrase/i);
assert.match(html, /TESTNET/);
assert.match(js, /Testnet scenarijus/);
assert.doesNotMatch(html, /seed phrase|private key|connect wallet/i);
assert.match(css, /@media/);

const response = await worker.fetch(new Request('https://example.test/app.js'), {
  ASSETS: { fetch: async () => new Response('ok', { status: 200, headers: { 'content-type': 'application/javascript' } }) },
});
assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
assert.equal(response.headers.get('cache-control'), 'public, max-age=86400');
