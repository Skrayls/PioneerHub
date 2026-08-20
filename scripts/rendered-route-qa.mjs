import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const base = process.env.PIONEERHUB_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8788';
const managedLocalWorker = !process.env.PIONEERHUB_URL;
const routes = [
  ['/', '#home'],
  ...['pi-network', 'balanso-busenos', 'perkeltas-balansas', 'perkeliamas-balansas', 'nepatvirtintas-balansas', 'mainnet', 'pi-wallet', 'kyc', 'mainnet-checklist', 'lockup', 'referral-team', 'security-circle', 'kyc-validator', 'node', 'pi-browser-apps'].map(slug => [`/mokykis/${slug}`, '#learnGuide']),
  ...['/sauga', '/sauga/passphrase', '/sauga/itartina-nuoroda', '/sauga/pries-siunciant-pi'].map(path => [path, '#safetyApp']),
  ['/tikrinti-nuoroda', '#appInspector'],
  ['/pervedimo-repeticija', '#transferRehearsal'],
  ['/kyc-busena', '#kycStatusNavigator'],
  ...['metodika', 'pi-browser', 'pi-wallet', 'fireside-forum', 'pi-chats', 'kyc', 'pi-launchpad', 'cidi-games'].map(slug => [`/radar/${slug}`, '#radarApp']),
  ['/prisidek', '#communitySignals'],
  ['/app-paleidimo-checklist', '#appLaunchChecklist'],
];

let worker;
let browser;
async function waitForWorker() {
  let lastError;
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(`${base}/healthz`)).ok) return; } catch (error) { lastError = error; }
    await delay(250);
  }
  throw new Error(`Local Worker did not become ready: ${lastError?.message || 'unknown error'}`);
}

try {
  if (managedLocalWorker) {
    worker = spawn('npx', ['wrangler', 'dev', '--local', '--port', '8788'], { stdio: 'ignore' });
    await waitForWorker();
  }
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const failures = [];
  page.on('console', message => { if (message.type() === 'error') failures.push(`console ${message.text()}`); });
  page.on('pageerror', error => failures.push(`pageerror ${error.message}`));

  for (const [path, selector] of routes) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response?.status(), 200, `${path} must render with HTTP 200`);
    await page.waitForSelector(selector);
    const mainText = await page.locator('main').innerText();
    assert.ok(mainText.trim().length > 40, `${path} main content must not be empty`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${path} must not overflow a mobile viewport`);
    const assets = await page.evaluate(() => performance.getEntriesByType('resource')
      .map(entry => entry.name)
      .filter(name => new URL(name).origin === location.origin && /\.(css|js)(?:\?|$)/.test(name)));
    for (const asset of assets) {
      const assetResponse = await page.request.get(asset);
      const type = asset.endsWith('.css') || asset.includes('.css?') ? /text\/css/i : /javascript|ecmascript/i;
      assert.equal(assetResponse.status(), 200, `${path} asset ${asset} must return HTTP 200`);
      assert.match(assetResponse.headers()['content-type'] || '', type, `${path} asset ${asset} must have the correct MIME type`);
      assert.doesNotMatch(await assetResponse.text(), /<!doctype html|<html[\s>]/i, `${path} asset ${asset} must not return HTML`);
    }
  }
  assert.deepEqual(failures, [], `Critical browser errors:\n${failures.join('\n')}`);
  await browser.close();
  browser = undefined;
  console.log(`Rendered route QA passed: ${base} (${routes.length} routes)`);
} finally {
  if (browser) await browser.close();
  if (worker) worker.kill('SIGTERM');
}
