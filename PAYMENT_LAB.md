# Payment Lab boundary

## Current status

Implemented as a **Testnet-only** Pi Browser flow. A user explicitly creates a 0.01 Test-Pi request; the Worker verifies the Pi session, then approves and completes the payment through Pi's server API. A Durable Object serializes each payment identifier so retries cannot duplicate approval or completion.

## Source-backed rules

- Apps must use only Pi SDK for Pi payments.
- Apps may never request a Pioneer to enter their wallet passphrase.
- Testnet onboarding starts in the Pi Developer Portal, where the developer creates a Testnet app, verifies domain ownership and gets an API key.
- The Pi payment flow requires frontend callbacks plus backend approval/completion logic.

Sources rechecked on 2026-08-16:

- `https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/quickStart/`
- `https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/`
- `https://minepi.com/developers/pi-hackathon/`
- `https://minepi.com/blog/10-minutes-pi-payments/`

## Planned Testnet flow

1. User starts a clearly labeled Testnet exercise.
2. Frontend authenticates through Pi SDK only if needed.
3. Frontend creates a Testnet payment request with explicit item, amount and purpose.
4. Pi Wallet handles user confirmation.
5. Pi returns transaction readiness to the app frontend.
6. Backend performs approval/completion with idempotency protection.
7. UI explains the result in plain Lithuanian and shows that this was Testnet.

## Security baseline

- no Mainnet mode
- no passphrase collection
- no wallet import
- backend verification required
- incomplete payments handled explicitly
- replay/duplicate protection required

## Testnet execution boundary

A real test requires Pi Browser with a Testnet-enabled user and Test-Pi. No Mainnet flow, wallet passphrase collection, or wallet import exists. A non-2xx Pi server response is never shown as a completed payment.
