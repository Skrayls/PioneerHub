import assert from 'node:assert/strict';

const base = process.env.PIONEERHUB_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set PIONEERHUB_URL to the deployed Worker URL.');
if (!base.startsWith('https://')) throw new Error('Production smoke tests require HTTPS.');

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  return response;
}

const home = await get('/?build=mua-measurement-v1');
assert.equal(home.status, 200, 'homepage must return HTTP 200');
const homeHtml = await home.text();
assert.match(homeHtml, /PioneerHub/);
assert.doesNotMatch(homeHtml, /Build:/);
assert.match(homeHtml, /app\.js\?v=mua-measurement-v1/);
for (const [header, pattern] of Object.entries({
  'content-security-policy': /frame-ancestors 'self' https:\/\/pinet\.com https:\/\/\*\.pinet\.com https:\/\/minepi\.com https:\/\/\*\.minepi\.com/,
  'x-content-type-options': /nosniff/,
  'referrer-policy': /strict-origin-when-cross-origin/,
  'permissions-policy': /camera=\(\)/,
})) assert.match(home.headers.get(header) || '', pattern, `${header} missing or invalid`);
assert.equal(home.headers.get('x-frame-options'), null, 'app pages must rely on the narrow Pi-compatible CSP frame-ancestors policy');
assert.match(home.headers.get('cache-control') || '', /no-store/, 'HTML shell must not remain cached');

const health = await get('/healthz');
assert.equal(health.status, 200, 'health endpoint must return HTTP 200');
assert.equal((await health.json()).status, 'ok');
const css = await get('/styles.css?v=mua-measurement-v1');
assert.equal(css.status, 200, 'CSS must return HTTP 200');
assert.match(css.headers.get('cache-control') || '', /immutable/);
const js = await get('/app.js?v=mua-measurement-v1');
assert.equal(js.status, 200, 'JS must return HTTP 200');
assert.match(await js.text(), /FRONTEND-RUNTIME: PARKED/);
assert.match(js.headers.get('cache-control') || '', /immutable/);
for (const route of ['/sauga', '/sauga/passphrase', '/sauga/itartina-nuoroda', '/sauga/pries-siunciant-pi']) {
  const safety = await get(route);
  assert.equal(safety.status, 200, `${route} must return HTTP 200`);
  const safetyHtml = await safety.text();
  assert.match(safetyHtml, /PioneerHub Safety Center/);
  assert.doesNotMatch(safetyHtml, /Pi\.authenticate|createPayment|mainnet/i);
}
for (const route of ['/radar/metodika', '/radar/pi-browser', '/radar/pi-wallet', '/radar/fireside-forum', '/radar/pi-chats', '/radar/kyc', '/radar/pi-launchpad', '/radar/cidi-games']) {
  const radar = await get(route);
  assert.equal(radar.status, 200, `${route} must return HTTP 200`);
  const radarHtml = await radar.text();
  assert.match(radarHtml, /PioneerHub App Radar/);
  assert.doesNotMatch(radarHtml, /Pi\.authenticate|createPayment/i);
}
const diagnostic = await get('/diag/pi-auth');
assert.equal(diagnostic.status, 200, 'Pi auth diagnostic must return HTTP 200');
const diagnosticHtml = await diagnostic.text();
assert.match(diagnosticHtml, /Pi Auth Isolation Harness/);
assert.match(diagnosticHtml, /await Pi\.init\(\{ version: "2\.0" \}\);/);
assert.match(diagnosticHtml, /INIT_RESOLVED/);
assert.match(diagnosticHtml, /const scopes = \["username"\];/);
assert.match(diagnosticHtml, /Pi\.authenticate\(scopes, onIncompletePaymentFound\)/);
assert.match(diagnosticHtml, /AUTH_PROMISE_CREATED/);
assert.match(diagnosticHtml, /AUTH_REJECTED/);
assert.match(diagnosticHtml, /RUNTIME_CONTEXT/);
assert.doesNotMatch(diagnosticHtml, /createPayment|\/api\/pi\/auth|beginPiSignIn|nativeFeaturesList/i);
assert.match(diagnostic.headers.get('content-security-policy') || '', /https:\/\/sdk\.minepi\.com 'nonce-/);
const signInDiagnostic = await get('/diag/pi-signin');
assert.equal(signInDiagnostic.status, 200, 'Pi Sign-In diagnostic must return HTTP 200');
const signInHtml = await signInDiagnostic.text();
assert.match(signInHtml, /Pi Sign-In Isolation Harness/);
assert.match(signInHtml, /await Pi\.init\(\{ version: "2\.0" \}\)/);
assert.match(signInHtml, /scopes: \["username"\]/);
assert.match(signInHtml, /Pi\.signIn\(\{ clientId: "VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4", redirectUri: "https:\/\/pioneerhub\.andriussimonaitis\.workers\.dev\/signin\/callback", scopes: \["username"\], state \}\)/);
assert.doesNotMatch(signInHtml, /scopes:\s*\[[^\]]*payments|createPayment|\/api\/pi\/auth/i);
const callback = await get('/signin/callback');
assert.equal(callback.status, 200, 'Pi Sign-In callback shell must return HTTP 200');
const callbackHtml = await callback.text();
assert.match(callbackHtml, /pi_signin_diag_state/);
assert.match(callbackHtml, /CALLBACK_LOADED/);
assert.match(callbackHtml, /https:\/\/api\.minepi\.com\/v2\/me/);
const callbackDiagnostic = callbackHtml.slice(callbackHtml.indexOf("const stateKey = 'pi_signin_diag_state'"));
assert.doesNotMatch(callbackDiagnostic, /createPayment|payments|\/api\/pi\/auth/i);
const missing = await get('/not-found-pioneerhub');
assert.equal(missing.status, 404, 'unknown route must return HTTP 404');
console.log(`Production smoke passed: ${base}`);
