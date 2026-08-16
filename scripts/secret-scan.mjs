import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { encoding: 'utf8' })
  .split('\n').filter(Boolean)
  .filter(file => !file.endsWith('.example') && !file.startsWith('node_modules/'));
const patterns = [
  { name: 'private key', re: /-----BEGIN (?:[A-Z ]+)?PRIVATE KEY-----/ },
  { name: 'GitHub token', re: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  // Detect literal credentials while permitting normal runtime reads such as request headers.
  { name: 'high-entropy credential assignment', re: /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*(?:["'][A-Za-z0-9_./+=-]{16,}["']|(?!(?:env|process|request|context|input)\b)[A-Za-z0-9_+=/-]{16,})/i },
];
const findings = [];
for (const file of files) {
  let content;
  try { content = readFileSync(file, 'utf8'); } catch { continue; }
  for (const { name, re } of patterns) if (re.test(content)) findings.push(`${file}: ${name}`);
}
if (findings.length) {
  console.error(`Potential secret(s) found:\n${findings.join('\n')}`);
  process.exit(1);
}
console.log(`Secret scan passed (${files.length} tracked/unignored files checked).`);
