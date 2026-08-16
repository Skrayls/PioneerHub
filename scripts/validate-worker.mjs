import { spawn } from 'node:child_process';

if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error('validate:worker requires CLOUDFLARE_API_TOKEN in the environment.');
  process.exit(1);
}

const child = spawn(
  'npx',
  ['wrangler', 'deploy', '--dry-run', '--env=', '--outdir', '/tmp/pioneerhub-worker-dryrun'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: process.env.CI || '1',
    },
  },
);

const timeoutMs = 45000;
const timer = setTimeout(() => {
  child.kill('SIGTERM');
  console.error(`validate:worker timed out after ${timeoutMs / 1000}s.`);
}, timeoutMs);

child.on('exit', (code, signal) => {
  clearTimeout(timer);
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 1);
});
