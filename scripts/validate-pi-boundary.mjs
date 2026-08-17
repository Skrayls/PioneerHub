import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [config, html, app, localVars] = await Promise.all([
  readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
  readFile(new URL('../app/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../.dev.vars.example', import.meta.url), 'utf8'),
]);

assert.match(config, /"PI_NETWORK": "testnet"/);
assert.match(config, /"PI_NETWORK": "testnet"/);
assert.match(app, /const AUTH_SCOPES = \['username'\]/);
assert.match(app, /pi\.authenticate\(AUTH_SCOPES, incompletePayment\)/);
assert.match(app, /pi\.createPayment\(/);
assert.match(app, /amount: 0\.01/);
assert.doesNotMatch(app, /sandbox:\s*true/);
assert.doesNotMatch(config, /mainnet/i);
assert.match(localVars, /PI_TESTNET_API_KEY=/);
assert.match(localVars, /PI_SESSION_SECRET=/);
assert.match(localVars, /PI_DOMAIN_VALIDATION_CONTENT=/);
assert.doesNotMatch(localVars, /MAINNET_API_KEY/);
console.log('Pi integration boundary validation passed.');
