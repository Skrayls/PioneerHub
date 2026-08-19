import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [shell, js, css, home, workerSource] = await Promise.all([
  readFile(new URL('community-shell.txt', root), 'utf8'), readFile(new URL('community-signals.js', root), 'utf8'), readFile(new URL('community-signals.css', root), 'utf8'), readFile(new URL('index.html', root), 'utf8'), readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);
assert.match(js, /PioneerHub šių laukų neskaito/i);
assert.match(js, /mailto:hello@pioneerhub\.lt/);
assert.match(js, /passphrase|seed phrase|private key/);
assert.doesNotMatch(`${shell}\n${js}`, /fetch\(|sendBeacon|localStorage|sessionStorage|Pi\.authenticate|createPayment/i);
assert.match(home, /mailto:hello@pioneerhub\.lt/);
assert.match(await readFile(new URL('app.js', root), 'utf8'), /'Scam%20report': '\/prisidek#scam'/);
assert.match(await readFile(new URL('app.js', root), 'utf8'), /'App%20suggestion': '\/prisidek#app'/);
assert.match(await readFile(new URL('app.js', root), 'utf8'), /'Guide%20idea': '\/prisidek#guide'/);
assert.match(css, /@media\(max-width:480px\)/);
assert.match(workerSource, /COMMUNITY_ROUTE/);
let assetPath = '';
const response = await worker.fetch(new Request('https://example.test/prisidek'), { ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html>Community</html>', { headers: { 'content-type': 'text/html' } }); } } });
assert.equal(response.status, 200); assert.equal(assetPath, '/community-shell.txt'); assert.match(response.headers.get('cache-control') || '', /no-store/);
