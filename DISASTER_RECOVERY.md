# Disaster recovery

After GitHub migration, GitHub is canonical source. Cloudflare holds deployment configuration; secrets are restored by founder-controlled records into scoped bindings.

| Scenario | Recovery |
|---|---|
| Local workspace lost | clone GitHub, `npm ci`, restore only secret names from templates |
| Broken production release | promote last known-good Worker version; repair through PR |
| Cloudflare mistake | restore Git config, inspect deployment history, roll back version |
| Credential leak | revoke/rotate, assess exposure, replace bindings, document incident |
| Future DB corruption | halt writes, use tested backup/time-travel recovery, validate before reopen |
| GitHub compromise | revoke tokens/apps, audit, restore known-good commit, rotate integrations |

Post-migration test: clean clone → `npm ci` → build; then test Cloudflare Worker rollback and record date/commit in `PROJECT_STATE.md`.
