import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [radar, evidence, shell, workerSource, home, app] = await Promise.all([
  readFile(new URL('radar-v2.js', root), 'utf8'),
  readFile(new URL('evidence-v1.js', root), 'utf8'),
  readFile(new URL('radar-shell.txt', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('app.js', root), 'utf8'),
]);

const routes = ['/radar/metodika', '/radar/pi-browser', '/radar/pi-wallet', '/radar/fireside-forum', '/radar/pi-chats', '/radar/kyc', '/radar/pi-launchpad', '/radar/cidi-games'];
for (const route of routes) assert.match(workerSource, new RegExp(route.replaceAll('/', '\\/')));
for (const name of ['Pi Browser', 'Pi Wallet', 'Fireside Forum', 'Pi Chats', 'KYC', 'Pi Launchpad', 'CiDi Games']) assert.match(evidence, new RegExp(name));
for (const label of ['PATVIRTINTI PAGRINDAI', 'ATSARGIAI', 'RIBOTI DUOMENYS', 'VENGTI / DIDELĖ RIZIKA']) assert.match(evidence, new RegExp(label));
for (const label of ['Šviežia peržiūra', 'Peržiūra netrukus', 'Peržiūra vėluoja']) assert.match(evidence, new RegExp(label));
assert.match(evidence, /const FRESH_DAYS = 14/);
assert.match(evidence, /const DUE_DAYS = 30/);
assert.match(radar, /Ką PioneerHub patikrino/);
assert.match(radar, /Ko negalėjome patikrinti/);
assert.match(evidence, /PioneerHub netestavo/);
assert.doesNotMatch(radar, /const localRecords/);
assert.match(radar, /radarSearch/);
assert.match(radar, /radarStatus/);
assert.match(radar, /radarFreshness/);
assert.match(shell, /PioneerHub App Radar/);
assert.match(shell, /evidence-v1\.js/);
assert.match(shell, /Nepriklausomas informacinis įrankis/);
assert.match(home, /Sužinok, ką PioneerHub realiai peržiūrėjo/);
assert.match(home, /href="\/radar\/metodika"/);
assert.match(app, /evidenceScript\.src = '\/evidence-v1\.js\?v=app-radar-v2'/);
assert.match(app, /evidenceScript\.onload = loadRadar/);
assert.doesNotMatch(`${radar}\n${shell}`, /Pi\.authenticate|Pi\.signIn|createPayment|fetch\(|passphrase.*(?:input|form)|seed phrase/i);

for (const route of routes) {
  let assetPath = '';
  const response = await worker.fetch(new Request(`https://example.test${route}`), {
    ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html><title>PioneerHub App Radar</title></html>', { headers: { 'content-type': 'text/html' } }); } },
  });
  assert.equal(response.status, 200);
  assert.equal(assetPath, '/radar-shell.txt', `${route} must resolve directly`);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
}
