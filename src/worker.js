/** Stage 0.5 edge entrypoint. Dynamic routes remain absent until reviewed. */
export default { async fetch(request, env) {
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; upgrade-insecure-requests");
  headers.set("Cache-Control", response.status === 200 && new URL(request.url).pathname.match(/\.(?:css|js|png|jpg|svg|woff2)$/) ? "public, max-age=86400" : "no-cache");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };
