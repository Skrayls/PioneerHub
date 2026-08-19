import { spawn } from 'node:child_process';

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
