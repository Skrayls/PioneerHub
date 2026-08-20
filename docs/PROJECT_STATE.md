# PioneerHub project state

- Production main: `45731d4aa785fc17087d483c37adca7a44d45038` (Pi Transfer Rehearsal V1).
- Production release: Pi Transfer Rehearsal V1, verified 2026-08-20; existing frontend cache marker remains `app-inspector-v1`.
- Active milestone: none. Pi Transfer Rehearsal V1 is complete: anonymous browser-only decision rehearsal; no backend, auth, payments, wallet interaction or Mainnet capability. PR #51 merged with exact-head CI and Workers Builds green; merged-main production smoke and route verification passed.
- Completed: Safety Center V1, App Radar V2, Learn V2, Start + Return V1, Visual Polish V1, Community Signals V1, Pi App Inspector V1, Pi Transfer Rehearsal V1.
- Next: post-release whitepaper reassessment and Human Preflight to select the next major utility milestone.
- Parked: MUA Measurement V1; Cloudflare Workers Builds visibility/capability blocker, GitHub issue #48.
- Pi auth: diagnostic/Testnet technical debt; not required by core product and not under active work.
- Payments: locked. `createPayment` absent from product client. Mainnet: absent.
