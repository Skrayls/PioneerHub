# Observability

Workers Logs is enabled for staging and production in `wrangler.jsonc`. Before public traffic, confirm dashboard visibility for logs, errors and deployment status.

Log only request ID, route, status, latency, release ID and coarse security events. Never log passphrases, private keys, auth/session tokens, payment payloads, KYC data or unnecessary personal data.

Incident flow: contain/rollback → preserve minimum evidence → classify → rotate compromised secret → document prevention.
# MUA observability

## Current truth

- Telemetry emission is production-ready.
- Privacy boundary is production-ready.
- End-to-end persisted analytics visibility is **not yet independently proven**.

## What is emitted

Worker logs only allowlisted MUA event names plus deployment `version`. No request body fields, identifiers, passphrases, wallet data or free-form text are intentionally accepted.

## Correlation model

Use deployment version plus Cloudflare timestamp to correlate a useful-action event to a Workers Builds release.

## Open limitation

Cloudflare Tail accepted credentials, but did not reliably stream the triggered custom log entries in-session. The account-scoped observability dataset also did not yet show persisted custom-log values for these events.

Treat this distinction honestly:

- telemetry emission: PASS
- persisted/queryable reception visibility: OPEN
