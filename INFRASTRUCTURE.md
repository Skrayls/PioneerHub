# Infrastructure foundation — Stage 0.5

## Decision
Use **Cloudflare Workers + Static Assets**. The Worker is the stable edge/API boundary; Stage 0 serves static Core assets through the `ASSETS` binding. This avoids a later Pages-only migration when API, Pi auth or server-side payment verification become necessary.

## Environments
| Environment | Worker | Pi network | Credentials | Indexing |
|---|---|---|---|---|
| Local | Wrangler local | disabled/Testnet only | ignored `.dev.vars` | no |
| Preview | branch Worker version | Testnet only | none in Stage 0.5 | noindex |
| Staging | `pioneerhub-staging` | Testnet only | staging bindings | noindex |
| Production | `pioneerhub` | disabled until Mainnet gate | production bindings only | controlled after domain launch |

## GitHub → Cloudflare
Use Cloudflare Workers Builds GitHub integration after founder account authorization. It deploys `main` to production and uploads branch preview versions, avoiding a long-lived Cloudflare deploy token in GitHub. GitHub Actions validates code only and receives no Cloudflare secrets.

At Stage 0.5, previews are static-only and hold no secrets. Before any authenticated or payment preview, deploy to the separate staging Worker (not a production Worker preview version) and give it separate Testnet-only bindings.

No database exists. Future D1/KV/R2/Durable Objects additions require documented purpose, data classification, retention, access control, GDPR basis, backup and restore.
