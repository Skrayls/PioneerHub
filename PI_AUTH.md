# Pi Auth boundary

## Current status

Prepared to the exact Developer Portal boundary. Pi login is **not active** on the live site.

## Source-backed rules

- Pi apps that need login must use **only Pi SDK authentication**, not email, password or third-party login.
- The frontend `uid` returned by `Pi.authenticate()` is not trusted by itself.
- The frontend must pass the access token to the backend and the backend must verify it through Pi's `/me` API before treating a user as authenticated.
- The access token is dynamic and should not be used as a persistent identifier.

Sources rechecked on 2026-08-16:

- `https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformSDK/`
- `https://pi-apps.github.io/community-developer-guide/docs/importantTopics/accessToken/`
- `https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/mainnetListingRequirements/`
- `https://minepi.com/developers/pi-hackathon/`

## Planned implementation

1. Frontend loads inside Pi Browser and calls `Pi.authenticate(scopes, onIncompletePaymentFound)`.
2. Frontend sends only the returned access token to the backend over HTTPS.
3. Backend calls Pi `/me` and trusts only the backend-verified `uid`.
4. Backend creates a minimal app session.
5. Logout destroys only the local PioneerHub session; it does not touch Pi account state.

## Minimal stored data

- verified app-local `uid`
- session expiration
- minimal role/flags if ever needed

Do not store:

- passphrase
- wallet contents
- raw access token beyond verification need
- email or unrelated profile data

## Exact remaining boundary

Pi Auth can go no further without:

1. a Pi Developer Portal app created in Pi Browser,
2. verified app domain,
3. app API key / configuration for the target network.

Until then PioneerHub keeps Pi Auth clearly disabled in product UI.
