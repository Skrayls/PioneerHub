/** Public shell plus a Testnet-only Pi integration. No Pi credential reaches the client. */
const PI_API = "https://api.minepi.com/v2";
const SESSION_TTL_SECONDS = 600;
const PAYMENT_ID = /^[A-Za-z0-9_-]{1,160}$/;
const TX_ID = /^[A-Za-z0-9_-]{1,240}$/;
const FRONTEND_BUILD = "app-inspector-v1";
const PI_AUTH_DIAGNOSTIC_PATH = "/diag/pi-auth";
const PI_SIGNIN_DIAGNOSTIC_PATH = "/diag/pi-signin";
const PI_SIGNIN_DIAGNOSTIC_STATE_KEY = "pi_signin_diag_state";
const PI_SIGNIN_CLIENT_ID = "VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4";
const PI_SIGNIN_REDIRECT_URI = "https://pioneerhub.andriussimonaitis.workers.dev/signin/callback";
const SAFETY_CENTER_ROUTES = new Set(["/sauga", "/sauga/passphrase", "/sauga/itartina-nuoroda", "/sauga/pries-siunciant-pi"]);
const RADAR_ROUTES = new Set(["/radar/metodika", "/radar/pi-browser", "/radar/pi-wallet", "/radar/fireside-forum", "/radar/pi-chats", "/radar/kyc", "/radar/pi-launchpad", "/radar/cidi-games"]);
const LEARN_ROUTES = new Set(["/mokykis/pi-network", "/mokykis/balanso-busenos", "/mokykis/perkeltas-balansas", "/mokykis/perkeliamas-balansas", "/mokykis/nepatvirtintas-balansas", "/mokykis/mainnet", "/mokykis/pi-wallet", "/mokykis/kyc", "/mokykis/mainnet-checklist", "/mokykis/lockup", "/mokykis/referral-team", "/mokykis/security-circle", "/mokykis/kyc-validator", "/mokykis/node", "/mokykis/pi-browser-apps"]);
const COMMUNITY_ROUTE = "/prisidek";
const APP_INSPECTOR_ROUTE = "/tikrinti-nuoroda";
const TRANSFER_REHEARSAL_ROUTE = "/pervedimo-repeticija";
const KYC_STATUS_NAVIGATOR_ROUTE = "/kyc-busena";
const APP_LAUNCH_CHECKLIST_ROUTE = "/app-paleidimo-checklist";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://pinet.com https://*.pinet.com https://minepi.com https://*.minepi.com; img-src 'self' data:; style-src 'self'; script-src 'self' https://sdk.minepi.com; connect-src 'self' https://api.minepi.com https://sdk.minepi.com; object-src 'none'; upgrade-insecure-requests",
};

const json = (body, status = 200, headers = {}) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store", ...securityHeaders, ...headers },
});

function piAuthDiagnosticShell(nonce) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pi Auth Isolation Harness</title>
</head>
<body>
  <main>
    <h1>Pi Auth Isolation Harness</h1>
    <p>Testnet-only diagnostic. Payments are locked. This page does not submit identity data or create payments.</p>
    <button id="auth-username" type="button" disabled>AUTH username only</button>
    <button id="auth-username-payments" type="button" disabled>AUTH username + payments</button>
    <ol id="diagnostic-log" aria-live="polite"></ol>
  </main>
  <script src="https://sdk.minepi.com/pi-sdk.js"></script>
  <script nonce="${nonce}">
    (() => {
      const log = document.querySelector('#diagnostic-log');
      const usernameButton = document.querySelector('#auth-username');
      const usernamePaymentsButton = document.querySelector('#auth-username-payments');
      const buttons = [usernameButton, usernamePaymentsButton];
      let authInFlight = false;
      const sensitiveKey = /token|secret|authorization|api.?key|passphrase|wallet|private.?key/i;

      function render(marker, detail = '') {
        const entry = document.createElement('li');
        entry.textContent = new Date().toISOString() + ' ' + marker + (detail ? ': ' + detail : '');
        log.append(entry);
      }

      function redact(value) {
        return String(value || '')
          .replace(/Bearer\\s+[^\\s,;]+/gi, 'Bearer [REDACTED]')
          .replace(/(access_?token|token|secret|authorization|api_?key|passphrase|wallet|private_?key)=([^\\s&,;]+)/gi, '$1=[REDACTED]')
          .replace(/[A-Za-z0-9_-]{16,}\\.[A-Za-z0-9_-]{16,}\\.[A-Za-z0-9_-]{16,}/g, '[REDACTED]')
          .slice(0, 1200);
      }

      function safeValue(value, seen = new WeakSet(), depth = 0) {
        if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
        if (typeof value === 'string') return redact(value);
        if (typeof value !== 'object' || depth > 2 || seen.has(value)) return typeof value;
        seen.add(value);
        if (Array.isArray(value)) return value.slice(0, 12).map(item => safeValue(item, seen, depth + 1));
        return Object.fromEntries(Object.keys(value).slice(0, 24).map(key => [
          sensitiveKey.test(key) ? '[REDACTED_PROPERTY]' : key,
          sensitiveKey.test(key) ? '[REDACTED]' : safeValue(value[key], seen, depth + 1),
        ]));
      }

      function errorDetails(error) {
        const ownNames = Object.getOwnPropertyNames(error || {}).map(name => sensitiveKey.test(name) ? '[REDACTED_PROPERTY]' : name);
        const enumerableKeys = Object.keys(error || {}).map(name => sensitiveKey.test(name) ? '[REDACTED_PROPERTY]' : name);
        let serialized = '';
        try { serialized = JSON.stringify(safeValue(error)); } catch { serialized = '[unserializable]'; }
        return JSON.stringify({
          name: redact(error?.name),
          message: redact(error?.message),
          string: redact(error),
          constructor: redact(error?.constructor?.name),
          ownPropertyNames: ownNames,
          enumerableKeys,
          json: redact(serialized),
          stack: redact(error?.stack),
        });
      }

      function onIncompletePaymentFound(payment) {
        void payment;
        render('INCOMPLETE_PAYMENT_CALLBACK');
      }

      function showRuntimeContext() {
        render('RUNTIME_CONTEXT', JSON.stringify({
          href: location.href,
          origin: location.origin,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          isTopLevel: window.top === window.self,
        }));
      }

      async function runAuth(scopes) {
        if (authInFlight) return;
        authInFlight = true;
        buttons.forEach(button => { button.disabled = true; });
        render('AUTH_CLICK');
        render('AUTH_SCOPES', JSON.stringify(scopes));
        render('AUTH_CALLBACK_TYPE', typeof onIncompletePaymentFound);
        render('AUTH_CALL_ENTER');

        let authPromise;
        try {
          authPromise = Pi.authenticate(scopes, onIncompletePaymentFound);
          render('AUTH_PROMISE_CREATED');
        } catch (error) {
          render('AUTH_REJECTED', errorDetails(error));
          return;
        }

        try {
          const result = await authPromise;
          const identity = result && typeof result === 'object' ? result.user : null;
          render('AUTH_RESOLVED', JSON.stringify({
            accessTokenExists: Boolean(result?.accessToken),
            uidPresent: Boolean(identity?.uid),
            username: typeof identity?.username === 'string' ? redact(identity.username) : '',
          }));
        } catch (error) {
          render('AUTH_REJECTED', errorDetails(error));
        }
      }

      render('PAGE_READY');
      showRuntimeContext();
      if (typeof Pi === 'undefined') return;
      render('SDK_PRESENT');
      (async () => {
        render('INIT_CALL_ENTER');
        try {
          await Pi.init({ version: "2.0" });
          render('INIT_RESOLVED');
          buttons.forEach(button => { button.disabled = false; });
        } catch (error) {
          render('INIT_REJECTED', errorDetails(error));
          return;
        }
        usernameButton.addEventListener('click', () => {
          const scopes = ["username"];
          runAuth(scopes);
        });
        usernamePaymentsButton.addEventListener('click', () => {
          const scopes = ["username", "payments"];
          runAuth(scopes);
        });
      })();
    })();
  </script>
</body>
</html>`;
}

function piSignInDiagnosticShell(nonce) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pi Sign-In Isolation Harness</title></head>
<body><main><h1>Pi Sign-In Isolation Harness</h1><p>Testnet-only diagnostic. No payments are created.</p><button id="pi-signin" type="button" disabled>SIGN IN WITH PI — USERNAME ONLY</button><ol id="diagnostic-log" aria-live="polite"></ol></main>
<script src="https://sdk.minepi.com/pi-sdk.js"></script><script nonce="${nonce}">
(() => {
  const stateKey = '${PI_SIGNIN_DIAGNOSTIC_STATE_KEY}';
  const button = document.querySelector('#pi-signin');
  const log = document.querySelector('#diagnostic-log');
  const render = (marker, detail = '') => { const item = document.createElement('li'); item.textContent = new Date().toISOString() + ' ' + marker + (detail ? ': ' + detail : ''); log.append(item); };
  const context = () => render('RUNTIME_CONTEXT', JSON.stringify({ href: location.href, origin: location.origin, referrer: document.referrer, userAgent: navigator.userAgent, isTopLevel: window.top === window.self }));
  const randomState = () => crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, '0')).join('');
  render('PAGE_READY'); context();
  if (typeof Pi === 'undefined') return;
  render('SDK_PRESENT');
  (async () => {
    render('INIT_CALL_ENTER');
    try {
      await Pi.init({ version: "2.0" });
      render('INIT_RESOLVED');
      button.disabled = false;
    } catch (error) {
      render('INIT_REJECTED', String(error?.message || error).slice(0, 240));
      return;
    }
    button.addEventListener('click', () => {
      const state = randomState();
      sessionStorage.setItem(stateKey, state);
      render('SIGNIN_CLICK');
      render('STATE_CREATED', 'true');
      render('SIGNIN_CALL_ENTER');
      Pi.signIn({ clientId: "${PI_SIGNIN_CLIENT_ID}", redirectUri: "${PI_SIGNIN_REDIRECT_URI}", scopes: ["username"], state });
    }, { once: true });
  })();
})();
</script></body></html>`;
}

function piSignInCallbackBootstrap(nonce, version) {
  return `<script nonce="${nonce}">
(() => {
  const stateKey = '${PI_SIGNIN_DIAGNOSTIC_STATE_KEY}';
  if (!sessionStorage.getItem(stateKey)) {
    const productApp = document.querySelector('[data-pioneerhub-product-app]');
    productApp.type = 'text/javascript';
    productApp.src = 'app.js${version}';
    return;
  }
  document.title = 'Pi Sign-In Isolation Callback';
  const main = document.createElement('main');
  const title = document.createElement('h1'); title.textContent = 'Pi Sign-In Isolation Callback';
  const log = document.createElement('ol'); log.id = 'diagnostic-log'; log.setAttribute('aria-live', 'polite');
  main.append(title, log); document.body.replaceChildren(main);
  const render = (marker, detail = '') => { const item = document.createElement('li'); item.textContent = new Date().toISOString() + ' ' + marker + (detail ? ': ' + detail : ''); log.append(item); };
  const clean = value => String(value || '').replace(/Bearer\\s+[^\\s,;]+/gi, 'Bearer [REDACTED]').replace(/(token|secret|authorization|api_?key)=([^\\s&,;]+)/gi, '$1=[REDACTED]').slice(0, 1000);
  const fragment = new URLSearchParams(location.hash.startsWith('#') ? location.hash.slice(1) : '');
  const expectedState = sessionStorage.getItem(stateKey);
  const returnedState = fragment.get('state');
  const stateMatch = Boolean(expectedState) && returnedState === expectedState;
  render('CALLBACK_LOADED');
  render('STATE_PRESENT', String(Boolean(expectedState)));
  render('STATE_MATCH', String(stateMatch));
  sessionStorage.removeItem(stateKey);
  if (!stateMatch) { render('STATE_MISMATCH'); return; }
  const oauthError = fragment.get('error');
  if (oauthError) { render('OAUTH_ERROR', clean(oauthError)); return; }
  const accessToken = fragment.get('access_token');
  if (!accessToken) { render('ACCESS_TOKEN_PRESENT', 'false'); return; }
  render('ACCESS_TOKEN_PRESENT', 'true');
  if (fragment.get('token_type')) render('TOKEN_TYPE', clean(fragment.get('token_type')));
  if (fragment.get('expires_in')) render('EXPIRES_IN', clean(fragment.get('expires_in')));
  history.replaceState(null, '', window.location.pathname);
  (async () => {
    try {
      render('ME_REQUEST_SENT');
      const response = await fetch('https://api.minepi.com/v2/me', { headers: { Authorization: 'Bearer ' + accessToken } });
      render('ME_HTTP_STATUS', String(response.status));
      if (!response.ok) { render('ME_ERROR', clean(await response.text())); return; }
      const identity = await response.json();
      render('ME_OK');
      render('uid present', String(Boolean(identity?.uid)));
      render('username', typeof identity?.username === 'string' ? clean(identity.username) : '');
    } catch (error) { render('ME_ERROR', clean(error?.message || error)); }
  })();
})();
</script>`;
}

const base64url = (value) => btoa(String.fromCharCode(...new Uint8Array(value)))
  .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
const bytes = (value) => Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), char => char.charCodeAt(0));
const encode = (value) => new TextEncoder().encode(value);

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", key, encode(value)));
}

async function authorization(secret) { return base64url(crypto.getRandomValues(new Uint8Array(32))); }
async function sessionKey(token, secret) { return sign(token, secret); }
async function readSession(request, env) {
  const token = request.headers.get("Authorization")?.match(/^Bearer ([A-Za-z0-9_-]{32,128})$/)?.[1];
  if (!token || !env.PI_SESSION_SECRET || !env.AUTH_SESSIONS) return null;
  const stub = env.AUTH_SESSIONS.get(env.AUTH_SESSIONS.idFromName(await sessionKey(token, env.PI_SESSION_SECRET)));
  const response = await stub.fetch("https://session.internal/");
  return response.ok ? response.json() : null;
}

export class AuthSession {
  constructor(state) { this.state = state; }
  async fetch(request) {
    if (request.method === "POST") { await this.state.storage.put("session", await request.json()); return new Response(null, { status: 204 }); }
    const session = await this.state.storage.get("session");
    if (!session || session.exp <= Math.floor(Date.now() / 1000)) { await this.state.storage.delete("session"); return new Response(null, { status: 401 }); }
    return Response.json({ uid: session.uid });
  }
}

async function piUser(accessToken) {
  try {
    const response = await fetch(`${PI_API}/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) return { code: "AUTH-ME-VERIFY" };
    const result = await response.json();
    return typeof result?.uid === "string" && result.uid.length > 0 && result.uid.length <= 256 ? { uid: result.uid } : { code: "AUTH-ME-VERIFY" };
  } catch { return { code: "AUTH-NETWORK" }; }
}

async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

async function paymentRequest(env, paymentId, action, uid, txid) {
  const id = env.PAYMENT_LEDGER.idFromName(paymentId);
  const stub = env.PAYMENT_LEDGER.get(id);
  const response = await stub.fetch("https://payment.internal/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, paymentId, uid, txid }),
  });
  return { status: response.status, body: await response.json() };
}

export class PaymentLedger {
  constructor(state, env) { this.state = state; this.env = env; }

  async fetch(request) {
    const input = await request.json();
    const { action, paymentId, uid, txid } = input || {};
    if (!this.env.PI_TESTNET_API_KEY || !PAYMENT_ID.test(paymentId) || typeof uid !== "string") return json({ error: "invalid_request" }, 400);
    return this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get("payment");
      if (stored && stored.uid !== uid) return json({ error: "payment_owner_mismatch" }, 403);
      if (action === "approve") {
        if (stored?.status === "approved" || stored?.status === "completed") return json({ state: stored.status, idempotent: true });
        const remote = await fetch(`${PI_API}/payments/${encodeURIComponent(paymentId)}/approve`, {
          method: "POST", headers: { Authorization: `Key ${this.env.PI_TESTNET_API_KEY}` },
        });
        if (!remote.ok) return json({ error: "approval_unavailable" }, 502);
        const payment = { uid, status: "approved", paymentId };
        await this.state.storage.put("payment", payment);
        return json({ state: "approved", idempotent: false });
      }
      if (action === "complete") {
        if (!TX_ID.test(txid || "")) return json({ error: "invalid_transaction" }, 400);
        if (stored?.status === "completed" && stored.txid === txid) return json({ state: "completed", idempotent: true });
        if (!stored || stored.status !== "approved") return json({ error: "payment_not_approved" }, 409);
        const remote = await fetch(`${PI_API}/payments/${encodeURIComponent(paymentId)}/complete`, {
          method: "POST", headers: { Authorization: `Key ${this.env.PI_TESTNET_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ txid }),
        });
        if (!remote.ok) return json({ error: "completion_unavailable" }, 502);
        await this.state.storage.put("payment", { ...stored, status: "completed", txid });
        return json({ state: "completed", idempotent: false });
      }
      return json({ error: "invalid_action" }, 400);
    });
  }
}

export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === PI_AUTH_DIAGNOSTIC_PATH && request.method === "GET") {
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const contentSecurityPolicy = securityHeaders["Content-Security-Policy"].replace(
      "script-src 'self' https://sdk.minepi.com;",
      `script-src 'self' https://sdk.minepi.com 'nonce-${nonce}';`,
    );
    return new Response(piAuthDiagnosticShell(nonce), {
      headers: {
        ...securityHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": contentSecurityPolicy,
      },
    });
  }
  if (url.pathname === PI_SIGNIN_DIAGNOSTIC_PATH && request.method === "GET") {
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const contentSecurityPolicy = securityHeaders["Content-Security-Policy"].replace(
      "script-src 'self' https://sdk.minepi.com;",
      `script-src 'self' https://sdk.minepi.com 'nonce-${nonce}';`,
    );
    return new Response(piSignInDiagnosticShell(nonce), {
      headers: { ...securityHeaders, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Content-Security-Policy": contentSecurityPolicy },
    });
  }
  if (url.pathname === "/events" && request.method === "POST") {
    const event = (await request.text()).trim();
    const allowed = new Set(["learn_article_open", "safety_check_start", "safety_check_complete", "scam_shield_start", "scam_shield_complete", "app_radar_view", "app_open_external", "report_scam", "suggest_app", "community_cta", "referral_open", "transfer_rehearsal_start", "transfer_rehearsal_complete", "payment_lab_start", "payment_lab_complete", "pi_auth_start", "pi_auth_complete", "pi_incomplete_payment_callback", "testnet_payment_start", "testnet_payment_complete"]);
    if (allowed.has(event)) console.log(JSON.stringify({ event, kind: "mua", version: env.RELEASE_ID || "unmarked" }));
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }
  if (url.pathname === "/healthz") return json({ status: "ok", service: "pioneerhub", environment: env.APP_ENV, release: env.RELEASE_ID || "unmarked" });
  if (url.pathname === "/api/pi/status") return json({ network: env.PI_NETWORK === "testnet" ? "testnet" : "unavailable", auth: env.PI_TESTNET_API_KEY && env.PI_SESSION_SECRET && env.AUTH_SESSIONS ? "ready" : "configuration_required", payments: env.PI_TESTNET_API_KEY && env.PAYMENT_LEDGER ? "ready" : "configuration_required" });
  if (url.pathname === "/api/pi/auth" && request.method === "POST") {
    if (env.PI_NETWORK !== "testnet" || !env.PI_TESTNET_API_KEY || !env.PI_SESSION_SECRET || !env.AUTH_SESSIONS) return json({ code: "AUTH-SESSION" }, 503);
    const data = await readJson(request);
    if (!data || typeof data.accessToken !== "string" || data.accessToken.length < 12 || data.accessToken.length > 4096) return json({ code: "AUTH-NETWORK" }, 400);
    const identity = await piUser(data.accessToken);
    if (!identity.uid) return json({ code: identity.code }, 401);
    const token = await authorization(env.PI_SESSION_SECRET);
    const stub = env.AUTH_SESSIONS.get(env.AUTH_SESSIONS.idFromName(await sessionKey(token, env.PI_SESSION_SECRET)));
    await stub.fetch("https://session.internal/", { method: "POST", body: JSON.stringify({ uid: identity.uid, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }) });
    return json({ authenticated: true, authorization: token, expiresIn: SESSION_TTL_SECONDS });
  }
  if (url.pathname === "/api/pi/logout" && request.method === "POST") return json({ loggedOut: true });
  const paymentRoute = url.pathname.match(/^\/api\/pi\/payments\/([A-Za-z0-9_-]{1,160})\/(approve|complete)$/);
  if (paymentRoute && request.method === "POST") {
    if (env.PI_NETWORK !== "testnet" || !env.PI_TESTNET_API_KEY || !env.PI_SESSION_SECRET || !env.PAYMENT_LEDGER) return json({ error: "testnet_configuration_required" }, 503);
    const session = await readSession(request, env);
    if (!session) return json({ error: "authentication_required" }, 401);
    const data = await readJson(request);
    const result = await paymentRequest(env, paymentRoute[1], paymentRoute[2], session.uid, data?.txid);
    return json(result.body, result.status);
  }
  if (url.pathname === "/validation-key.txt" && env.PI_DOMAIN_VALIDATION_CONTENT) return new Response(env.PI_DOMAIN_VALIDATION_CONTENT, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'" } });
  const isSignInCallback = url.pathname === "/signin/callback";
  const isSafetyCenterRoute = SAFETY_CENTER_ROUTES.has(url.pathname);
  const isRadarRoute = RADAR_ROUTES.has(url.pathname);
  const isLearnRoute = LEARN_ROUTES.has(url.pathname);
  const isCommunityRoute = url.pathname === COMMUNITY_ROUTE;
  const isAppInspectorRoute = url.pathname === APP_INSPECTOR_ROUTE;
  const isTransferRehearsalRoute = url.pathname === TRANSFER_REHEARSAL_ROUTE;
  const isKycStatusNavigatorRoute = url.pathname === KYC_STATUS_NAVIGATOR_ROUTE;
  const isAppLaunchChecklistRoute = url.pathname === APP_LAUNCH_CHECKLIST_ROUTE;
  const assetRequest = isSignInCallback
    ? new Request(new URL("/", request.url), request)
    : isSafetyCenterRoute ? new Request(new URL("/safety-center-shell.txt", request.url), request)
      : isRadarRoute ? new Request(new URL("/radar-shell.txt", request.url), request)
        : isLearnRoute ? new Request(new URL("/learn-shell.txt", request.url), request)
          : isCommunityRoute ? new Request(new URL("/community-shell.txt", request.url), request)
            : isAppInspectorRoute ? new Request(new URL("/app-inspector-shell.txt", request.url), request)
              : isTransferRehearsalRoute ? new Request(new URL("/transfer-rehearsal-shell.txt", request.url), request)
                : isKycStatusNavigatorRoute ? new Request(new URL("/kyc-status-navigator-shell.txt", request.url), request)
                  : isAppLaunchChecklistRoute ? new Request(new URL("/app-launch-checklist-shell.txt", request.url), request) : request;
  const response = await env.ASSETS.fetch(assetRequest);
  const headers = new Headers(response.headers);
  if (isSafetyCenterRoute || isRadarRoute || isLearnRoute || isCommunityRoute || isAppInspectorRoute || isTransferRehearsalRoute || isKycStatusNavigatorRoute || isAppLaunchChecklistRoute) headers.set("Content-Type", "text/html; charset=utf-8");
  Object.entries(securityHeaders).forEach(([key, value]) => headers.set(key, value)); headers.delete("X-Frame-Options");
  const isShell = isSafetyCenterRoute || isRadarRoute || isLearnRoute || isCommunityRoute || isAppInspectorRoute || isTransferRehearsalRoute || isKycStatusNavigatorRoute || isAppLaunchChecklistRoute || response.headers.get("Content-Type")?.includes("text/html");
  const isVersionedAsset = url.searchParams.get("v") === FRONTEND_BUILD && url.pathname.match(/\.(?:css|js)$/);
  headers.set("Cache-Control", isShell ? "no-store" : isVersionedAsset ? "public, max-age=31536000, immutable" : response.status === 200 && url.pathname.match(/\.(?:css|png|jpg|svg|woff2)$/) ? "public, max-age=86400" : "no-cache");
  if (env.APP_ENV !== "production") headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (isShell) {
    const version = `?v=${FRONTEND_BUILD}`;
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const shellStatus = `<!-- PioneerHub build: ${FRONTEND_BUILD}; technical status is available through /healthz and diagnostic routes. -->`;
    if (isSignInCallback) headers.set("Content-Security-Policy", securityHeaders["Content-Security-Policy"].replace("script-src 'self' https://sdk.minepi.com;", `script-src 'self' https://sdk.minepi.com 'nonce-${nonce}';`));
    const html = (await response.text())
      .replaceAll('href="styles.css"', `href="/styles.css${version}"`)
      .replaceAll('href="safety-center.css"', `href="/safety-center.css${version}"`)
      .replaceAll('src="safety-center.js"', `src="/safety-center.js${version}"`)
      .replaceAll('href="shield.css"', `href="/shield.css${version}"`)
      .replaceAll('href="brand.css"', `href="/brand.css${version}"`)
      .replaceAll('src="radar-v2.js"', `src="/radar-v2.js${version}"`)
      .replaceAll('src="learn-v2.js"', `src="/learn-v2.js${version}"`)
      .replaceAll('href="community-signals.css"', `href="/community-signals.css${version}"`)
      .replaceAll('src="community-signals.js"', `src="/community-signals.js${version}"`)
      .replaceAll('href="app-inspector.css"', `href="/app-inspector.css${version}"`)
      .replaceAll('src="app-inspector.js"', `src="/app-inspector.js${version}"`)
      .replaceAll('href="transfer-rehearsal.css"', `href="/transfer-rehearsal.css${version}"`)
      .replaceAll('src="transfer-rehearsal.js"', `src="/transfer-rehearsal.js${version}"`)
      .replaceAll('href="kyc-status-navigator.css"', `href="/kyc-status-navigator.css${version}"`)
      .replaceAll('src="kyc-status-navigator.js"', `src="/kyc-status-navigator.js${version}"`)
      .replaceAll('href="app-launch-checklist.css"', `href="/app-launch-checklist.css${version}"`)
      .replaceAll('src="app-launch-checklist.js"', `src="/app-launch-checklist.js${version}"`)
      .replaceAll('src="app.js"', isSignInCallback ? 'type="application/pioneerhub-product-app" data-pioneerhub-product-app' : `src="/app.js${version}"`)
      .replaceAll("REQUIRES PI DEVELOPER PORTAL CONFIGURATION", "TESTNET INTEGRATION ACTIVE — AUTH TESTING")
      .replace("PioneerHub dar nejungia Pi prisijungimo ar realiu mokejimu.", "Pi Developer Portal, domain verification, PiNet ir serverio Testnet raktas yra sukonfiguruoti. Mokėjimas lieka užrakintas iki patikrinto prisijungimo.")
      .replace("Pi loginas nėra aktyvus", "Pi loginas tikrinamas Testnet aplinkoje")
      .replace("Testnet mokėjimas dar nevykdomas", "Testnet mokėjimas užrakintas iki patikrinto prisijungimo")
      .replace("</section>\n<section id=\"community\"", `${shellStatus}</section>\n<section id="community"`)
      .replace("</body>", isSignInCallback ? `${piSignInCallbackBootstrap(nonce, version)}</body>` : "</body>");
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };
