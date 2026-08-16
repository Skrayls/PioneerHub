import assert from 'node:assert/strict';

const base = process.env.PIONEERHUB_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set PIONEERHUB_URL to the deployed Worker URL.');

const expected = [
  {
    name: 'Pi Browser',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'NOT YET TESTED',
    url: 'https://minepi.com/pi-browser/',
  },
  {
    name: 'Pi Wallet',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    url: 'https://minepi.com/safety/',
  },
  {
    name: 'Fireside Forum',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    url: 'https://minepi.com/safety/',
  },
  {
    name: 'Pi Chats',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    url: 'https://minepi.com/safety/',
  },
  {
    name: 'KYC',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    url: 'https://minepi.com/safety/',
  },
  {
    name: 'Pi Launchpad',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'NOT YET TESTED',
    url: 'https://minepi.com/blog/pi-day-2026/',
  },
  {
    name: 'CiDi Games',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'NOT YET TESTED',
    url: 'https://minepi.com/announcement/cidi-games-beta/',
  },
];

async function get(url, init) {
  const response = await fetch(url, init);
  return response;
}

async function assertSource(url) {
  let response = await get(url, { method: 'HEAD', redirect: 'follow' });
  if (response.status === 405 || response.status === 403) {
    response = await get(url, { method: 'GET', redirect: 'follow' });
  }
  assert.equal(response.ok, true, `source URL must resolve: ${url}`);
}

const home = await get(`${base}/`);
assert.equal(home.status, 200, 'homepage must return HTTP 200');
const html = await home.text();
assert.match(html, /App Radar/i, 'homepage must include App Radar section');

for (const [header, pattern] of Object.entries({
  'content-security-policy': /frame-ancestors 'none'/,
  'strict-transport-security': /max-age=/,
  'x-content-type-options': /nosniff/,
  'referrer-policy': /strict-origin-when-cross-origin/,
  'permissions-policy': /camera=\(\)/,
  'x-frame-options': /DENY/,
})) {
  assert.match(home.headers.get(header) || '', pattern, `${header} missing or invalid`);
}

const appJs = await get(`${base}/app.js`);
assert.equal(appJs.status, 200, 'app.js must return HTTP 200');
const script = await appJs.text();

for (const entry of expected) {
  assert.match(script, new RegExp(entry.name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
  assert.match(script, new RegExp(entry.type.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
  assert.match(script, new RegExp(entry.testState.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
  assert.match(script, new RegExp(entry.url.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
}

assert.doesNotMatch(script, /RECOMMENDED|NOT RECOMMENDED|USE WITH CAUTION|WORTH TRYING|EXPERIMENTAL/i, 'baseline release must not assign unsupported verdicts');
assert.doesNotMatch(script, /garantuoja saugum|saugus pasirinkimas|patvirtintas PioneerHub/i, 'baseline release must not imply safety guarantees');

await Promise.all(expected.map((entry) => assertSource(entry.url)));

console.log(`App Radar verification passed for ${base}`);
