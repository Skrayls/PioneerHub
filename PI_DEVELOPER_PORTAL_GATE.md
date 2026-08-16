# Consolidated Pi Developer Portal Gate

Use this gate only after the current referral and independent-brand release is live. It enables **Testnet only**. Do not create or activate a Mainnet app.

## Founder steps

1. Open **Pi Browser** and launch **Developer Portal**.
2. Create a self-hosted app named **PioneerHub Testnet Lab**. Do not use a Pi trademark in PioneerHub's name, logo, domain or social handle.
3. Select **Testnet** as the app network. The Developer Guide says the network cannot be changed after registration; do not select Mainnet.
4. Set the self-hosted app URL / Production URL to `https://pioneerhub.andriussimonaitis.workers.dev`. If the Portal requires a Development URL, use the same HTTPS URL for this Testnet-only release.
5. In the app checklist, copy the exact validation-file content supplied by Developer Portal. Store it only at `/home/admin/.openclaw/credentials/pioneerhub/pi-testnet-domain-validation.txt` with file mode `600`.
6. Tell OpenClaw that the validation content is present locally. OpenClaw will configure it as the Cloudflare Worker secret `PI_DOMAIN_VALIDATION_CONTENT`, serve it at `https://pioneerhub.andriussimonaitis.workers.dev/validation-key.txt`, and verify the Portal's **Verify domain** step.
7. Generate the app's **Testnet** server API key. Store it only at `/home/admin/.openclaw/credentials/pioneerhub/pi-testnet-api-key` with file mode `600`.
8. Do not paste the key or validation content into chat, GitHub, repository files, `.dev.vars`, GitHub Actions, screenshots, logs or email. OpenClaw will move the API key into the Cloudflare Worker secret `PI_TESTNET_API_KEY` without printing it.
9. Keep Pi Auth scoped to the minimum necessary: start with no optional scopes; add `payments` only for the explicitly labeled Testnet Payment Lab. No Mainnet payment setting is requested.

## Immediate OpenClaw validation after the gate

1. Confirm the Portal validation file is served only at `/validation-key.txt` and has `no-store` cache policy.
2. Confirm `PI_NETWORK=testnet` only in the configured integration environment and production remains otherwise payment-disabled until the Testnet feature flag is explicitly enabled.
3. In Pi Browser Testnet, call Pi SDK authentication, pass the transient access token to the Worker, and verify it server-side through `GET https://api.minepi.com/v2/me` before creating any app session.
4. Test one clearly labeled zero-value/low-risk Testnet Payment Lab scenario only after the server-side approval, completion, idempotency and incomplete-payment handling are wired.
5. Validate that no passphrase is requested, no Testnet API key appears in the client, logs, Git or chat, and no Mainnet endpoint/configuration is used.

## Source basis

- Pi Developer Portal: `https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/devPortal/`
- Pi Quick Start: `https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/quickStart/`
- Pi access-token verification: `https://pi-apps.github.io/community-developer-guide/docs/importantTopics/accessToken/`
- Pi payment flow: `https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/`
