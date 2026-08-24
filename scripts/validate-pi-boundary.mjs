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
assert.doesNotMatch(app, /Pi\.authenticate|Pi\.init|Pi\.signIn|\/api\/pi\/auth|createPayment/);
assert.doesNotMatch(html, /sdk\.minepi\.com|Testnet Payment Lab|Pi Auth diagnostika/i);
assert.doesNotMatch(app, /sandbox:\s*true/);
assert.doesNotMatch(config, /mainnet/i);
assert.match(localVars, /PI_TESTNET_API_KEY=/);
assert.match(localVars, /PI_SESSION_SECRET=/);
assert.match(localVars, /PI_DOMAIN_VALIDATION_CONTENT=/);
assert.doesNotMatch(localVars, /MAINNET_API_KEY/);
assert.match(worker, /PI_AUTH_DIAGNOSTIC_PATH = "\/diag\/pi-auth"/);
assert.match(worker, /PI_SIGNIN_DIAGNOSTIC_PATH = "\/diag\/pi-signin"/);
assert.match(worker, /PI_PAYMENT_CHECKLIST_PATH = "\/diag\/pi-payment-checklist"/);
assert.match(worker, /PI_SANDBOX_CHECKLIST_PATH = "\/diag\/pi-sandbox-checklist"/);
assert.match(worker, /PI_PAYMENT_CHECKLIST_AMOUNT = 0\.01/);
assert.match(worker, /PI_SANDBOX_CHECKLIST_AMOUNT = 0\.01/);
assert.match(worker, /PI_SANDBOX_CHECKLIST_MEMO = "PioneerHub Testnet Developer Portal checklist"/);
assert.match(worker, /PI_SANDBOX_CHECKLIST_METADATA = Object\.freeze\(\{ purpose: "developer_portal_checklist" \}\)/);
assert.match(worker, /PI_PAYMENT_CHECKLIST_METADATA = Object\.freeze\(\{ purpose: "developer_portal_checklist" \}\)/);
assert.match(worker, /env\.PI_NETWORK !== "testnet" \|\| !env\.PI_TESTNET_API_KEY \|\| !env\.PI_SESSION_SECRET \|\| !env\.PAYMENT_LEDGER \|\| !env\.AUTH_SESSIONS/);
assert.match(worker, /primaryScopes = \['username', 'payments'\]/);
assert.match(worker, /pi\.authenticate\(\['username', 'payments'\], onIncompletePaymentFound\)/);
assert.equal((worker.match(/\.authenticate\(/g) || []).length, 4, 'authentication may exist only in isolated diagnostic harnesses or the temporary Pi Sandbox root control');
assert.match(worker, /Pi\.createPayment\(\{ amount, memo, metadata \}, callbacks\)/);
assert.equal((worker.match(/Pi\.createPayment\(/g) || []).length, 3, 'createPayment must exist only in isolated checklist harnesses or the temporary Pi Sandbox root control');
assert.match(worker, /await Pi\.init\(\{ version: "2\.0", sandbox: true \}\)/);
assert.equal((worker.match(/sandbox: true/g) || []).length, 2, 'Sandbox mode must be isolated to the diagnostic harness and temporary Pi Sandbox root control');
assert.match(worker, /isOfficialPiSandboxRootRequest/);
assert.match(worker, /new URL\(request\.headers\.get\("Referer"\) \|\| ""\)\.origin === "https:\/\/sandbox\.minepi\.com"/);
assert.match(worker, /window\.top !== window\.self && new URL\(document\.referrer\)\.origin === 'https:\/\/sandbox\.minepi\.com'/);
assert.match(worker, /\/api\/pi\/sandbox-checklist\/payments\//);
assert.match(worker, /payment\.network !== "Pi Testnet" \|\| payment\.direction !== "user_to_app" \|\| payment\.amount !== expectedPayment\.amount \|\| payment\.memo !== expectedPayment\.memo \|\| payment\.metadata\?\.purpose !== expectedPayment\.purpose/);
assert.doesNotMatch(html, /createPayment|Run Testnet checklist transaction|payment-checklist/i);
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
console.log('Pi integration boundary validation passed.');
