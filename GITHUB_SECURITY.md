# GitHub migration and security status

## Current status

No GitHub CLI/authentication is present in the execution environment, so no remote repository, ruleset or GitHub security switch has been created. This is intentionally not bypassed with an unscoped token.

## Required repository configuration after creation

Create private repository `PioneerHub`; push existing `main`. Configure a ruleset for `main` with: pull request required, required status checks `validate` and `dependency-review` when available, block force push, block deletion, require linear history if compatible, and apply to administrators. Set default Actions token permission to read-only; allow only trusted actions and require full-SHA pinning where the account setting is available.

| Control | Repository readiness | Availability |
|---|---|---|
| Branch protection / ruleset | configuration prepared | account/repository admin required |
| Force-push and deletion block | configuration prepared | account/repository admin required |
| CI required checks | workflows prepared | account/repository admin required |
| Dependabot version updates | `.github/dependabot.yml` prepared | available when GitHub enables Dependabot |
| Dependabot alerts/security updates | pending | availability depends on GitHub plan/repo settings |
| Dependency review | workflow prepared | availability depends on private-repo plan/settings |
| Secret scanning/push protection | pending | availability depends on GitHub Secret Protection / plan |
| CodeQL/code scanning | pending | GitHub documents free availability for public repos; private repos may require GitHub Code Security |

Do not make the repository public merely to obtain a security feature. The current private source-of-truth requirement wins.
