# Architecture

## Stage 0 / MVP

Static HTML, CSS and JavaScript in `app/`, deployable to a static host. No server, authentication, wallets, secrets, cookies or personal-data collection. This is intentional.

## Stage 1 target

- Public frontend: standards-based React/Next.js or equivalent static-first framework.
- Content: version-controlled Markdown/MDX, reviewed against official sources.
- Backend only when required: TypeScript API, PostgreSQL, managed authentication only through official Pi SDK where an authenticated Pi app is required.
- Observability: privacy-respecting analytics, error logging, uptime monitoring.
- CI: lint, unit tests, dependency/security scan, build, preview.

## Trust boundaries

Public content is separate from any future Pi-authenticated app. Payment requests, if approved later, use only official Pi SDK. PioneerHub never handles a wallet passphrase, private key or customer funds.

## Deployment

Static preview first; production host and domain are a Founder Approval Gate. Use HTTPS, CSP, security headers, immutable deployments, backups and rollback.

