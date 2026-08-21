import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [shell, script, css, home, workerSource] = await Promise.all([
  readFile(new URL('transfer-rehearsal-shell.txt', root), 'utf8'),
  readFile(new URL('transfer-rehearsal.js', root), 'utf8'),
  readFile(new URL('transfer-rehearsal.css', root), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);

assert.match(shell, /Pi pavedimo repeticija \| PioneerHub/);
assert.match(shell, /nėra wallet, sumos, adreso, Pi prisijungimo ar tikro pavedimo/);
assert.match(shell, /passphrase ar kitų jautrių duomenų/);
assert.match(home, /href="\/pervedimo-repeticija"/);
assert.match(script, /transfer_rehearsal_start/);
assert.match(script, /transfer_rehearsal_complete/);
assert.match(script, /Mane spaudžia siųsti dabar/);
assert.match(script, /Nesu tikras dėl gavėjo ar prašymo/);
assert.match(script, /\/sauga\/pries-siunciant-pi/);
assert.doesNotMatch(`${shell}\n${script}`, /fetch\(|localStorage|sessionStorage|Pi\.authenticate|createPayment|type="(?:text|number)"/i);
assert.match(css, /min-height:84px/);
assert.match(workerSource, /TRANSFER_REHEARSAL_ROUTE = "\/pervedimo-repeticija"/);
assert.match(workerSource, /transfer-rehearsal-shell\.txt/);

let assetPath = '';
const response = await worker.fetch(new Request('https://example.test/pervedimo-repeticija'), {
  ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html><head><link href="styles.css"><link href="brand.css"><link href="transfer-rehearsal.css"></head><body><script src="transfer-rehearsal.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }); } },
});
const html = await response.text();
assert.equal(response.status, 200);
assert.equal(assetPath, '/transfer-rehearsal-shell.txt');
assert.match(html, /transfer-rehearsal\.css\?v=testnet-payment-checklist-v1/);
assert.match(html, /transfer-rehearsal\.js\?v=testnet-payment-checklist-v1/);
assert.match(response.headers.get('cache-control') || '', /no-store/);
