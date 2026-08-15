# Contributing and change control

Use `feature/<short-description>` branches. Every change enters `main` through a pull request after CI; `main` is the production source branch. Do not force-push or delete `main`.

High-risk changes need Founder Approval before merge: authentication, wallet/payment logic, secrets, authorization, production database migrations, billing, treasury and compliance-sensitive features. Run `npm ci && npm run build` before a PR. Never add secrets, personal data or wallet material.
