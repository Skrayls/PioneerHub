# PioneerHub project state

- Production main: `24d8f89` (P0 production UI recovery).
- Production release: P0 production UI recovery, merged and deployed 2026-08-20 at `https://pioneerhub.andriussimonaitis.workers.dev`. Exact-head GitHub CI `32371450301` and Workers Build `5e918d3a-a17e-4148-a7bd-8b829b9bccac` passed. The rendered 390px production audit passed across all 33 public routes; see `docs/PRODUCTION_ROUTE_QA.md`.
- Completed: Safety Center V1, App Radar V2, Learn V2, Start + Return V1, Visual Polish V1, Community Signals V1, Pi App Inspector V1, Pi Transfer Rehearsal V1, KYC Status Navigator V1. PR #52 merged after exact-head GitHub CI and Workers Build passed; merged `main` also passed full local validation, Worker dry-run and Pi-boundary validation before deployment.
- P0 complete: nested public routes now emit root-relative CSS/JS URLs. A permanent Playwright rendered mobile/asset-integrity gate covers all public routes and catches missing or HTML-served assets, bad MIME types, empty main content, critical browser errors, and horizontal overflow.
- Completed post-release reassessment (2026-08-20): selected the portfolio's Pi app launch checklist candidate because it adds a differentiated developer-side Pi utility and advances the product-engine path, while avoiding duplicate consumer guidance. Human Preflight: `HUMAN_ACTION_REQUIRED=false`; a fixed local-rendering V1 needs no dependency, Cloudflare binding, secret, Pi Developer Portal change, payment, personal-data processing, legal decision, or spending. App Radar notifier remains deferred because automated communications require owner approval.
- Next work package: perform the required portfolio-quality review of weak, duplicate, or unfinished public experiences before selecting any new feature work.
- Parked: MUA Measurement V1; Cloudflare Workers Builds visibility/capability blocker, GitHub issue #48.
- Pi auth: diagnostic/Testnet technical debt; not required by core product and not under active work.
- Payments: locked. `createPayment` absent from product client. Mainnet: absent.
