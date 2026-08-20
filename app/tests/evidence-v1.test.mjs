import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const [source, inspector, radar, inspectorShell, radarShell, workerSource] = await Promise.all([
  readFile(new URL('evidence-v1.js', root), 'utf8'), readFile(new URL('app-inspector.js', root), 'utf8'), readFile(new URL('radar-v2.js', root), 'utf8'), readFile(new URL('app-inspector-shell.txt', root), 'utf8'), readFile(new URL('radar-shell.txt', root), 'utf8'), readFile(new URL('../../src/worker.js', import.meta.url), 'utf8'),
]);
const context = { window: {}, Date };
vm.runInNewContext(source, context);
const evidence = context.window.PioneerEvidence;
assert.equal(evidence.version, 'evidence-v1');
assert.equal(evidence.findByHostname('WALLET.PINET.COM').slug, 'pi-wallet');
assert.equal(evidence.findByHostname('unknown.example'), undefined);
assert.equal(evidence.records.find(record => record.slug === 'pi-wallet').evidenceState, 'VERIFIED_BASICS');
assert.match(evidence.records.find(record => record.slug === 'pi-wallet').limitations, /netestavo/);
assert.match(evidence.records.find(record => record.slug === 'pi-wallet').found, /wallet\.pinet\.com/);
assert.match(evidence.records.find(record => record.slug === 'pi-wallet').next, /30 sekundžių/);
assert.equal(evidence.freshnessFor('2026-08-19', new Date('2026-08-20T12:00:00Z')).key, 'fresh');
assert.equal(evidence.freshnessFor('2026-07-20', new Date('2026-08-20T12:00:00Z')).key, 'overdue');
assert.match(inspectorShell, /evidence-v1\.js[\s\S]*app-inspector\.js/);
assert.match(radarShell, /evidence-v1\.js[\s\S]*radar-v2\.js/);
assert.match(workerSource, /replaceAll\('src="evidence-v1\.js"', `src="\/evidence-v1\.js\$\{version\}"`\)/);
assert.match(inspector, /findByHostname/);
assert.match(inspector, /Normalizuotas domenas/);
assert.match(radar, /PioneerEvidence must load before App Radar/);
assert.match(radar, /evidence\.records\.map/);
assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage|Pi\.authenticate|createPayment/i);
