import assert from 'node:assert/strict';

const base = process.env.PIONEERHUB_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set PIONEERHUB_URL to the deployed Worker URL.');
if (!base.startsWith('https://')) throw new Error('Production smoke tests require HTTPS.');

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  return response;
}

const home = await get('/?build=auth-sdk-await-r6');
assert.equal(home.status, 200, 'homepage must return HTTP 200');
const homeHtml = await home.text();
assert.match(homeHtml, /PioneerHub/);
assert.match(homeHtml, /Build: auth-sdk-await-r6/);
assert.match(homeHtml, /app\.js\?v=auth-sdk-await-r6/);
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
const css = await get('/styles.css?v=auth-sdk-await-r6');
assert.equal(css.status, 200, 'CSS must return HTTP 200');
assert.match(css.headers.get('cache-control') || '', /immutable/);
const js = await get('/app.js?v=auth-sdk-await-r6');
assert.equal(js.status, 200, 'JS must return HTTP 200');
assert.match(await js.text(), /FRONTEND-RUNTIME: ACTIVE/);
assert.match(js.headers.get('cache-control') || '', /immutable/);
const missing = await get('/not-found-pioneerhub');
assert.equal(missing.status, 404, 'unknown route must return HTTP 404');
console.log(`Production smoke passed: ${base}`);
