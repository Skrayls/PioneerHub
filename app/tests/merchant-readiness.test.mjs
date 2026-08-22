import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [shell, script, css, workerSource, home] = await Promise.all([
  readFile(new URL('merchant-readiness-shell.txt', root), 'utf8'),
  readFile(new URL('merchant-readiness.js', root), 'utf8'),
  readFile(new URL('merchant-readiness.css', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
]);
assert.match(shell, /Merchant Readiness Desk/);
assert.match(shell, /netikrina verslo, nerenka kontaktų/);
assert.match(shell, /neprašo wallet duomenų/);
assert.match(script, /Parduodu fizines prekes/);
assert.match(script, /Grąžinimas \/ ginčas/);
assert.match(script, /Sukčiavimas ir eskalavimas/);
assert.match(script, /merchant_readiness_start/);
assert.match(script, /merchant_readiness_complete/);
assert.match(script, /\/sauga\/pries-siunciant-pi/);
assert.doesNotMatch(`${shell}\n${script}`, /fetch\(|localStorage|sessionStorage|Pi\.authenticate|createPayment|type="(?:text|number|email)"/i);
assert.match(css, /min-height:84px/);
assert.ok(workerSource.includes('MERCHANT_READINESS_ROUTE = "/merchant-readiness"'));
assert.match(workerSource, /merchant-readiness-shell\.txt/);
assert.match(home, /href="\/merchant-readiness"/);

let assetPath = '';
const response = await worker.fetch(new Request('https://example.test/merchant-readiness'), {
  ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html><head><link href="styles.css"><link href="brand.css"><link href="merchant-readiness.css"></head><body><script src="merchant-readiness.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }); } },
});
const html = await response.text();
assert.equal(response.status, 200);
assert.equal(assetPath, '/merchant-readiness-shell.txt');
assert.match(html, /merchant-readiness\.css\?v=merchant-readiness-desk-v1/);
assert.match(html, /merchant-readiness\.js\?v=merchant-readiness-desk-v1/);
assert.match(response.headers.get('cache-control') || '', /no-store/);
