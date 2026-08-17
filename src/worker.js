/** Public shell plus a Testnet-only Pi integration. No Pi credential reaches the client. */
const PI_API = "https://api.minepi.com/v2";
const SESSION_TTL_SECONDS = 600;
const PAYMENT_ID = /^[A-Za-z0-9_-]{1,160}$/;
const TX_ID = /^[A-Za-z0-9_-]{1,240}$/;
const FRONTEND_BUILD = "auth-settlement-r4";

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
    return typeof result?.user?.uid === "string" ? { uid: result.user.uid } : { code: "AUTH-ME-VERIFY" };
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
  if (url.pathname === "/events" && request.method === "POST") {
    const event = (await request.text()).trim();
    const allowed = new Set(["learn_article_open", "safety_check_start", "safety_check_complete", "scam_shield_start", "scam_shield_complete", "app_radar_view", "app_open_external", "report_scam", "suggest_app", "community_cta", "referral_open", "payment_lab_start", "payment_lab_complete", "pi_auth_start", "pi_auth_complete", "pi_incomplete_payment_callback", "testnet_payment_start", "testnet_payment_complete"]);
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
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([key, value]) => headers.set(key, value)); headers.delete("X-Frame-Options");
  const isShell = response.headers.get("Content-Type")?.includes("text/html");
  const isVersionedAsset = url.searchParams.get("v") === FRONTEND_BUILD && url.pathname.match(/\.(?:css|js)$/);
  headers.set("Cache-Control", isShell ? "no-store" : isVersionedAsset ? "public, max-age=31536000, immutable" : response.status === 200 && url.pathname.match(/\.(?:css|png|jpg|svg|woff2)$/) ? "public, max-age=86400" : "no-cache");
  if (env.APP_ENV !== "production") headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (isShell) {
    const version = `?v=${FRONTEND_BUILD}`;
    const shellStatus = `<aside class="note" data-testid="frontend-build">TESTNET INTEGRATION ACTIVE — AUTH TESTING · Build: ${FRONTEND_BUILD} · FRONTEND-RUNTIME: PENDING</aside>`;
    const html = (await response.text())
      .replaceAll('href="styles.css"', `href="styles.css${version}"`)
      .replaceAll('href="shield.css"', `href="shield.css${version}"`)
      .replaceAll('href="brand.css"', `href="brand.css${version}"`)
      .replaceAll('src="app.js"', `src="app.js${version}"`)
      .replaceAll("REQUIRES PI DEVELOPER PORTAL CONFIGURATION", "TESTNET INTEGRATION ACTIVE — AUTH TESTING")
      .replace("PioneerHub dar nejungia Pi prisijungimo ar realiu mokejimu.", "Pi Developer Portal, domain verification, PiNet ir serverio Testnet raktas yra sukonfiguruoti. Mokėjimas lieka užrakintas iki patikrinto prisijungimo.")
      .replace("Pi loginas nėra aktyvus", "Pi loginas tikrinamas Testnet aplinkoje")
      .replace("Testnet mokėjimas dar nevykdomas", "Testnet mokėjimas užrakintas iki patikrinto prisijungimo")
      .replace("</section>\n<section id=\"community\"", `${shellStatus}</section>\n<section id="community"`);
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };
