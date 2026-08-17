import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker, { PaymentLedger } from '../../src/worker.js';

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
assert.match(html, /READY: serverinis/);
assert.match(html, /TESTNET INTEGRATION ACTIVE — AUTH TESTING/);
assert.match(html, /Test-Pi užrakintas/);
assert.doesNotMatch(html, /REQUIRES PI DEVELOPER PORTAL CONFIGURATION/);
assert.match(html, /<script src="https:\/\/sdk\.minepi\.com\/pi-sdk\.js"><\/script>/);
assert.doesNotMatch(html, /Pi\.init/);
assert.match(js, /passphrase/);
assert.match(js, /learn_article_open/);
assert.match(js, /scam_shield_start/);
assert.match(js, /scam_shield_complete/);
assert.match(js, /PIONEERHUB TESTED/);
assert.match(js, /OFFICIAL \/ ECOSYSTEM RESOURCE/);
assert.match(js, /NOT YET TESTED/);
assert.doesNotMatch(html, /seed phrase|private key|connect wallet/i);
assert.doesNotMatch(html, /textarea|type="text"/i);
assert.match(js, /const FRONTEND_BUILD = 'pi-dual-auth-r11'/);
assert.match(js, /PI_SIGNIN_CLIENT_ID/);
assert.match(js, /https:\/\/pioneerhub\.andriussimonaitis\.workers\.dev\/signin\/callback/);
assert.match(js, /response_type: 'token'/);
assert.match(js, /scope: 'username'/);
assert.match(js, /crypto\.getRandomValues\(new Uint8Array\(32\)\)/);
assert.match(js, /sessionStorage\.setItem\(PI_SIGNIN_STATE_KEY, state\)/);
assert.match(js, /sessionStorage\.removeItem\(PI_SIGNIN_STATE_KEY\)/);
assert.match(js, /fragment\.get\('state'\) !== expected/);
assert.match(js, /fragment\.get\('token_type'\) !== 'Bearer'/);
assert.match(js, /history\.replaceState\(\{\}, document\.title, location\.pathname\)/);
assert.match(js, /await request\('\/api\/pi\/auth', \{ accessToken \}\)/);
assert.ok(js.indexOf('history.replaceState') < js.indexOf("await request('/api/pi/auth'"), 'OAuth fragments must be removed before backend submission');
assert.doesNotMatch(js, /auth-demo-scopes-r9/);
assert.match(js, /function getNativePiBridge\(\)/);
assert.match(js, /pi\.nativeFeaturesList\(\)/);
assert.match(js, /if \(!pi\) \{\s*beginPiSignIn\(\);\s*return;/);
assert.match(js, /const NATIVE_PI_AUTH_SCOPES = \['username', 'payments'\]/);
assert.match(js, /pi\.authenticate\(NATIVE_PI_AUTH_SCOPES, incompletePayment\)/);
assert.match(js, /await request\('\/api\/pi\/auth', \{ accessToken: result\.accessToken \}\)/);
assert.doesNotMatch(js, /result\.user\.uid/);
assert.match(js, /AUTH-PI-APP-ACCESS/);
assert.match(js, /AUTH-PI-SCOPE/);
assert.match(js, /AUTH-PI-INCOMPLETE-PAYMENT/);
assert.doesNotMatch(js, /pi\.createPayment\(/);
assert.doesNotMatch(js, /function loadPiSdk/);
assert.match(js, /let piInitPromise = null/);
assert.match(js, /function getPiReady\(\)/);
assert.match(js, /await window\.Pi\.init\(\{ version: '2\.0' \}\)/);
assert.match(js, /AUTH-PI-ORIGIN/);
assert.match(js, /AUTH-PI-SDK-INIT/);
assert.match(js, /AUTH-SDK-INIT-NO-BRIDGE/);
assert.match(js, /AUTH-SDK-INIT-REJECTED/);
assert.doesNotMatch(js, /sandbox:\s*true/);
assert.doesNotMatch(js, /passphrase.*fetch|fetch.*passphrase/i);
assert.match(css, /@media/);

const brand = await readFile(new URL('brand.css', root), 'utf8');
assert.match(brand, /#2946a3/);
assert.match(brand, /@media/);

const response = await worker.fetch(new Request('https://example.test/app.js'), {
  ASSETS: { fetch: async () => new Response('ok', { status: 200, headers: { 'content-type': 'application/javascript' } }) },
});
assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
assert.match(response.headers.get('content-security-policy'), /https:\/\/\*\.pinet\.com/);
assert.equal(response.headers.get('x-frame-options'), null);
assert.match(response.headers.get('content-security-policy'), /sdk\.minepi\.com/);
assert.equal(response.headers.get('cache-control'), 'no-cache');

const shell = await worker.fetch(new Request('https://example.test/?build=pi-dual-auth-r11'), {
  ASSETS: { fetch: async () => new Response('<html><head><link href="styles.css"></head><body><section id="lab">old</section>\n<section id="community"></section><script src="app.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }) },
});
const shellHtml = await shell.text();
assert.match(shellHtml, /styles\.css\?v=pi-dual-auth-r11/);
assert.match(shellHtml, /app\.js\?v=pi-dual-auth-r11/);
assert.match(shellHtml, /Build: pi-dual-auth-r11/);
assert.match(shellHtml, /FRONTEND-RUNTIME: PENDING/);
assert.equal(shell.headers.get('cache-control'), 'no-store');

let callbackAssetPath;
const callback = await worker.fetch(new Request('https://example.test/signin/callback'), {
  ASSETS: { fetch: async request => {
    callbackAssetPath = new URL(request.url).pathname;
    return new Response('<html><body><section id="lab"></section></body></html>', { headers: { 'content-type': 'text/html' } });
  } },
});
assert.equal(callback.status, 200);
assert.equal(callbackAssetPath, '/', 'OAuth callback must receive the application shell');

const nativeFetchForAuth = globalThis.fetch;
const storedSessions = [];
globalThis.fetch = async (url, init) => {
  assert.equal(url, 'https://api.minepi.com/v2/me');
  assert.equal(init.headers.Authorization, 'Bearer oauth-access-token');
  return Response.json({ uid: 'oauth-user' });
};
const oauthAuth = await worker.fetch(new Request('https://example.test/api/pi/auth', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: 'oauth-access-token' }),
}), {
  ASSETS: { fetch: async () => new Response('unreachable') },
  PI_NETWORK: 'testnet', PI_TESTNET_API_KEY: 'test-credential', PI_SESSION_SECRET: 'session-secret',
  AUTH_SESSIONS: {
    idFromName: value => value,
    get: () => ({ fetch: async (_url, init) => { storedSessions.push(JSON.parse(init.body)); return new Response(null, { status: 204 }); } }),
  },
});
globalThis.fetch = nativeFetchForAuth;
assert.equal(oauthAuth.status, 200);
assert.equal((await oauthAuth.json()).authenticated, true);
assert.deepEqual(storedSessions.map(session => Object.keys(session).sort()), [['exp', 'uid']]);
assert.deepEqual(storedSessions.map(session => session.uid), ['oauth-user']);

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

const piStatus = await worker.fetch(new Request('https://example.test/api/pi/status'), { ASSETS: { fetch: async () => new Response('unreachable') }, APP_ENV: 'production', PI_NETWORK: 'testnet', PI_TESTNET_API_KEY: 'secret', PI_SESSION_SECRET: 'session-secret', PAYMENT_LEDGER: {}, AUTH_SESSIONS: {} });
assert.deepEqual(await piStatus.json(), { network: 'testnet', auth: 'ready', payments: 'ready' });

const malformedAuth = await worker.fetch(new Request('https://example.test/api/pi/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }), { ASSETS: { fetch: async () => new Response('unreachable') }, PI_NETWORK: 'testnet', PI_TESTNET_API_KEY: 'secret', PI_SESSION_SECRET: 'session-secret', AUTH_SESSIONS: {} });
assert.equal(malformedAuth.status, 400);
assert.doesNotMatch(await malformedAuth.text(), /secret|token/i);

const records = new Map();
const state = {
  storage: { get: async key => records.get(key), put: async (key, value) => records.set(key, value) },
  blockConcurrencyWhile: async callback => callback(),
};
const ledger = new PaymentLedger(state, { PI_TESTNET_API_KEY: 'test-credential' });
const nativeFetch = globalThis.fetch;
let piCalls = 0;
globalThis.fetch = async () => { piCalls += 1; return new Response('{}', { status: 200 }); };
const paymentInput = (action, txid) => new Request('https://payment.internal/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, paymentId: 'payment_123', uid: 'user_123', txid }) });
assert.equal((await ledger.fetch(paymentInput('approve'))).status, 200);
assert.equal((await ledger.fetch(paymentInput('approve'))).status, 200);
assert.equal(piCalls, 1);
assert.equal((await ledger.fetch(paymentInput('complete', 'tx_123'))).status, 200);
assert.equal((await ledger.fetch(paymentInput('complete', 'tx_123'))).status, 200);
assert.equal(piCalls, 2);
globalThis.fetch = nativeFetch;
