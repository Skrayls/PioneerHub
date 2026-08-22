# Project state

> Historical planning record. Current release, Pi-support, and product-development state is maintained in [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md). In particular, the Testnet Developer Portal checklist is incomplete and parked with `PI_TESTNET_AUTH_SUPPORT_STATUS=WAITING_FOR_PI_SUPPORT`; it is not active product work.

**Updated:** 2026-08-16
**Stage:** 1 — Trust & Utility
**Status:** active

## Live on production

- Canonical production URL: `https://pioneerhub.andriussimonaitis.workers.dev`
- Stage 0.5 infrastructure foundation is accepted done.
- Stage 1 Core is live with mobile-first Home, Learn, Safety Center, App Radar baseline, community entry points and Testnet-only Payment Lab framing.
- Analytics telemetry emission is production-ready through allowlisted Worker events.

## Verified release checkpoints

- `15917c7585e7c0a96305104f65309927655764a5`
  Analytics/MUA release live. `POST /events` accepts only allowlisted event names and discards arbitrary payload fields.
- `ff2a645974ac3d74d6c621e1dc761eff67ba4ed9`
  App Radar V1 baseline verified live with seven clearly labeled official/ecosystem resources and no unsupported PioneerHub scores, verdicts or safety guarantees.
- `8188f61624a63428e68ab14bb36e37b2d6d7a02f`
  First dated PioneerHub App Radar test records verified live. The records distinguish completed safe checks from explicitly untested steps.

## In progress now

- `feature/testnet-payment-lab` adds Testnet-only Pi Browser authentication, server `/me` verification, short-lived app sessions and a real Test-Pi payment lifecycle guarded by idempotent Worker state.
- The domain and Testnet server credential are configured as Worker secrets; credentials remain outside Git and browser code.
- First paid Pi utility and first standalone PioneerHub app selection are being narrowed from scored candidate sets.

## Explicitly open

- Telemetry emission/privacy boundary: PASS.
- Persisted/queryable analytics visibility inside Cloudflare Observability: OPEN.
  Telemetry emission is production-ready; end-to-end persisted analytics visibility is not yet independently proven.

## Current hard boundaries

- Pi Auth and payments operate only in the configured Testnet Pi Browser context.
- No Mainnet payment flow, wallet import, passphrase request or user database.
- Essential safety and learning information remains free.

## Next executable items

1. Validate the Testnet Pi Browser flow after canonical production release.
2. Publish the selected first paid Pi utility and standalone-app direction.
3. Extend genuine PioneerHub test records only where safe evidence can be collected.
