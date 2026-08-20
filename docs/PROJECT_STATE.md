# PioneerHub project state

- Production main: `628ac14` (P0 UI recovery metadata release).
- Production release: `2026-08-20-p0-ui-recovery-v1`; frontend build: `p0-ui-recovery-v1`. Live rendered 390px audit passed across all 32 public routes; see `docs/PRODUCTION_ROUTE_QA.md`.
- Completed: Safety Center V1, App Radar V2, Learn V2, Start + Return V1, Visual Polish V1, Community Signals V1, Pi App Inspector V1, Pi Transfer Rehearsal V1, KYC Status Navigator V1. PR #52 merged after exact-head GitHub CI and Workers Build passed; merged `main` also passed full local validation, Worker dry-run and Pi-boundary validation before deployment.
- P0 complete: nested public routes emit root-relative CSS/JS URLs. A permanent Playwright rendered mobile/asset-integrity gate covers all public routes and catches missing or HTML-served assets, bad MIME types, empty main content, critical browser errors, and horizontal overflow.
- Next work package: required portfolio-quality review. App Launch Checklist remains paused; no feature is active.
- Parked: MUA Measurement V1; Cloudflare Workers Builds visibility/capability blocker, GitHub issue #48.
- Pi auth: diagnostic/Testnet technical debt; not required by core product and not under active work.
- Payments: locked. `createPayment` absent from product client. Mainnet: absent.
