# Pi Sandbox checklist harness

Scope: the isolated, noindex `/diag/pi-sandbox-checklist` route only. It is a
Testnet-only Developer Portal checklist harness; it is not a PioneerHub product
payment feature and has no Mainnet capability.

## Official Pi documentation used

- https://pi-apps.github.io/pi-sdk-docs/platform/SdkReference
- https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformSDK/
- https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/quickStart/
- https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/
- https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/gettingStartedChecklist/

The SDK reference documents `await Pi.init({ version: "2.0", sandbox: true })`
for Sandbox mode, subject to a configured Development URL and Sandbox
authorization. The payment guide requires client creation, server approval,
Pioneer transaction, then server completion. The checklist describes running the
development app in Sandbox and processing an app transaction.

## Boundaries

- The route uses only `['username', 'payments']` and renders only redacted state.
- The only allowed transaction is 0.01 Test-Pi, memo `PioneerHub Testnet Developer Portal checklist`, metadata purpose `developer_portal_checklist`.
- A dedicated server endpoint verifies the remote payment owner, Testnet, user-to-app direction, amount, memo, and purpose before approval.
- No tokens, API keys, wallet credentials, or passphrases are rendered or stored.
- Existing `/diag/pi-auth`, `/diag/pi-signin`, and `/diag/pi-payment-checklist` evidence remains unchanged.
