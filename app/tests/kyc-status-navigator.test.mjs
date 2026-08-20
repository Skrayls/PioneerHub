import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [shell, script, css, home, workerSource] = await Promise.all([
  readFile(new URL('kyc-status-navigator-shell.txt', root), 'utf8'),
  readFile(new URL('kyc-status-navigator.js', root), 'utf8'),
  readFile(new URL('kyc-status-navigator.css', root), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);

assert.match(shell, /KYC būsenos navigatorius \| PioneerHub/);
assert.match(shell, /nėra Pi prisijungimo, dokumentų, ekrano nuotraukų, vartotojo vardo ar statuso įvedimo/);
assert.match(home, /href="\/kyc-busena"/);
for (const situation of ['Dar nematau KYC kvietimo arba eigos', 'KYC pradėjau, bet būsena ilgai nesikeičia', 'Kažkas prašo mokesčio, dokumentų ar prisijungimo dėl KYC', 'Matau neaiškų pranešimą arba nežinau, ką reiškia būsena']) assert.match(script, new RegExp(situation));
assert.match(script, /PioneerHub negali matyti/);
assert.match(script, /\/sauga/);
assert.doesNotMatch(`${shell}\n${script}`, /fetch\(|sendBeacon|localStorage|sessionStorage|Pi\.authenticate|Pi\.signIn|createPayment|type="(?:text|file|number)"/i);
assert.match(css, /min-height:88px/);
assert.match(workerSource, /KYC_STATUS_NAVIGATOR_ROUTE = "\/kyc-busena"/);
assert.match(workerSource, /kyc-status-navigator-shell\.txt/);

let assetPath = '';
const response = await worker.fetch(new Request('https://example.test/kyc-busena'), {
  ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html><head><link href="styles.css"><link href="brand.css"><link href="kyc-status-navigator.css"></head><body><script src="kyc-status-navigator.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }); } },
});
const html = await response.text();
assert.equal(response.status, 200);
assert.equal(assetPath, '/kyc-status-navigator-shell.txt');
assert.match(html, /kyc-status-navigator\.css\?v=p0-ui-recovery-v1/);
assert.match(html, /kyc-status-navigator\.js\?v=p0-ui-recovery-v1/);
assert.match(response.headers.get('cache-control') || '', /no-store/);
