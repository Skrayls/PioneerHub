import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [html, js, css] = await Promise.all(['index.html', 'app.js', 'styles.css'].map(file => readFile(new URL(file, root), 'utf8')));
assert.match(html, /PioneerHub nėra Pi Network™/);
assert.match(html, /30 sekundžių patikra/i);
assert.match(html, /PIONEERHUB SCAM SHIELD · NEMOKAMAS/);
assert.match(html, /PioneerHub nieko neišsaugo/);
assert.match(html, /wallet passphrase, seed frazės arba privataus rakto/);
assert.match(html, /BlackMerchanter/);
assert.match(html, /Jei jau turi pakvietusį žmogų, rinkis jį/);
assert.match(html, /data-event="referral_open"/);
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
assert.match(js, /scam_shield_start/);
assert.match(js, /scam_shield_complete/);
assert.match(js, /PIONEERHUB TESTED/);
assert.match(js, /OFFICIAL \/ ECOSYSTEM RESOURCE/);
assert.match(js, /NOT YET TESTED/);
assert.doesNotMatch(html, /seed phrase|private key|connect wallet/i);
assert.doesNotMatch(html, /textarea|type="text"/i);
assert.doesNotMatch(js, /Pi\.authenticate\s*\(/);
assert.doesNotMatch(js, /createPayment\s*\(/);
assert.match(css, /@media/);

const brand = await readFile(new URL('brand.css', root), 'utf8');
assert.match(brand, /#2946a3/);
assert.match(brand, /@media/);

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

const validationFile = await worker.fetch(new Request('https://example.test/validation-key.txt'), {
  ASSETS: { fetch: async () => new Response('unreachable') },
  PI_DOMAIN_VALIDATION_CONTENT: 'portal-issued-proof',
});
assert.equal(validationFile.status, 200);
assert.equal(await validationFile.text(), 'portal-issued-proof');
assert.equal(validationFile.headers.get('cache-control'), 'no-store');
assert.equal(validationFile.headers.get('content-type'), 'text/plain; charset=utf-8');
assert.equal(validationFile.headers.get('x-content-type-options'), 'nosniff');
assert.equal(validationFile.headers.get('referrer-policy'), 'no-referrer');
assert.equal(validationFile.headers.get('x-frame-options'), 'DENY');
assert.match(validationFile.headers.get('content-security-policy'), /default-src 'none'/);

const event = await worker.fetch(new Request('https://example.test/events', { method: 'POST', body: 'safety_check_complete' }), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'production' });
assert.equal(event.status, 204);

const shieldEvent = await worker.fetch(new Request('https://example.test/events', { method: 'POST', body: 'scam_shield_complete' }), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'production' });
assert.equal(shieldEvent.status, 204);

const referralEvent = await worker.fetch(new Request('https://example.test/events', { method: 'POST', body: 'referral_open' }), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'production' });
assert.equal(referralEvent.status, 204);

const arbitraryEvent = await worker.fetch(new Request('https://example.test/events', { method: 'POST', body: 'scam_shield_complete:wallet-or-user-data' }), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'production' });
assert.equal(arbitraryEvent.status, 204);
