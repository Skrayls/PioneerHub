import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';
const root = new URL('../', import.meta.url);
const [learn, workerSource] = await Promise.all([readFile(new URL('learn-v2.js', root), 'utf8'), readFile(new URL('../../src/worker.js', import.meta.url), 'utf8')]);
const routes = ['/mokykis/pi-network','/mokykis/balanso-busenos','/mokykis/perkeltas-balansas','/mokykis/perkeliamas-balansas','/mokykis/nepatvirtintas-balansas','/mokykis/mainnet','/mokykis/pi-wallet','/mokykis/kyc','/mokykis/mainnet-checklist','/mokykis/lockup','/mokykis/referral-team','/mokykis/security-circle','/mokykis/kyc-validator','/mokykis/node','/mokykis/pi-browser-apps'];
for (const route of routes) { assert.match(workerSource, new RegExp(route.replaceAll('/', '\\/'))); let path=''; const response=await worker.fetch(new Request(`https://example.test${route}`),{ASSETS:{fetch:async request=>{path=new URL(request.url).pathname;return new Response('<html>Learn</html>',{headers:{'content-type':'text/html'}})}}}); assert.equal(response.status,200); assert.equal(path,'/learn-shell.txt'); }
for (const heading of ['Trumpas atsakymas','Ką tai reiškia','Ką daryti','Ko nedaryti / dažnos klaidos','Jei kyla problema','Oficialūs šaltiniai','Paskutinį kartą peržiūrėta']) assert.match(learn,new RegExp(heading));
assert.match(learn,/wallet piniginė migration perkėlimas/);
assert.doesNotMatch(learn,/Pi\.authenticate|Pi\.signIn|createPayment|fetch\(/i);
