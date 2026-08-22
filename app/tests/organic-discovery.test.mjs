import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../../src/worker.js';

const canonicalOrigin = 'https://pioneerhub.andriussimonaitis.workers.dev';
const root = new URL('../', import.meta.url);
const publicShell = '<!doctype html><html><head><meta name="description" content="generic"><title>Generic</title></head><body><main id="content"></main><script src="app.js"></script></body></html>';
const assets = { fetch: async () => new Response(publicShell, { headers: { 'content-type': 'text/html; charset=utf-8' } }) };
const production = { ASSETS: assets, APP_ENV: 'production' };

const [homeHtml, appJs, workerSource] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('app.js', root), 'utf8'),
  readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);

assert.doesNotMatch(homeHtml, /BlackMerchanter|referral_open|referral-link|Testnet Payment Lab|id="lab"|sdk\.minepi\.com/i, 'the public home source must not contain referral or diagnostic UI');
assert.doesNotMatch(appJs, /Pi\.authenticate|Pi\.init|Pi\.signIn|\/api\/pi\/auth|createPayment/, 'normal public JavaScript must not run Pi auth or payment diagnostics');
assert.doesNotMatch(workerSource, /"referral_open"/, 'the obsolete referral event must not return to the public event allowlist');

const robots = await worker.fetch(new Request(`${canonicalOrigin}/robots.txt`), production);
assert.equal(robots.status, 200);
assert.match(robots.headers.get('content-type') || '', /^text\/plain/i);
const robotsText = await robots.text();
assert.match(robotsText, /^User-agent: \*/m);
assert.match(robotsText, new RegExp(`Sitemap: ${canonicalOrigin}/sitemap\\.xml`));
assert.match(robotsText, /Disallow: \/diag\//);
assert.match(robotsText, /Disallow: \/api\//);

const sitemap = await worker.fetch(new Request(`${canonicalOrigin}/sitemap.xml`), production);
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('content-type') || '', /^application\/xml/i);
const sitemapText = await sitemap.text();
assert.match(sitemapText, /^<\?xml /);
for (const route of ['/', '/tikrinti-nuoroda', '/sauga/passphrase', '/mokykis/pi-wallet', '/radar/pi-wallet', '/merchant-readiness']) {
  assert.match(sitemapText, new RegExp(`<loc>${canonicalOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${route}</loc>`));
}
assert.doesNotMatch(sitemapText, /\/diag\/|\/api\/|\/events|\/signin\/callback/);
const sitemapLocations = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.ok(sitemapLocations.length >= 30, 'sitemap must contain the public route inventory');
assert.ok(sitemapLocations.every(location => location.startsWith(canonicalOrigin) && !/[?#]/.test(location)), 'sitemap entries must be canonical paths without fragments or query strings');

for (const [route, titleNeedle, descriptionNeedle] of [
  ['/tikrinti-nuoroda', 'Pi App Inspector: nuorodos patikra', 'Patikrink Pi nuorodos signalus'],
  ['/sauga/passphrase', 'Pi wallet passphrase: ką daryti?', 'wallet passphrase'],
  ['/mokykis/pi-wallet', 'Pi Wallet | Mokykis', 'saugiai atidaryti Pi Wallet'],
  ['/radar/pi-wallet', 'Pi Wallet | App Radar', 'Viešų Pi Wallet įrodymų'],
]) {
  const response = await worker.fetch(new Request(`${canonicalOrigin}${route}`), production);
  const html = await response.text();
  assert.equal(response.status, 200, `${route} must render`);
  assert.match(html, new RegExp(`<title>${titleNeedle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*</title>`));
  assert.match(html, new RegExp(`<meta name="description" content="[^">]*${descriptionNeedle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalOrigin}${route}">`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${canonicalOrigin}${route}">`));
  assert.match(html, /<html lang="lt">/);
}

const home = await worker.fetch(new Request(`${canonicalOrigin}/`), production);
const homeResponseHtml = await home.text();
assert.match(homeResponseHtml, /class="section route-index"/);
assert.match(homeResponseHtml, /href="\/mokykis\/pi-wallet"/);
assert.match(homeResponseHtml, /href="\/radar\/pi-wallet"/);
assert.doesNotMatch(homeResponseHtml, /BlackMerchanter|Testnet Payment Lab|sdk\.minepi\.com/i);
assert.doesNotMatch(home.headers.get('content-security-policy') || '', /sdk\.minepi\.com/);

const authDiagnostic = await worker.fetch(new Request(`${canonicalOrigin}/diag/pi-auth`), production);
assert.equal(authDiagnostic.status, 200);
assert.match(authDiagnostic.headers.get('x-robots-tag') || '', /noindex/);
const authDiagnosticHtml = await authDiagnostic.text();
assert.match(authDiagnosticHtml, /meta name="robots" content="noindex/);
assert.match(authDiagnosticHtml, /sdk\.minepi\.com\/pi-sdk\.js/);

const paymentStatus = await worker.fetch(new Request(`${canonicalOrigin}/api/pi/status`), production);
assert.deepEqual(await paymentStatus.json(), { network: 'unavailable', auth: 'configuration_required', payments: 'configuration_required' });
