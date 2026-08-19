# Observability

Workers Logs is enabled for staging and production in `wrangler.jsonc`. Before public traffic, confirm dashboard visibility for logs, errors and deployment status.

Log only request ID, route, status, latency, release ID and coarse security events. Never log passphrases, private keys, auth/session tokens, payment payloads, KYC data or unnecessary personal data.

Incident flow: contain/rollback → preserve minimum evidence → classify → rotate compromised secret → document prevention.
# MUA observability

## Current truth

- Telemetry emission and aggregate persistence use Workers Analytics Engine.
- Privacy boundary is production-ready.
- Operators can query aggregate event/release counts; no user-level analytics exists.

## What is emitted

Workers Analytics Engine receives only allowlisted MUA event names, release IDs and
the numeric count `1`. No request body fields beyond the exact allowlisted event,
identifiers, passphrases, wallet data or free-form text are accepted.

## Correlation model

Use release ID plus Cloudflare timestamp to compare aggregate useful-action trends
between releases.

## Retention and interpretation

Workers Analytics Engine retains data for three months. The counts measure event
occurrences, not people; they can be affected by repeat actions or unauthenticated
traffic and must not be presented as unique users or product-market-fit proof by
themselves.
