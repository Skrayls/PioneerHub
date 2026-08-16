# GitHub migration and security status

## Current status

The private `Skrayls/PioneerHub` repository is connected to the locally held PioneerHub GitHub App (App ID `4610861`), which is installed for this repository only. Initial audited history was published to `main` on 2026-08-16 using a short-lived installation token; no PAT, user password, SSH key or persistent token was created. The App has no administration permission, so it cannot create rulesets or change owner-only repository/security settings.

## Required repository configuration after creation

GitHub Free private repositories do not provide protected branches/rulesets. Do not claim those controls are enabled. The binding compensating control is OpenClaw's PR-only operating policy: `feature/* → PR → CI PASS → merge → main → production`. Direct `main` push is prohibited except documented emergency recovery. Stable releases receive Git tags/checkpoints.

The App is installed only on `PioneerHub` with: Metadata read; Contents read/write; Pull requests read/write; Workflows read/write; Actions read-only; every other repository/account/organization permission no access. It has no bypass, administration, global PAT, founder password, SSH key, 2FA or recovery material.

| Control | Repository readiness | Availability |
|---|---|---|
| Branch protection / ruleset | NOT AVAILABLE on Free private repo | PR-only policy + mandatory CI + release checkpoints |
| Force-push and deletion block | NOT AVAILABLE on Free private repo | App operating policy; Git history backup; documented emergency exception |
| CI required checks | NOT AVAILABLE as an enforced branch gate | CI runs on every PR; no normal merge/deploy until PASS |
| Dependabot version updates | `.github/dependabot.yml` prepared | available when GitHub enables Dependabot |
| Dependabot alerts/security updates | pending | availability depends on GitHub plan/repo settings |
| Dependency review | workflow prepared | availability depends on private-repo plan/settings |
| Secret scanning/push protection | NOT AVAILABLE unless UI offers it | local + CI `npm run secrets:scan`; no-secrets source policy |
| CodeQL/code scanning | NOT AVAILABLE unless UI offers it | minimal dependency surface, pinned Actions, npm audit and focused tests |

Do not make the repository public merely to obtain a security feature. The current private source-of-truth requirement wins.
