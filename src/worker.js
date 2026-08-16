/** Public static shell with a deliberately tiny, non-PII operational endpoint. */
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/events" && request.method === "POST") {
    const event = (await request.text()).trim();
    const allowed = new Set(["learn_article_open", "safety_check_start", "safety_check_complete", "scam_shield_start", "scam_shield_complete", "app_radar_view", "app_open_external", "report_scam", "suggest_app", "community_cta", "referral_open", "payment_lab_start", "payment_lab_complete"]);
    if (!allowed.has(event)) return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    console.log(JSON.stringify({ event, kind: "mua", version: env.RELEASE_ID || "unmarked" }));
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }
  if (url.pathname === "/healthz") {
    return Response.json({ status: "ok", service: "pioneerhub", environment: env.APP_ENV, release: env.RELEASE_ID || "unmarked" }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  if (url.pathname === "/validation-key.txt" && env.PI_DOMAIN_VALIDATION_CONTENT) {
    return new Response(env.PI_DOMAIN_VALIDATION_CONTENT, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "X-Frame-Options": "DENY",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      },
    });
  }
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self'; script-src 'self' https://sdk.minepi.com; connect-src 'self' https://api.minepi.com https://sdk.minepi.com; object-src 'none'; upgrade-insecure-requests");
  headers.set("Cache-Control", response.status === 200 && new URL(request.url).pathname.match(/\.(?:css|js|png|jpg|svg|woff2)$/) ? "public, max-age=86400" : "no-cache");
  if (env.APP_ENV !== "production") headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };
