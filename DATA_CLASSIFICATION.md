# Data classification

| Class | Examples | Handling |
|---|---|---|
| Public | articles, review rubric | Git + static assets |
| Operational | aggregate metrics, deployment IDs | minimum retention, restricted access |
| Personal | email, identifiers, UGC | not collected now; feature-specific GDPR design first |
| High-risk | KYC docs, passphrase, private key | never collect/store |
| Secrets | Pi/API keys, tokens | Cloudflare runtime bindings only |

Personal-data features require retention, deletion and export procedures. Tests use synthetic data only.
