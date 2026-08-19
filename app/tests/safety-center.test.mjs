import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [html, js, css, home, appJs, workerSource] = await Promise.all([
  readFile(new URL('safety-center-shell.txt', root), 'utf8'),
  readFile(new URL('safety-center.js', root), 'utf8'),
  readFile(new URL('safety-center.css', root), 'utf8'),
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('app.js', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);

assert.match(html, /PioneerHub Safety Center/);
for (const route of ['/sauga', '/sauga/passphrase', '/sauga/itartina-nuoroda', '/sauga/pries-siunciant-pi']) assert.match(workerSource, new RegExp(route.replaceAll('/', '\\/')));
for (const phrase of ['Kažkas prašo mano wallet passphrase', 'Gavau įtartiną Pi nuorodą', 'Prieš siunčiant Pi: 30 sekundžių patikra', 'STOP', 'VERIFY', 'PROTECT', 'Paskutinį kartą peržiūrėta']) assert.match(js, new RegExp(phrase));
assert.match(home, /href="\/sauga"/);
assert.match(appJs, /'Wallet passphrase': '\/sauga\/passphrase'/);
assert.match(appJs, /'Dazni scamai': '\/sauga\/itartina-nuoroda'/);
assert.match(appJs, /'Pi pavedimas': '\/sauga\/pries-siunciant-pi'/);
assert.match(css, /@media\(max-width:420px\)/);
assert.doesNotMatch(`${html}\n${js}\n${css}`, /Pi\.authenticate|Pi\.signIn|createPayment|payments|mainnet|fetch\(/i);
assert.doesNotMatch(js, /sendBeacon|localStorage|sessionStorage/);

for (const route of ['/sauga', '/sauga/passphrase', '/sauga/itartina-nuoroda', '/sauga/pries-siunciant-pi']) {
  let assetPath = '';
  const response = await worker.fetch(new Request(`https://example.test${route}`), {
    ASSETS: { fetch: async request => { assetPath = new URL(request.url).pathname; return new Response('<html>Safety Center</html>', { headers: { 'content-type': 'text/html' } }); } },
  });
  assert.equal(response.status, 200);
  assert.equal(assetPath, '/safety-center-shell.txt', `${route} must be directly routable`);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
}
