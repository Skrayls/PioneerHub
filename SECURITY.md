# Security baseline

- Never request, transmit or store a Pi wallet passphrase/private key.
- Use official Pi SDK only for future Pi auth and payments; no custom wallet UI.
- No secrets in repository; `.env` only locally and production secret manager later.
- HTTPS, CSP, HSTS, frame protection, dependency scanning and error logging before production.
- Review external links; safety articles should link to official sources.
- Role-based admin access, backups and tested rollback before user data or UGC.
- Report suspected security incident privately; do not collect sensitive evidence in public channels.

## Secrets model

GitHub is source only: no Cloudflare or Pi secret belongs in source, Actions secrets, issues, logs or documentation. Production and staging secrets are separate Cloudflare runtime bindings; local values exist only in ignored `.dev.vars`. A leaked secret is compromised: rotate it, assess exposure, remove history if required and document the incident.

## Analytics privacy boundary

PioneerHub MUA telemetry accepts only predefined event names. It rejects arbitrary payload values by omission, and never intentionally logs Pi credentials, passphrases, wallet addresses, usernames, email, session material, user agent or free-form submissions.

## CI and repository controls

GitHub Free private repositories cannot technically enforce protected `main`/rulesets. The operating control is therefore binding: routine work must use `feature/* → PR → CI PASS → merge → deploy from main`; direct `main` push is prohibited except a documented emergency recovery. Every release maps to a Git commit and stable production releases receive a Git tag/checkpoint.

Compensating controls: one scoped GitHub App installed only on PioneerHub; minimum App permissions; no global PAT or founder account credential; CI on every PR; local and CI secret scanning; Cloudflare deploy only from validated `main`; independent GitHub history; Founder Gate for high-risk changes. Actions have least-privilege permissions and immutable action SHAs.
