# Production route QA

## P0 recovery status — 2026-08-20

Status: **IN PROGRESS — production is not yet cleared.**

The active recovery corrects shell-emitted asset URLs to be root-relative for every public route family. The prior production build serves nested Safety-route asset requests such as `/sauga/styles.css`, which return 404 and can leave JS application containers empty.

The permanent gate is `npm run qa:rendered`. It starts the local Worker (or uses `PIONEERHUB_URL`), opens every public route at a 390px mobile viewport, verifies the expected rendered application container and non-empty main text, checks each local CSS/JS response for HTTP 200 and an appropriate MIME type, rejects HTML returned as an asset, captures critical page errors, and rejects horizontal overflow.

Current public route inventory (all must be verified against the released production head before a PASS):

- `/`
- all `/mokykis/<slug>` routes
- `/sauga`, `/sauga/passphrase`, `/sauga/itartina-nuoroda`, `/sauga/pries-siunciant-pi`
- `/tikrinti-nuoroda`, `/pervedimo-repeticija`, `/kyc-busena`
- `/radar/metodika` and all `/radar/<slug>` routes
- `/prisidek`, `/app-paleidimo-checklist`

Next release step: run the rendered gate successfully in CI, merge and deploy the exact head, then run `PIONEERHUB_URL=https://pioneerhub.andriussimonaitis.workers.dev npm run qa:rendered` and replace this in-progress record with per-route PASS evidence.
