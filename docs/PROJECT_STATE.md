# PioneerHub project state

- Production main: `45731d4aa785fc17087d483c37adca7a44d45038` (Pi Transfer Rehearsal V1).
- Production release: Pi Transfer Rehearsal V1, verified 2026-08-20; existing frontend cache marker remains `app-inspector-v1`.
- Active milestone: KYC Status Navigator V1 (selected; implementation has not started). It will be an anonymous, browser-only Lithuanian decision guide for common KYC-status questions and safe next steps. It must use only fixed selections and local rendering: no Pi sign-in, KYC documents, screenshots, usernames, wallet details, status claims, backend, persistent storage, payments or Mainnet capability.
- Completed: Safety Center V1, App Radar V2, Learn V2, Start + Return V1, Visual Polish V1, Community Signals V1, Pi App Inspector V1, Pi Transfer Rehearsal V1.
- Completed post-release reassessment (2026-08-20): selected KYC Status Navigator V1 from the portfolio's KYC-issue-triage candidate. It extends PioneerHub's trust-and-utility loop with a high-frequency, action-oriented problem without duplicating Learn, requiring Pi credentials, or introducing automated user communication (which would block the App Radar notifier candidate). Human Preflight: `HUMAN_ACTION_REQUIRED=false`; no new dependency, Cloudflare binding, secret, Pi Developer Portal setting, payment, personal-data processing, legal decision or spending is needed for the browser-only V1.
- Next work package: create the milestone branch from current `main` and implement the first coherent Navigator UI/decision-model slice with focused tests.
- Parked: MUA Measurement V1; Cloudflare Workers Builds visibility/capability blocker, GitHub issue #48.
- Pi auth: diagnostic/Testnet technical debt; not required by core product and not under active work.
- Payments: locked. `createPayment` absent from product client. Mainnet: absent.
