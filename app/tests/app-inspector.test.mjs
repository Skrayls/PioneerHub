import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [shell, script, css, home, workerSource, config] = await Promise.all([
  readFile(new URL('app-inspector-shell.txt', root), 'utf8'),
  readFile(new URL('app-inspector.js', root), 'utf8'),
  readFile(new URL('app-inspector.css', root), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
  readFile(new URL('../../wrangler.jsonc', import.meta.url), 'utf8'),
]);

assert.match(shell, /Pi nuorodos patikra \| PioneerHub/);
assert.match(shell, /PioneerHub jos neišsiunčia ir pats jos neatidaro/);
assert.match(shell, /passphrase, seed frazės, privataus rakto, KYC dokumentų/);
assert.match(shell, /app-inspector\.js/);
assert.match(home, /href="\/tikrinti-nuoroda"/);
assert.match(script, /new URL\(value\)/);
assert.match(script, /PioneerEvidence/);
assert.match(script, /findByHostname/);
assert.match(script, /wallet\.pinet\.com/);
assert.match(script, /xn--/);
assert.match(script, /Sustok ir tikrink kitu keliu/);
assert.match(script, /PioneerHub jos neatidarė/);
assert.doesNotMatch(script, /fetch\(|sendBeacon|localStorage|sessionStorage|Pi\.authenticate|createPayment/i);
assert.match(css, /min-height:48px/);
assert.match(workerSource, /APP_INSPECTOR_ROUTE = "\/tikrinti-nuoroda"/);
assert.match(workerSource, /app-inspector-shell\.txt/);
assert.match(workerSource, /const FRONTEND_BUILD = "testnet-payment-checklist-v1"/);
assert.match(config, /"RELEASE_ID": "2026-08-21-testnet-payment-checklist-v1"/);

let assetPath = '';
const response = await worker.fetch(new Request('https://example.test/tikrinti-nuoroda'), {
  ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html><head><link href="styles.css"><link href="app-inspector.css"></head><body><script src="app-inspector.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }); } },
});
const html = await response.text();
assert.equal(response.status, 200);
assert.equal(assetPath, '/app-inspector-shell.txt');
assert.match(html, /app-inspector\.css\?v=testnet-payment-checklist-v1/);
assert.match(html, /app-inspector\.js\?v=testnet-payment-checklist-v1/);
assert.match(response.headers.get('cache-control') || '', /no-store/);
