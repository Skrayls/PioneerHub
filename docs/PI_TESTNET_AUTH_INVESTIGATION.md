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

## Failure taxonomy

- `AUTH_PI_INIT_FAILED`: SDK missing or `Pi.init` rejected.
- `AUTH_PI_SCOPE_FAILED`: SDK rejection explicitly indicates scope/permission.
- `AUTH_PI_PRIMARY_FAILED`: other Pi SDK authentication rejection, including a generic “Authentication failed”, from the single combined-scope attempt.
- `AUTH_PI_CONSENT_SCOPE_FAILED`: the exact redacted-safe Pi message indicates prior consent-scope lookup failure.
- `AUTH_ACCESS_TOKEN_MISSING`: SDK resolved without an access token.
- `AUTH_SERVER_VERIFY_FAILED`: PioneerHub could not verify the access token through `/me`.
- `AUTH_SERVER_SESSION_FAILED`: verification succeeded but app-session creation failed or was rejected.

The harness emits local, bounded markers for runtime context, SDK/init state, scopes, authentication settlement, token/user presence booleans, incomplete-payment callback, and server-stage outcome. It never renders tokens, authorization values, keys, wallet data, passphrases, or private keys.
