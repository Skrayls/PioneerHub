import assert from 'node:assert/strict';

const base = process.env.PIONEERHUB_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set PIONEERHUB_URL to the deployed Worker URL.');
if (!base.startsWith('https://')) throw new Error('Production smoke tests require HTTPS.');

async function get(path) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  return response;
}

const home = await get('/');
assert.equal(home.status, 200, 'homepage must return HTTP 200');
assert.match(await home.text(), /PioneerHub/);
for (const [header, pattern] of Object.entries({
  'content-security-policy': /frame-ancestors 'none'/,
  'x-content-type-options': /nosniff/,
  'referrer-policy': /strict-origin-when-cross-origin/,
  'permissions-policy': /camera=\(\)/,
  'x-frame-options': /DENY/,
})) assert.match(home.headers.get(header) || '', pattern, `${header} missing or invalid`);

const health = await get('/healthz');
assert.equal(health.status, 200, 'health endpoint must return HTTP 200');
assert.equal((await health.json()).status, 'ok');
const css = await get('/styles.css');
assert.equal(css.status, 200, 'CSS must return HTTP 200');
assert.match(css.headers.get('cache-control') || '', /max-age=86400/);
const js = await get('/app.js');
assert.equal(js.status, 200, 'JS must return HTTP 200');
const missing = await get('/not-found-pioneerhub');
assert.equal(missing.status, 404, 'unknown route must return HTTP 404');
console.log(`Production smoke passed: ${base}`);
