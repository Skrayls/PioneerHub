# Testnet checklist authentication investigation

Date: 2026-08-21. Scope: the isolated `/diag/pi-payment-checklist` route only. Mainnet remains absent.

## Current official basis

- [Pi App Platform SDK](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformSDK/) specifies loading `https://sdk.minepi.com/pi-sdk.js`, initializing with `Pi.init({ version: "2.0" })`, and using `Pi.authenticate(scopes, onIncompletePaymentFound)`.
- The same SDK guide identifies `payments` as the scope required to initialize Pi payments and shows `['payments']` as the payment-scope example. `username` is optional and only returns a username; it is not documented as a payment prerequisite.
- The SDK guide requires backend verification of the transient access token through `/me` before trusting the returned identity.
- [Pi payment flow](https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/) requires `onReadyForServerApproval` before user confirmation and `onReadyForServerCompletion` followed by successful server-side `/complete` before marking the transaction successful.
- [Pi Browser](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piBrowserIntroduction/) is the browser that supports Pi applications and displays apps in iframes. The diagnostic records its top-level/frame context for the remaining live runtime check.
- [Developer Portal](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/devPortal/) requires a Testnet wallet for Testnet transactions and supports Testnet access restrictions/whitelisting configured on the app dashboard.

## Repository-history comparison

| Variant | Historical result | Current decision |
| --- | --- | --- |
| `[]` | PR #23 isolated minimal Auth but did not enable payments. | Not suitable for a payment checklist. |
| `['username']` | PR #29 changed a diagnostic Auth test to username-only. It established no payment-flow requirement. | Not suitable by itself. |
| `['username', 'payments']` | Existing parked product-auth path uses both scopes. | Not required by official payment documentation; avoid requesting optional identity data. |
| `['payments']` | Official payment-scope example. | Retained for the checklist harness. |

PR #28 moved `Pi.init` to the explicit user auth action after earlier initialization experiments. The checklist harness had initialized on page load, so it now initializes from the same explicit button action before calling `Pi.authenticate`.

## Failure taxonomy

- `AUTH_PI_INIT_FAILED`: SDK missing or `Pi.init` rejected.
- `AUTH_PI_SCOPE_FAILED`: SDK rejection explicitly indicates scope/permission.
- `AUTH_PI_REJECTED`: other Pi SDK authentication rejection, including a generic “Authentication failed”.
- `AUTH_ACCESS_TOKEN_MISSING`: SDK resolved without an access token.
- `AUTH_SERVER_VERIFY_FAILED`: PioneerHub could not verify the access token through `/me`.
- `AUTH_SERVER_SESSION_FAILED`: verification succeeded but app-session creation failed or was rejected.

The harness emits local, bounded markers for runtime context, SDK/init state, scopes, authentication settlement, token/user presence booleans, incomplete-payment callback, and server-stage outcome. It never renders tokens, authorization values, keys, wallet data, passphrases, or private keys.
