# Testnet checklist authentication investigation

Date: 2026-08-21. Scope: the isolated `/diag/pi-payment-checklist` route only. Mainnet remains absent.

## Current official basis

- [Pi App Platform SDK](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformSDK/) specifies loading `https://sdk.minepi.com/pi-sdk.js`, initializing with `Pi.init({ version: "2.0" })`, and using `Pi.authenticate(scopes, onIncompletePaymentFound)`.
- The SDK guide identifies `payments` as the scope required to initialize Pi payments and shows `['payments']` as a valid payment-scope example. `username` is optional and returns a username.
- [Quick Start](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/quickStart/) gives the current end-to-end payment example with `['payments', 'username']`. The checklist follows that combined payment example as `['username', 'payments']`; scope ordering has no semantic role here.
- The SDK guide requires backend verification of the transient access token through `/me` before trusting the returned identity.
- [Pi payment flow](https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/) requires `onReadyForServerApproval` before user confirmation and `onReadyForServerCompletion` followed by successful server-side `/complete` before marking the transaction successful.
- [Pi Browser](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piBrowserIntroduction/) is the browser that supports Pi applications and displays apps in iframes. The diagnostic records its top-level/frame context for the remaining live runtime check.
- [Developer Portal](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/devPortal/) requires a Testnet wallet for Testnet transactions and supports Testnet access restrictions/whitelisting configured on the app dashboard.

## Repository-history comparison

| Variant | Historical result | Current decision |
| --- | --- | --- |
| `[]` | PR #23 isolated minimal Auth but did not enable payments. | Not suitable for a payment checklist. |
| `['username']` | PR #29 changed a diagnostic Auth test to username-only. It established no payment-flow requirement. | Not suitable by itself. |
| `['username', 'payments']` | Existing parked product-auth path uses both scopes; current Quick Start payment example uses the same two scopes. | Selected as the one checklist authentication attempt. |
| `['payments']` | Official SDK payment-scope example. | Valid but not selected after the real consent-scope failure. |

PR #28 moved `Pi.init` to the explicit user auth action after earlier initialization experiments. The checklist harness had initialized on page load, so it now initializes from the same explicit button action before calling `Pi.authenticate`.

## Consent-scope recovery evidence

### Confirmed

- The owner observed `Pi.init` resolve, then `Pi.authenticate(['payments'], ...)` reject before an access token, backend `/api/pi/auth`, or `createPayment` was reached.
- The observed SDK message was `Network error: Failed to check previous consent scopes` on a later attempt. This is classified as `AUTH_PI_CONSENT_SCOPE_FAILED`.
- No current official Pi documentation or official SDK-source search result explains that exact string. It must therefore not be treated as proof of a specific Portal misconfiguration or a Pi Browser defect.
- Current Quick Start and PioneerHub's prior native Pi Browser path both use the combined `username` + `payments` scope set.

### Hypotheses not treated as facts

- The SDK may be reconciling prior username consent with the requested payment consent.
- The failure may be a consent-state lookup network/runtime issue inside Pi Browser.
- Testnet app access/whitelist state may influence the SDK's consent lookup.

The recovery makes **one** combined-scope attempt per explicit owner click. It does not loop, fall back repeatedly, clear consent, modify Portal settings, or manipulate user consent remotely.

## Pi Testnet auth platform / consent audit (2026-08-21)

### Confirmed

- The deployed Worker is production/Testnet-only: `PI_NETWORK` is `testnet`; the deployed Worker secret inventory contains only the Testnet API key, session secret, and domain-validation content; Mainnet configuration is absent. The server API key is not involved until after SDK authentication succeeds.
- The expected self-hosted Production URL is `https://pioneerhub.andriussimonaitis.workers.dev`. It serves HTTPS without a redirect. The live `/validation-key.txt` response is plain text, `200`, `no-store`, `nosniff`, and byte-for-byte matches the locally retained Portal validation content. This establishes a structurally correct validation endpoint, but only the Developer Portal can attest its saved verification state.
- `Pi.init({ version: "2.0" })`, the CDN script location, one explicit-click `Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)`, and the server-verification sequence match the current official SDK reference and the Pi demo flow. The isolated route contains one authenticate call, no page-load authentication, no automatic retry, no `sandbox: true`, and does not load `app/app.js`; repeated owner log sequences are therefore separate clicks, not an internal retry.
- Sandbox mode is for a Development URL opened through `sandbox.minepi.com`; current official guidance does not support enabling it for this production Testnet origin. It remains disabled.
- The current public SDK source maps the exact earlier message `Network error: Failed to check previous consent scopes` to its internal `consent_check_failed` result. This confirms the earlier failure occurred inside the SDK's consent lookup, not in PioneerHub's backend.
- The same current SDK source emits generic `Authentication failed.` only after the consent step, while it obtains bridge communication data and internally calls its own `/v2/me`. The observed post-Allow failure therefore remains inside the Pi SDK/Pi platform path before PioneerHub receives an access token. It is not evidence of a `PI_TESTNET_API_KEY`, Testnet-wallet, payment approval, completion, or Worker session failure.

### Likely / possible / unsupported

- **Likely next configuration check:** the Testnet app's optional **Whitelist Users** setting. Official Developer Portal guidance says a blank field grants access to all Testnet visitors; a non-empty field limits access to listed Pi usernames. This setting cannot be read by the Worker or inferred from the consent modal.
- **Possible:** a stale consent record, a Pi Browser consent-service/network issue, or a Pi platform regression can produce the internal SDK failure. The public SDK exposes no supported app API to reset, revoke, or inspect that state.
- **Unsupported:** changing scope order, enabling `sandbox: true`, rotating the server API key, creating a wallet, or changing payment callbacks as a remedy for this pre-token authentication failure. No source supports those as fixes here.

### Support park

`PI_TESTNET_AUTH_SUPPORT_STATUS=WAITING_FOR_PI_SUPPORT`. The Pi Developer Support request has been submitted. The whitelist observation is retained as diagnostic context only; it is **not** an owner action while support is pending. Do not change Portal configuration, scopes, network, URLs, sandbox setting, API key, wallet, credentials, or diagnostic flow; do not retry consent, request Pi Browser testing, or initiate a Test-Pi transaction unless Pi Support provides actionable information. `TESTNET_DEVELOPER_CHECKLIST=INCOMPLETE` remains true and does not block normal product work.

### Ready-to-send Pi developer support report

> Testnet app: PioneerHub Testnet Lab. Production origin: `https://pioneerhub.andriussimonaitis.workers.dev`. In Pi Browser on iOS, `Pi.init({ version: "2.0" })` succeeds. An explicit `Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)` opens the native PioneerHub Testnet Lab consent modal; after Allow, the SDK rejects with `Authentication failed.` (`AUTH_PI_PRIMARY_FAILED`). A prior attempt produced `Network error: Failed to check previous consent scopes` (`AUTH_PI_CONSENT_SCOPE_FAILED`). No access token is returned, PioneerHub's `/api/pi/auth` is not reached, and no payment is created. Please advise whether the app's Testnet consent/access state requires a Portal-side correction or whether there is a Pi Browser/consent-service incident. No credentials, tokens, wallet addresses, or payment data are included.

## Failure taxonomy

- `AUTH_PI_INIT_FAILED`: SDK missing or `Pi.init` rejected.
- `AUTH_PI_SCOPE_FAILED`: SDK rejection explicitly indicates scope/permission.
- `AUTH_PI_PRIMARY_FAILED`: other Pi SDK authentication rejection, including a generic “Authentication failed”, from the single combined-scope attempt.
- `AUTH_PI_CONSENT_SCOPE_FAILED`: the exact redacted-safe Pi message indicates prior consent-scope lookup failure.
- `AUTH_ACCESS_TOKEN_MISSING`: SDK resolved without an access token.
- `AUTH_SERVER_VERIFY_FAILED`: PioneerHub could not verify the access token through `/me`.
- `AUTH_SERVER_SESSION_FAILED`: verification succeeded but app-session creation failed or was rejected.

The harness emits local, bounded markers for runtime context, SDK/init state, scopes, authentication settlement, token/user presence booleans, incomplete-payment callback, and server-stage outcome. It never renders tokens, authorization values, keys, wallet data, passphrases, or private keys.
