import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [html, js, css] = await Promise.all(['index.html', 'app.js', 'styles.css'].map(file => readFile(new URL(file, root), 'utf8')));
assert.match(html, /PioneerHub nėra Pi Network/);
assert.match(html, /30 sekundžių patikra/i);
assert.match(html, /App Radar/);
assert.match(html, /TESTNET/);
assert.match(html, /LIVE/);
assert.match(html, /READY \/ PREPARED/);
assert.match(html, /REQUIRES PI DEVELOPER PORTAL CONFIGURATION/);
assert.match(html, /Pi loginas nėra aktyvus/);
assert.match(html, /Testnet mokėjimas dar nevykdomas/);
assert.match(html, /ne aktyvus mokejimas/);
assert.match(js, /passphrase/);
assert.match(js, /learn_article_open/);
assert.match(js, /PIONEERHUB TESTED/);
assert.match(js, /OFFICIAL \/ ECOSYSTEM RESOURCE/);
assert.match(js, /NOT YET TESTED/);
assert.doesNotMatch(html, /seed phrase|private key|connect wallet/i);
assert.doesNotMatch(js, /Pi\.authenticate\s*\(/);
assert.doesNotMatch(js, /createPayment\s*\(/);
assert.match(css, /@media/);

const response = await worker.fetch(new Request('https://example.test/app.js'), {
  ASSETS: { fetch: async () => new Response('ok', { status: 200, headers: { 'content-type': 'application/javascript' } }) },
});
assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
assert.equal(response.headers.get('x-frame-options'), 'DENY');
assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
assert.match(response.headers.get('content-security-policy'), /sdk\.minepi\.com/);
assert.equal(response.headers.get('cache-control'), 'public, max-age=86400');

const health = await worker.fetch(new Request('https://example.test/healthz'), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'staging' });
assert.equal(health.status, 200);
assert.equal((await health.json()).status, 'ok');

const event = await worker.fetch(new Request('https://example.test/events', { method: 'POST', body: 'safety_check_complete' }), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'production' });
assert.equal(event.status, 204);
