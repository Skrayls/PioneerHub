import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [config, html, app, localVars] = await Promise.all([
  readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
  readFile(new URL('../app/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../.dev.vars.example', import.meta.url), 'utf8'),
]);

assert.match(config, /"PI_NETWORK": "disabled"/);
assert.match(config, /"PI_NETWORK": "testnet"/);
assert.match(html, /Pi loginas nėra aktyvus/);
assert.match(html, /Testnet mokėjimas dar nevykdomas/);
assert.doesNotMatch(app, /Pi\.authenticate\s*\(/);
assert.doesNotMatch(app, /createPayment\s*\(/);
assert.match(localVars, /PI_TESTNET_API_KEY=/);
assert.match(localVars, /PI_DOMAIN_VALIDATION_CONTENT=/);
assert.doesNotMatch(localVars, /MAINNET_API_KEY/);
console.log('Pi integration boundary validation passed.');
