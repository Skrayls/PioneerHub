# Observability

Workers Logs is enabled for staging and production in `wrangler.jsonc`. Before public traffic, confirm dashboard visibility for logs, errors and deployment status.

Log only request ID, route, status, latency, release ID and coarse security events. Never log passphrases, private keys, auth/session tokens, payment payloads, KYC data or unnecessary personal data.

Incident flow: contain/rollback → preserve minimum evidence → classify → rotate compromised secret → document prevention.
