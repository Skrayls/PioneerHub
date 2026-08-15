# Threat model

| Threat | Baseline mitigation |
|---|---|
| Malicious users/bots/UGC abuse | no UGC now; later server-validated Turnstile, rate limiting, moderation |
| Fake Pi app/phishing | official-source safety content; independent disclaimer; no passphrase requests |
| XSS/injection | static-first UI, CSP, encoding and server-side validation before dynamic data |
| CSRF | no state endpoints; same-site/CSRF design before cookie auth |
| Supply-chain compromise | lockfile, npm ci, Dependabot, pinned actions, minimal dependencies |
| Credential/OpenClaw compromise | least privilege, runtime secrets, rotation; local disk not canonical |
| GitHub/Cloudflare compromise | MFA, scoped integrations, protected main, audit/revoke/rollback |
| Payment manipulation/replay | not implemented; future server-authoritative, idempotent Testnet-first design and Founder Gate |
| Privilege escalation | role separation; no production secrets in preview/local; review authz changes |
