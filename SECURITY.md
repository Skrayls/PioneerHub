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

## CI and repository controls

`main` must be protected in GitHub: PR-required merge, required CI, no force pushes, no deletion and admin enforcement where plan allows. Actions have least-privilege permissions and immutable action SHAs. Actual GitHub feature availability remains pending repository creation.
