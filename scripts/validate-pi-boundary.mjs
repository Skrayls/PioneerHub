import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [config, html, app, localVars, worker] = await Promise.all([
  readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
  readFile(new URL('../app/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../.dev.vars.example', import.meta.url), 'utf8'),
  readFile(new URL('../src/worker.js', import.meta.url), 'utf8'),
]);

assert.match(config, /"PI_NETWORK": "testnet"/);
assert.match(config, /"PI_NETWORK": "testnet"/);
assert.match(app, /const NATIVE_PI_AUTH_SCOPES = \['username', 'payments'\]/);
assert.match(app, /pi\.authenticate\(NATIVE_PI_AUTH_SCOPES, incompletePayment\)/);
assert.match(app, /AUTH-PI-AUTHENTICATE-TIMEOUT/);
assert.match(app, /getNativePiBridge\(\)/);
assert.doesNotMatch(app, /pi\.createPayment\(/);
assert.doesNotMatch(app, /sandbox:\s*true/);
assert.doesNotMatch(config, /mainnet/i);
assert.match(localVars, /PI_TESTNET_API_KEY=/);
assert.match(localVars, /PI_SESSION_SECRET=/);
assert.match(localVars, /PI_DOMAIN_VALIDATION_CONTENT=/);
assert.doesNotMatch(localVars, /MAINNET_API_KEY/);
assert.match(worker, /PI_AUTH_DIAGNOSTIC_PATH = "\/diag\/pi-auth"/);
assert.match(worker, /PI_SIGNIN_DIAGNOSTIC_PATH = "\/diag\/pi-signin"/);
assert.match(worker, /PI_SIGNIN_CLIENT_ID = "VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4"/);
assert.match(worker, /PI_SIGNIN_REDIRECT_URI = "https:\/\/pioneerhub\.andriussimonaitis\.workers\.dev\/signin\/callback"/);
assert.match(worker, /scopes: \["username"\]/);
assert.match(worker, /Pi\.signIn\(\{ clientId: "\$\{PI_SIGNIN_CLIENT_ID\}", redirectUri: "\$\{PI_SIGNIN_REDIRECT_URI\}", scopes: \["username"\], state \}\)/);
assert.match(worker, /history\.replaceState\(null, '', window\.location\.pathname\)/);
assert.match(worker, /https:\/\/api\.minepi\.com\/v2\/me/);
assert.match(worker, /await Pi\.init\(\{ version: "2\.0" \}\)/);
assert.match(worker, /const scopes = \["username"\]/);
assert.match(worker, /function onIncompletePaymentFound\(payment\)/);
assert.match(worker, /Pi\.authenticate\(scopes, onIncompletePaymentFound\)/);
assert.match(worker, /AUTH_PROMISE_CREATED/);
assert.match(worker, /AUTH_REJECTED/);
assert.doesNotMatch(worker, /Pi\.createPayment\(/);
console.log('Pi integration boundary validation passed.');
