/** Public shell plus a Testnet-only Pi integration. No Pi credential reaches the client. */
const PI_API = "https://api.minepi.com/v2";
const SESSION_TTL_SECONDS = 600;
const PAYMENT_ID = /^[A-Za-z0-9_-]{1,160}$/;
const TX_ID = /^[A-Za-z0-9_-]{1,240}$/;

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self'; script-src 'self' https://sdk.minepi.com; connect-src 'self' https://api.minepi.com https://sdk.minepi.com; object-src 'none'; upgrade-insecure-requests",
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

async function sessionFor(uid, secret) {
  const payload = base64url(encode(JSON.stringify({ uid, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  return `${payload}.${await sign(payload, secret)}`;
}

async function readSession(request, secret) {
  const token = request.headers.get("Cookie")?.match(/(?:^|;\s*)ph_pi_session=([^;]+)/)?.[1];
  if (!token || !secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature !== await sign(payload, secret)) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(bytes(payload)));
    return typeof data.uid === "string" && data.uid && data.exp > Math.floor(Date.now() / 1000) ? data : null;
  } catch { return null; }
}

async function piUser(accessToken) {
  const response = await fetch(`${PI_API}/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) return null;
  const result = await response.json();
  return typeof result?.user?.uid === "string" ? result.user.uid : null;
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
    body: JSON.stringify({ action, paymentId, uid, txid, credential: env.PI_TESTNET_API_KEY }),
  });
  return { status: response.status, body: await response.json() };
}

export class PaymentLedger {
  constructor(state) { this.state = state; }

  async fetch(request) {
    const input = await request.json();
    const { action, paymentId, uid, txid, credential } = input || {};
    if (!credential || !PAYMENT_ID.test(paymentId) || typeof uid !== "string") return json({ error: "invalid_request" }, 400);
    return this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get("payment");
      if (stored && stored.uid !== uid) return json({ error: "payment_owner_mismatch" }, 403);
      if (action === "approve") {
        if (stored?.status === "approved" || stored?.status === "completed") return json({ state: stored.status, idempotent: true });
        const remote = await fetch(`${PI_API}/payments/${encodeURIComponent(paymentId)}/approve`, {
          method: "POST", headers: { Authorization: `Key ${credential}` },
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
          method: "POST", headers: { Authorization: `Key ${credential}`, "Content-Type": "application/json" }, body: JSON.stringify({ txid }),
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
    const allowed = new Set(["learn_article_open", "safety_check_start", "safety_check_complete", "scam_shield_start", "scam_shield_complete", "app_radar_view", "app_open_external", "report_scam", "suggest_app", "community_cta", "referral_open", "payment_lab_start", "payment_lab_complete", "pi_auth_start", "pi_auth_complete", "testnet_payment_start", "testnet_payment_complete"]);
    if (allowed.has(event)) console.log(JSON.stringify({ event, kind: "mua", version: env.RELEASE_ID || "unmarked" }));
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }
  if (url.pathname === "/healthz") return json({ status: "ok", service: "pioneerhub", environment: env.APP_ENV, release: env.RELEASE_ID || "unmarked" });
  if (url.pathname === "/api/pi/status") return json({ network: env.PI_NETWORK === "testnet" ? "testnet" : "unavailable", auth: env.PI_TESTNET_API_KEY && env.PI_SESSION_SECRET ? "ready" : "configuration_required", payments: env.PI_TESTNET_API_KEY && env.PAYMENT_LEDGER ? "ready" : "configuration_required" });
  if (url.pathname === "/api/pi/auth" && request.method === "POST") {
    if (env.PI_NETWORK !== "testnet" || !env.PI_TESTNET_API_KEY || !env.PI_SESSION_SECRET) return json({ error: "testnet_configuration_required" }, 503);
    const data = await readJson(request);
    if (!data || typeof data.accessToken !== "string" || data.accessToken.length < 12 || data.accessToken.length > 4096) return json({ error: "invalid_auth_request" }, 400);
    const uid = await piUser(data.accessToken);
    if (!uid) return json({ error: "authentication_failed" }, 401);
    return json({ authenticated: true, expiresIn: SESSION_TTL_SECONDS }, 200, { "Set-Cookie": `ph_pi_session=${await sessionFor(uid, env.PI_SESSION_SECRET)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}` });
  }
  if (url.pathname === "/api/pi/logout" && request.method === "POST") return json({ loggedOut: true }, 200, { "Set-Cookie": "ph_pi_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" });
  const paymentRoute = url.pathname.match(/^\/api\/pi\/payments\/([A-Za-z0-9_-]{1,160})\/(approve|complete)$/);
  if (paymentRoute && request.method === "POST") {
    if (env.PI_NETWORK !== "testnet" || !env.PI_TESTNET_API_KEY || !env.PI_SESSION_SECRET || !env.PAYMENT_LEDGER) return json({ error: "testnet_configuration_required" }, 503);
    const session = await readSession(request, env.PI_SESSION_SECRET);
    if (!session) return json({ error: "authentication_required" }, 401);
    const data = await readJson(request);
    const result = await paymentRequest(env, paymentRoute[1], paymentRoute[2], session.uid, data?.txid);
    return json(result.body, result.status);
  }
  if (url.pathname === "/validation-key.txt" && env.PI_DOMAIN_VALIDATION_CONTENT) return new Response(env.PI_DOMAIN_VALIDATION_CONTENT, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'" } });
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([key, value]) => headers.set(key, value));
  headers.set("Cache-Control", response.status === 200 && url.pathname.match(/\.(?:css|js|png|jpg|svg|woff2)$/) ? "public, max-age=86400" : "no-cache");
  if (env.APP_ENV !== "production") headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };
