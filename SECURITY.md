# Security baseline

- Never request, transmit or store a Pi wallet passphrase/private key.
- Use official Pi SDK only for future Pi auth and payments; no custom wallet UI.
- No secrets in repository; `.env` only locally and production secret manager later.
- HTTPS, CSP, HSTS, frame protection, dependency scanning and error logging before production.
- Review external links; safety articles should link to official sources.
- Role-based admin access, backups and tested rollback before user data or UGC.
- Report suspected security incident privately; do not collect sensitive evidence in public channels.

