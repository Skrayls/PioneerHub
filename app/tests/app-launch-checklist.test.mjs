import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [shell, script, css, home, workerSource] = await Promise.all([
  readFile(new URL('app-launch-checklist-shell.txt', root), 'utf8'),
  readFile(new URL('app-launch-checklist.js', root), 'utf8'),
  readFile(new URL('app-launch-checklist.css', root), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);

assert.match(shell, /Pi app paleidimo patikra \| PioneerHub/);
assert.match(shell, /Tai nėra Pi patvirtinimas/);
assert.match(shell, /neįvedami app duomenys, prisijungimai ar nuorodos/);
assert.match(home, /href="\/app-paleidimo-checklist"/);
for (const label of ['kokią konkrečią problemą sprendžia mano appas', 'Pagrindinį veiksmą išbandžiau', 'neprašo passphrase', 'oficialius Pi Developer Portal reikalavimus']) assert.match(script, new RegExp(label));
assert.match(script, /nėra leidimas, sertifikatas ar Pi patvirtinimas/);
assert.match(script, /pi-apps\.github\.io\/community-developer-guide/);
assert.doesNotMatch(`${shell}\n${script}`, /fetch\(|sendBeacon|localStorage|sessionStorage|Pi\.authenticate|Pi\.signIn|createPayment|type="(?:text|file|number)"/i);
assert.match(css, /min-height:64px/);
assert.match(workerSource, /APP_LAUNCH_CHECKLIST_ROUTE = "\/app-paleidimo-checklist"/);
assert.match(workerSource, /app-launch-checklist-shell\.txt/);

let assetPath = '';
const response = await worker.fetch(new Request('https://example.test/app-paleidimo-checklist'), {
  ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html><head><link href="styles.css"><link href="brand.css"><link href="app-launch-checklist.css"></head><body><script src="app-launch-checklist.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }); } },
});
const html = await response.text();
assert.equal(response.status, 200);
assert.equal(assetPath, '/app-launch-checklist-shell.txt');
assert.match(html, /app-launch-checklist\.css\?v=app-inspector-v1/);
assert.match(html, /app-launch-checklist\.js\?v=app-inspector-v1/);
assert.match(response.headers.get('cache-control') || '', /no-store/);
