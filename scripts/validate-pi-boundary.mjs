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
assert.match(worker, /Pi\.authenticate\(scopes, onIncompletePaymentFound\)/);
assert.match(worker, /AUTH_CALL_RETURNED/);
assert.match(worker, /AUTH_PROMISE_TIMEOUT/);
assert.doesNotMatch(worker, /Pi\.createPayment\(/);
console.log('Pi integration boundary validation passed.');
