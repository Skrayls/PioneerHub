/** Public static shell with a deliberately tiny, non-PII operational endpoint. */
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/healthz") {
    return Response.json({ status: "ok", service: "pioneerhub", environment: env.APP_ENV }, {
      headers: { "Cache-Control": "no-store" },
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
