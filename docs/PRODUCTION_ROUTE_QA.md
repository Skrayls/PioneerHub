# Production route QA

## P0 recovery status — 2026-08-20

Status: **PASS — P0 recovery released and production-cleared.**

Final production metadata: `2026-08-20-p0-ui-recovery-v1` / `p0-ui-recovery-v1`, merged main `628ac14`. Live Playwright QA passed all 32 routes at 390px after this metadata deployment.

The active recovery corrects shell-emitted asset URLs to be root-relative for every public route family. The prior production build serves nested Safety-route asset requests such as `/sauga/styles.css`, which return 404 and can leave JS application containers empty.

The permanent gate is `npm run qa:rendered`. It starts the local Worker (or uses `PIONEERHUB_URL`), opens every public route at a 390px mobile viewport, verifies the expected rendered application container and non-empty main text, checks each local CSS/JS response for HTTP 200 and an appropriate MIME type, rejects HTML returned as an asset, captures critical page errors, and rejects horizontal overflow.

Production evidence for exact merged head `24d8f89`:

- GitHub Actions CI `32371450301`: PASS, including `npm run qa:rendered`.
- Workers Build `5e918d3a-a17e-4148-a7bd-8b829b9bccac`: PASS.
- Production rendered audit: `PIONEERHUB_URL=https://pioneerhub.andriussimonaitis.workers.dev npm run qa:rendered`: PASS, 33 routes at a 390px mobile viewport.

| Public routes | Result |
| --- | --- |
| `/` | PASS |
| `/mokykis/pi-network`, `/mokykis/balanso-busenos`, `/mokykis/perkeltas-balansas`, `/mokykis/perkeliamas-balansas`, `/mokykis/nepatvirtintas-balansas`, `/mokykis/mainnet`, `/mokykis/pi-wallet`, `/mokykis/kyc`, `/mokykis/mainnet-checklist`, `/mokykis/lockup`, `/mokykis/referral-team`, `/mokykis/security-circle`, `/mokykis/kyc-validator`, `/mokykis/node`, `/mokykis/pi-browser-apps` | PASS |
| `/sauga`, `/sauga/passphrase`, `/sauga/itartina-nuoroda`, `/sauga/pries-siunciant-pi` | PASS |
| `/tikrinti-nuoroda`, `/pervedimo-repeticija`, `/kyc-busena`, `/prisidek` | PASS |
| `/radar/metodika`, `/radar/pi-browser`, `/radar/pi-wallet`, `/radar/fireside-forum`, `/radar/pi-chats`, `/radar/kyc`, `/radar/pi-launchpad`, `/radar/cidi-games` | PASS |

Every audited route returned HTTP 200, rendered its expected non-empty application content, loaded required local CSS/JS with HTTP 200 and correct non-HTML MIME types, produced no critical uncaught browser errors, and had no mobile horizontal overflow. The regression gate remains required in CI.
