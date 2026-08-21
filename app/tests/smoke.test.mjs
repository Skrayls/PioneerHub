import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker, { PaymentLedger } from '../../src/worker.js';

const root = new URL('../', import.meta.url);
const [html, js, css, workerSource] = await Promise.all([
  ...['index.html', 'app.js', 'styles.css'].map(file => readFile(new URL(file, root), 'utf8')),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);
assert.match(html, /PioneerHub nėra Pi Network™/);
assert.match(html, /30 s/);
assert.match(html, /PIONEERHUB SCAM SHIELD · NEMOKAMAS/);
assert.match(html, /PioneerHub nieko neišsaugo/);
assert.match(html, /wallet passphrase, seed frazės arba privataus rakto/);
assert.match(html, /BlackMerchanter/);
assert.match(html, /Jei jau turi pakvietusį žmogų, rinkis jį/);
assert.match(html, /data-event="referral_open"/);
assert.match(html, /App Radar/);
assert.match(html, /href="\/sauga"/);
assert.match(html, /Testnet Payment Lab — užrakinta techninė diagnostika/);
assert.doesNotMatch(html, /href="#lab"/);
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
assert.match(js, /const FRONTEND_BUILD = 'testnet-payment-checklist-v1'/);
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
assert.match(js, /withTimeout\(pi\.authenticate\(NATIVE_PI_AUTH_SCOPES, incompletePayment\), 15000, 'AUTH-PI-AUTHENTICATE-TIMEOUT'\)/);
assert.match(js, /AUTH-PI-AUTHENTICATE-TIMEOUT/);
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

const timeoutSource = js.match(/function withTimeout[\s\S]*?\n}\n\nasync function getNativePiBridge/);
assert.ok(timeoutSource, 'timeout helper must remain available to both native bridge and native auth');
const withTimeout = Function(`${timeoutSource[0].replace(/\n\nasync function getNativePiBridge$/, '')}; return withTimeout;`)();
await assert.rejects(withTimeout(new Promise(() => {}), 1, 'AUTH-PI-AUTHENTICATE-TIMEOUT'), { message: 'AUTH-PI-AUTHENTICATE-TIMEOUT' });
await assert.rejects(withTimeout(Promise.reject(new Error('AUTH-PI-USER-DENIED')), 20, 'AUTH-PI-AUTHENTICATE-TIMEOUT'), { message: 'AUTH-PI-USER-DENIED' });

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

const shell = await worker.fetch(new Request('https://example.test/?build=testnet-payment-checklist-v1'), {
  ASSETS: { fetch: async () => new Response('<html><head><link href="styles.css"></head><body><section id="lab">old</section>\n<section id="community"></section><script src="app.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }) },
});
const shellHtml = await shell.text();
assert.match(shellHtml, /href="\/styles\.css\?v=testnet-payment-checklist-v1"/);
assert.match(shellHtml, /src="\/app\.js\?v=testnet-payment-checklist-v1"/);
assert.doesNotMatch(shellHtml, /Build:/);
assert.doesNotMatch(shellHtml, /FRONTEND-RUNTIME: PENDING|AUTH TESTING/);
assert.equal(shell.headers.get('cache-control'), 'no-store');

for (const [route, shellSource, assets] of [
  ['/sauga/passphrase', '<link href="styles.css"><link href="safety-center.css"><script src="safety-center.js"></script>', ['/styles.css', '/safety-center.css', '/safety-center.js']],
  ['/pervedimo-repeticija', '<link href="styles.css"><link href="brand.css"><link href="transfer-rehearsal.css"><script src="transfer-rehearsal.js"></script>', ['/styles.css', '/brand.css', '/transfer-rehearsal.css', '/transfer-rehearsal.js']],
  ['/kyc-busena', '<link href="styles.css"><link href="brand.css"><link href="kyc-status-navigator.css"><script src="kyc-status-navigator.js"></script>', ['/styles.css', '/brand.css', '/kyc-status-navigator.css', '/kyc-status-navigator.js']],
]) {
  const routeShell = await worker.fetch(new Request(`https://example.test${route}`), {
    ASSETS: { fetch: async () => new Response(`<html><head>${shellSource}</head><body></body></html>`, { headers: { 'content-type': 'text/plain' } }) },
  });
  const routeHtml = await routeShell.text();
  for (const asset of assets) assert.match(routeHtml, new RegExp(`(?:href|src)="${asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?v=testnet-payment-checklist-v1"`), `${route} must emit root-relative ${asset}`);
  assert.doesNotMatch(routeHtml, /(?:href|src)="(?!\/|https?:)[^"]+\.(?:css|js)\?v=/, `${route} must not emit relative required assets`);
}

let callbackAssetPath;
const callback = await worker.fetch(new Request('https://example.test/signin/callback'), {
  ASSETS: { fetch: async request => {
    callbackAssetPath = new URL(request.url).pathname;
    return new Response('<html><body><section id="lab"></section></body></html>', { headers: { 'content-type': 'text/html' } });
  } },
});
assert.equal(callback.status, 200);
assert.equal(callbackAssetPath, '/', 'OAuth callback must receive the application shell');

let signInAssetFetch = false;
const signInDiagnostic = await worker.fetch(new Request('https://example.test/diag/pi-signin'), {
  ASSETS: { fetch: async () => { signInAssetFetch = true; return new Response('unreachable'); } },
});
const signInHtml = await signInDiagnostic.text();
assert.equal(signInDiagnostic.status, 200);
assert.equal(signInAssetFetch, false, 'Pi Sign-In diagnostic must not bootstrap PioneerHub assets');
assert.match(signInHtml, /Pi Sign-In Isolation Harness/);
assert.match(signInHtml, /await Pi\.init\(\{ version: "2\.0" \}\)/);
assert.match(signInHtml, /crypto\.randomUUID/);
assert.match(signInHtml, /pi_signin_diag_state/);
assert.match(signInHtml, /clientId: "VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4"/);
assert.match(signInHtml, /redirectUri: "https:\/\/pioneerhub\.andriussimonaitis\.workers\.dev\/signin\/callback"/);
assert.match(signInHtml, /scopes: \["username"\]/);
assert.match(signInHtml, /Pi\.signIn\(\{ clientId: "VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4", redirectUri: "https:\/\/pioneerhub\.andriussimonaitis\.workers\.dev\/signin\/callback", scopes: \["username"\], state \}\)/);
assert.match(signInHtml, /SIGNIN_CLICK/);
assert.match(signInHtml, /STATE_CREATED/);
assert.doesNotMatch(signInHtml, /scopes:\s*\[[^\]]*payments|createPayment|\/api\/pi\/auth|localStorage|document\.cookie/i);

const signInCallback = await worker.fetch(new Request('https://example.test/signin/callback'), {
  ASSETS: { fetch: async () => new Response('<html><body><script src="app.js"></script></body></html>', { headers: { 'content-type': 'text/html' } }) },
});
const signInCallbackHtml = await signInCallback.text();
assert.match(signInCallbackHtml, /data-pioneerhub-product-app/);
assert.match(signInCallbackHtml, /pi_signin_diag_state/);
assert.match(signInCallbackHtml, /window\.location\.hash|location\.hash/);
assert.match(signInCallbackHtml, /CALLBACK_LOADED/);
assert.match(signInCallbackHtml, /STATE_MISMATCH/);
assert.match(signInCallbackHtml, /history\.replaceState\(null, '', window\.location\.pathname\)/);
assert.match(signInCallbackHtml, /https:\/\/api\.minepi\.com\/v2\/me/);
assert.ok(signInCallbackHtml.indexOf('if (!stateMatch)') < signInCallbackHtml.indexOf("const accessToken = fragment.get('access_token')"), 'Pi Sign-In state must validate before token use');
assert.ok(signInCallbackHtml.indexOf('history.replaceState') < signInCallbackHtml.indexOf("fetch('https://api.minepi.com/v2/me'"), 'Pi Sign-In fragments must clear before /v2/me');
assert.doesNotMatch(signInCallbackHtml, /createPayment|\/api\/pi\/auth|payments/i);

let diagnosticAssetFetch = false;
const diagnostic = await worker.fetch(new Request('https://example.test/diag/pi-auth'), {
  ASSETS: { fetch: async () => { diagnosticAssetFetch = true; return new Response('unreachable'); } },
});
const diagnosticHtml = await diagnostic.text();
assert.equal(diagnostic.status, 200);
assert.equal(diagnosticAssetFetch, false, 'diagnostic must not bootstrap PioneerHub assets');
assert.match(diagnostic.headers.get('content-security-policy'), /https:\/\/sdk\.minepi\.com 'nonce-/);
assert.match(diagnosticHtml, /<script src="https:\/\/sdk\.minepi\.com\/pi-sdk\.js"><\/script>/);
assert.match(diagnosticHtml, /await Pi\.init\(\{ version: "2\.0" \}\);/);
assert.match(diagnosticHtml, /id="auth-username" type="button" disabled/);
assert.match(diagnosticHtml, /INIT_CALL_ENTER/);
assert.match(diagnosticHtml, /INIT_RESOLVED/);
assert.match(diagnosticHtml, /INIT_REJECTED/);
assert.match(diagnosticHtml, /AUTH_CALL_ENTER/);
assert.match(diagnosticHtml, /AUTH_PROMISE_CREATED/);
assert.match(diagnosticHtml, /AUTH_RESOLVED/);
assert.match(diagnosticHtml, /AUTH_REJECTED/);
assert.match(diagnosticHtml, /const scopes = \["username"\];/);
assert.match(diagnosticHtml, /function onIncompletePaymentFound\(payment\)/);
assert.match(diagnosticHtml, /Pi\.authenticate\(scopes, onIncompletePaymentFound\)/);
assert.match(diagnosticHtml, /AUTH_SCOPES/);
assert.match(diagnosticHtml, /AUTH_CALLBACK_TYPE/);
assert.match(diagnosticHtml, /INCOMPLETE_PAYMENT_CALLBACK/);
assert.match(diagnosticHtml, /RUNTIME_CONTEXT/);
assert.match(diagnosticHtml, /location\.href/);
assert.match(diagnosticHtml, /navigator\.userAgent/);
assert.match(diagnosticHtml, /Object\.getOwnPropertyNames/);
assert.match(diagnosticHtml, /ownPropertyNames/);
assert.match(diagnosticHtml, /\[REDACTED\]/);
assert.match(diagnosticHtml, /accessTokenExists: Boolean\(result\?\.accessToken\)/);
assert.match(diagnosticHtml, /Testnet-only diagnostic\. Payments are locked\./);
assert.doesNotMatch(diagnosticHtml, /createPayment|\/api\/pi\/auth|beginPiSignIn|nativeFeaturesList|fetch\(|localStorage|sessionStorage/i);
assert.doesNotMatch(diagnosticHtml, /render\([^\n]*accessToken[^\n]*\)/);
assert.match(workerSource, /const FRONTEND_BUILD = "testnet-payment-checklist-v1";/, 'App Inspector build marker must be current');
assert.match(workerSource, /PI_AUTH_DIAGNOSTIC_PATH = "\/diag\/pi-auth"/);

let paymentChecklistAssetFetch = false;
const paymentChecklist = await worker.fetch(new Request('https://example.test/diag/pi-payment-checklist'), {
  ASSETS: { fetch: async () => { paymentChecklistAssetFetch = true; return new Response('unreachable'); } },
  PI_NETWORK: 'testnet', PI_TESTNET_API_KEY: 'test-credential', PI_SESSION_SECRET: 'session-secret', PAYMENT_LEDGER: {}, AUTH_SESSIONS: {},
});
const paymentChecklistHtml = await paymentChecklist.text();
assert.equal(paymentChecklist.status, 200);
assert.equal(paymentChecklistAssetFetch, false, 'payment checklist must not bootstrap PioneerHub product assets');
assert.match(paymentChecklist.headers.get('x-robots-tag') || '', /noindex/);
assert.match(paymentChecklist.headers.get('content-security-policy') || '', /https:\/\/sdk\.minepi\.com 'nonce-/);
assert.match(paymentChecklistHtml, /TESTNET ONLY/);
assert.match(paymentChecklistHtml, /TEST-PI HAS NO REAL VALUE/);
assert.match(paymentChecklistHtml, /DEVELOPER PORTAL CONNECTIVITY TEST/);
assert.match(paymentChecklistHtml, /Run Testnet checklist transaction/);
assert.match(paymentChecklistHtml, /const amount = 0\.01;/);
assert.match(paymentChecklistHtml, /PioneerHub Testnet Developer Portal verification/);
assert.match(paymentChecklistHtml, /purpose":"developer_portal_checklist/);
assert.match(paymentChecklistHtml, /pi\.authenticate\(\['payments'\], onIncompletePaymentFound\)/);
assert.match(paymentChecklistHtml, /PI_INIT_ENTERED/);
assert.match(paymentChecklistHtml, /PI_INIT_RESOLVED/);
assert.match(paymentChecklistHtml, /PI_INIT_REJECTED/);
assert.match(paymentChecklistHtml, /PI_AUTHENTICATE_ENTERED/);
assert.match(paymentChecklistHtml, /PI_AUTHENTICATE_PROMISE_CREATED/);
assert.match(paymentChecklistHtml, /PI_AUTHENTICATE_RESOLVED/);
assert.match(paymentChecklistHtml, /PI_AUTHENTICATE_REJECTED/);
assert.match(paymentChecklistHtml, /AUTH_PI_INIT_FAILED|AUTH_PI_REJECTED|AUTH_PI_SCOPE_FAILED/);
assert.match(paymentChecklistHtml, /AUTH_ACCESS_TOKEN_MISSING/);
assert.match(paymentChecklistHtml, /AUTH_SERVER_VERIFY_FAILED/);
assert.match(paymentChecklistHtml, /AUTH_SERVER_SESSION_FAILED/);
assert.match(paymentChecklistHtml, /RUNTIME_CONTEXT/);
assert.match(paymentChecklistHtml, /accessTokenExists/);
assert.match(paymentChecklistHtml, /uidExists/);
assert.match(paymentChecklistHtml, /await serverPayment\(paymentId, 'approve'\);/);
assert.match(paymentChecklistHtml, /await serverPayment\(paymentId, 'complete', txid\);/);
assert.ok(paymentChecklistHtml.indexOf('onReadyForServerApproval:') < paymentChecklistHtml.indexOf('onReadyForServerCompletion:'), 'approval callback must be defined before completion callback');
assert.match(paymentChecklistHtml, /onIncompletePaymentFound\(payment\)/);
assert.match(paymentChecklistHtml, /No new payment will be created/);
assert.match(paymentChecklistHtml, /if \(incompletePayment\) \{ await recoverIncomplete\(incompletePayment\); return; \}/);
assert.match(paymentChecklistHtml, /Pi\.createPayment\(\{ amount, memo, metadata \}, callbacks\)/);
assert.match(paymentChecklistHtml, /async function run\(\) \{[\s\S]*?Pi\.createPayment\(\{ amount, memo, metadata \}, callbacks\)/, 'createPayment must remain inside the click target');
assert.ok(paymentChecklistHtml.indexOf('await authenticate();') < paymentChecklistHtml.indexOf('Pi.createPayment'), 'createPayment must follow successful authentication');
assert.match(paymentChecklistHtml, /button\.addEventListener\('click', run\)/, 'the payment flow must require an explicit click');
assert.match(paymentChecklistHtml, /SUCCESS: PioneerHub server completed the Testnet transaction/);
assert.doesNotMatch(paymentChecklistHtml, /PI_TESTNET_API_KEY|PI_SESSION_SECRET|passphrase|seed phrase|private key/i);

const paymentChecklistLocked = await worker.fetch(new Request('https://example.test/diag/pi-payment-checklist'), {
  ASSETS: { fetch: async () => new Response('unreachable') }, PI_NETWORK: 'mainnet', PI_TESTNET_API_KEY: 'test-credential', PI_SESSION_SECRET: 'session-secret', PAYMENT_LEDGER: {}, AUTH_SESSIONS: {},
});
assert.equal(paymentChecklistLocked.status, 503, 'payment checklist must fail closed outside Testnet');
assert.doesNotMatch(await paymentChecklistLocked.text(), /createPayment|Pi SDK/i);

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

const mainnetAuth = await worker.fetch(new Request('https://example.test/api/pi/auth', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: 'valid-access-token' }),
}), { ASSETS: { fetch: async () => new Response('unreachable') }, PI_NETWORK: 'mainnet', PI_TESTNET_API_KEY: 'secret', PI_SESSION_SECRET: 'session-secret', AUTH_SESSIONS: {} });
assert.equal(mainnetAuth.status, 503);
assert.deepEqual(await mainnetAuth.json(), { code: 'AUTH-SESSION' });

const nativeFetchForAuthFailure = globalThis.fetch;
globalThis.fetch = async () => new Response('{}', { status: 401 });
const rejectedVerification = await worker.fetch(new Request('https://example.test/api/pi/auth', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: 'valid-access-token' }),
}), { ASSETS: { fetch: async () => new Response('unreachable') }, PI_NETWORK: 'testnet', PI_TESTNET_API_KEY: 'secret', PI_SESSION_SECRET: 'session-secret', AUTH_SESSIONS: {} });
globalThis.fetch = nativeFetchForAuthFailure;
assert.equal(rejectedVerification.status, 401);
assert.deepEqual(await rejectedVerification.json(), { code: 'AUTH-ME-VERIFY' });

const nativeFetchForSessionFailure = globalThis.fetch;
globalThis.fetch = async () => Response.json({ uid: 'verified-user' });
const rejectedSession = await worker.fetch(new Request('https://example.test/api/pi/auth', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: 'valid-access-token' }),
}), {
  ASSETS: { fetch: async () => new Response('unreachable') }, PI_NETWORK: 'testnet', PI_TESTNET_API_KEY: 'secret', PI_SESSION_SECRET: 'session-secret',
  AUTH_SESSIONS: { idFromName: value => value, get: () => ({ fetch: async () => new Response(null, { status: 503 }) }) },
});
globalThis.fetch = nativeFetchForSessionFailure;
assert.equal(rejectedSession.status, 503);
assert.deepEqual(await rejectedSession.json(), { code: 'AUTH-SESSION' });

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
