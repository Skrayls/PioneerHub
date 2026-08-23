/** Public shell plus a Testnet-only Pi integration. No Pi credential reaches the client. */
const PI_API = "https://api.minepi.com/v2";
const SESSION_TTL_SECONDS = 600;
const PAYMENT_ID = /^[A-Za-z0-9_-]{1,160}$/;
const TX_ID = /^[A-Za-z0-9_-]{1,240}$/;
const FRONTEND_BUILD = "organic-discovery-readiness-v1";
const PI_AUTH_DIAGNOSTIC_PATH = "/diag/pi-auth";
const PI_SIGNIN_DIAGNOSTIC_PATH = "/diag/pi-signin";
const PI_PAYMENT_CHECKLIST_PATH = "/diag/pi-payment-checklist";
const PI_PAYMENT_CHECKLIST_AMOUNT = 0.01;
const PI_PAYMENT_CHECKLIST_MEMO = "PioneerHub Testnet Developer Portal verification";
const PI_PAYMENT_CHECKLIST_METADATA = Object.freeze({ purpose: "developer_portal_checklist" });
const PI_SIGNIN_DIAGNOSTIC_STATE_KEY = "pi_signin_diag_state";
const PI_SIGNIN_CLIENT_ID = "VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4";
const PI_SIGNIN_REDIRECT_URI = "https://pioneerhub.andriussimonaitis.workers.dev/signin/callback";
const CANONICAL_ORIGIN = "https://pioneerhub.andriussimonaitis.workers.dev";
const GOOGLE_SEARCH_CONSOLE_VERIFICATION_PATH = "/google98bd6643f67a7345.html";
const GOOGLE_SEARCH_CONSOLE_VERIFICATION_CONTENT = "google-site-verification: google98bd6643f67a7345.html";
const PUBLIC_ROUTE_INVENTORY = Object.freeze([
  { path: "/", group: "Pagrindas", label: "PioneerHub", title: "PioneerHub — praktiškai apie Pi", description: "Aiškūs lietuviški Pi gidai, saugumo patikra ir skaidrus programėlių atradimas." },
  { path: "/sauga", group: "Sauga", label: "Safety Center", title: "Pi saugumo veiksmai | PioneerHub", description: "Anoniminiai Pi saugumo veiksmai prieš dalijantis passphrase, atidarant nuorodą ar siunčiant Pi." },
  { path: "/sauga/passphrase", group: "Sauga", label: "Wallet passphrase", title: "Pi wallet passphrase: ką daryti? | PioneerHub", description: "Aiškus Pi saugumo veiksmas, kai prašoma wallet passphrase, seed frazės ar privataus rakto." },
  { path: "/sauga/itartina-nuoroda", group: "Sauga", label: "Įtartina Pi nuoroda", title: "Įtartina Pi nuoroda: saugus kitas žingsnis | PioneerHub", description: "Praktinis saugumo planas, kai gauni nepažįstamą Pi nuorodą, programėlę ar formą." },
  { path: "/sauga/pries-siunciant-pi", group: "Sauga", label: "Prieš siunčiant Pi", title: "Prieš siunčiant Pi: saugos patikra | PioneerHub", description: "Trumpa anoniminė sprendimo patikra prieš atidarant wallet ar siunčiant Pi." },
  { path: "/mokykis/pi-network", group: "Mokykis", label: "Pi Network", title: "Pi Network | Mokykis | PioneerHub", description: "Trumpas lietuviškas Pi Network paaiškinimas be kainų ar atlygio pažadų." },
  { path: "/mokykis/balanso-busenos", group: "Mokykis", label: "Balance Dashboard", title: "Balance Dashboard | Mokykis | PioneerHub", description: "Kaip ramiai skaityti Pi balanso būsenas ir jų ribas." },
  { path: "/mokykis/perkeltas-balansas", group: "Mokykis", label: "Migrated Balance", title: "Migrated Balance | Mokykis | PioneerHub", description: "Ką gali reikšti į Mainnet perkeltas Pi balansas." },
  { path: "/mokykis/perkeliamas-balansas", group: "Mokykis", label: "Transferable Balance", title: "Transferable Balance | Mokykis | PioneerHub", description: "Kodėl perkeliamas Pi balansas yra būsena, o ne pažadas." },
  { path: "/mokykis/nepatvirtintas-balansas", group: "Mokykis", label: "Unverified Balance", title: "Unverified Balance | Mokykis | PioneerHub", description: "Ką gali reikšti nepatvirtinta Pi balanso dalis." },
  { path: "/mokykis/mainnet", group: "Mokykis", label: "Mainnet", title: "Pi Mainnet | Mokykis | PioneerHub", description: "Trumpas paaiškinimas, ką Pi Mainnet migracija gali reikšti tavo paskyrai." },
  { path: "/mokykis/pi-wallet", group: "Mokykis", label: "Pi Wallet", title: "Pi Wallet | Mokykis | PioneerHub", description: "Kaip saugiai atidaryti Pi Wallet ir apsaugoti savo passphrase." },
  { path: "/mokykis/kyc", group: "Mokykis", label: "KYC", title: "Pi KYC | Mokykis | PioneerHub", description: "Kodėl Pi KYC veiksmus reikia pradėti tik oficialioje aplinkoje." },
  { path: "/mokykis/mainnet-checklist", group: "Mokykis", label: "Mainnet Checklist", title: "Pi Mainnet Checklist | Mokykis | PioneerHub", description: "Ką ramiai pasitikrinti savo Pi Mainnet Checklist." },
  { path: "/mokykis/lockup", group: "Mokykis", label: "Lockup", title: "Pi Lockup | Mokykis | PioneerHub", description: "Ką Pi lockup gali reikšti prieinamumui ir sprendimams." },
  { path: "/mokykis/referral-team", group: "Mokykis", label: "Referral Team", title: "Pi Referral Team | Mokykis | PioneerHub", description: "Neutralus paaiškinimas apie Pi Referral Team paskyros struktūrą." },
  { path: "/mokykis/security-circle", group: "Mokykis", label: "Security Circle", title: "Pi Security Circle | Mokykis | PioneerHub", description: "Kaip saugiai suprasti Pi Security Circle pasitikėjimo dalį." },
  { path: "/mokykis/kyc-validator", group: "Mokykis", label: "KYC Validator", title: "Pi KYC Validator | Mokykis | PioneerHub", description: "KYC Validator atsakomybės ir privatumo ribos Pi ekosistemoje." },
  { path: "/mokykis/node", group: "Mokykis", label: "Pi Node", title: "Pi Node | Mokykis | PioneerHub", description: "Kam skirtas Pi Node ir nuo ko pradėti techninį dalyvavimą." },
  { path: "/mokykis/pi-browser-apps", group: "Mokykis", label: "Pi Browser ir appsai", title: "Pi Browser ir appsai | Mokykis | PioneerHub", description: "Kaip saugiai pradėti naudoti Pi Browser ir Pi ekosistemos programėles." },
  { path: "/radar/metodika", group: "App Radar", label: "App Radar metodika", title: "App Radar metodika | PioneerHub", description: "Kaip PioneerHub atskiria viešus įrodymus, nepatikrintą informaciją ir peržiūros ribas." },
  { path: "/radar/pi-browser", group: "App Radar", label: "Pi Browser", title: "Pi Browser | App Radar | PioneerHub", description: "Viešų Pi Browser įrodymų, peržiūros ribų ir saugaus kito žingsnio įrašas." },
  { path: "/radar/pi-wallet", group: "App Radar", label: "Pi Wallet", title: "Pi Wallet | App Radar | PioneerHub", description: "Viešų Pi Wallet įrodymų, peržiūros ribų ir saugaus kito žingsnio įrašas." },
  { path: "/radar/fireside-forum", group: "App Radar", label: "Fireside Forum", title: "Fireside Forum | App Radar | PioneerHub", description: "Viešų Fireside Forum įrodymų, peržiūros ribų ir saugaus kito žingsnio įrašas." },
  { path: "/radar/pi-chats", group: "App Radar", label: "Pi Chats", title: "Pi Chats | App Radar | PioneerHub", description: "Viešų Pi Chats įrodymų, peržiūros ribų ir saugaus kito žingsnio įrašas." },
  { path: "/radar/kyc", group: "App Radar", label: "KYC", title: "Pi KYC | App Radar | PioneerHub", description: "Viešų Pi KYC įrodymų, peržiūros ribų ir saugaus kito žingsnio įrašas." },
  { path: "/radar/pi-launchpad", group: "App Radar", label: "Pi Launchpad", title: "Pi Launchpad | App Radar | PioneerHub", description: "Viešų Pi Launchpad įrodymų ir nepatikrintų ribų įrašas." },
  { path: "/radar/cidi-games", group: "App Radar", label: "CiDi Games", title: "CiDi Games | App Radar | PioneerHub", description: "Viešų CiDi Games įrodymų ir nepatikrintų ribų įrašas." },
  { path: "/prisidek", group: "Įrankiai", label: "Prisidėk", title: "Prisidėk | PioneerHub", description: "Paruošk saugų PioneerHub bendruomenės pranešimą tik savo įrenginyje." },
  { path: "/tikrinti-nuoroda", group: "Įrankiai", label: "Pi App Inspector", title: "Pi App Inspector: nuorodos patikra | PioneerHub", description: "Patikrink Pi nuorodos signalus savo naršyklėje, jos niekur neišsiunčiant." },
  { path: "/pervedimo-repeticija", group: "Įrankiai", label: "Pervedimo repeticija", title: "Pi pavedimo repeticija | PioneerHub", description: "Anoniminė Pi pavedimo sprendimo repeticija prieš atidarant wallet." },
  { path: "/kyc-busena", group: "Įrankiai", label: "KYC būsenos navigatorius", title: "Pi KYC būsenos navigatorius | PioneerHub", description: "Anoniminis Pi KYC būsenos klausimų navigatorius ir saugūs kiti žingsniai." },
  { path: "/merchant-readiness", group: "Įrankiai", label: "Merchant Readiness Desk", title: "Merchant Readiness Desk | PioneerHub", description: "Privatus Pi prekybininko veiklos pasirengimo įvertinimas prieš svarstant mokėjimų priėmimą." },
]);
const PUBLIC_ROUTE_METADATA = new Map(PUBLIC_ROUTE_INVENTORY.map(route => [route.path, route]));
const SAFETY_CENTER_ROUTES = new Set(PUBLIC_ROUTE_INVENTORY.filter(route => route.group === "Sauga").map(route => route.path));
const RADAR_ROUTES = new Set(PUBLIC_ROUTE_INVENTORY.filter(route => route.group === "App Radar").map(route => route.path));
const LEARN_ROUTES = new Set(PUBLIC_ROUTE_INVENTORY.filter(route => route.group === "Mokykis").map(route => route.path));
const COMMUNITY_ROUTE = "/prisidek";
const APP_INSPECTOR_ROUTE = "/tikrinti-nuoroda";
const TRANSFER_REHEARSAL_ROUTE = "/pervedimo-repeticija";
const KYC_STATUS_NAVIGATOR_ROUTE = "/kyc-busena";
const MERCHANT_READINESS_ROUTE = "/merchant-readiness";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://pinet.com https://*.pinet.com https://minepi.com https://*.minepi.com; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; upgrade-insecure-requests",
};

const diagnosticContentSecurityPolicy = nonce => securityHeaders["Content-Security-Policy"]
  .replace("script-src 'self';", `script-src 'self' https://sdk.minepi.com 'nonce-${nonce}';`)
  .replace("connect-src 'self';", "connect-src 'self' https://api.minepi.com https://sdk.minepi.com;");

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const canonicalUrl = path => `${CANONICAL_ORIGIN}${path}`;

function publicMetadataHtml(route) {
  const canonical = canonicalUrl(route.path);
  return `<meta name="description" content="${escapeHtml(route.description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(route.title)}"><meta property="og:description" content="${escapeHtml(route.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}">`;
}

function applyPublicMetadata(html, route) {
  let output = html
    .replace(/<html\b[^>]*>/i, '<html lang="lt">')
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:(?:title|description|type|url)["'][^>]*>\s*/gi, '');
  if (!/<title\b/i.test(output)) output = output.replace('</head>', `<title>${escapeHtml(route.title)}</title></head>`);
  return output.replace('</head>', `${publicMetadataHtml(route)}</head>`);
}

function publicRouteIndexHtml() {
  const groups = ["Mokykis", "App Radar"];
  return `<section class="section route-index" aria-labelledby="routeIndexTitle"><p class="eyebrow">NUORODŲ RODYKLĖ</p><h2 id="routeIndexTitle">Rask konkretų gidą arba viešą App Radar įrašą.</h2><p class="route-index-intro">Šios nuorodos yra tiesioginiai PioneerHub puslapiai: jose nurodoma, kas patikrinta, o kas lieka neaišku.</p><div class="route-index-groups">${groups.map(group => `<details${group === "Mokykis" ? " open" : ""}><summary>${group}</summary><ul>${PUBLIC_ROUTE_INVENTORY.filter(route => route.group === group).map(route => `<li><a href="${route.path}">${escapeHtml(route.label)}</a></li>`).join('')}</ul></details>`).join('')}</div></section>`;
}

function robotsTxt() {
  return `User-agent: *\nAllow: /\nDisallow: /diag/\nDisallow: /api/\nDisallow: /events\nDisallow: /signin/\nSitemap: ${canonicalUrl("/sitemap.xml")}\n`;
}

function sitemapXml() {
  const urls = PUBLIC_ROUTE_INVENTORY.map(route => `  <url><loc>${canonicalUrl(route.path)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

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
  <meta name="robots" content="noindex, nofollow, noarchive">
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

function piPaymentChecklistShell(nonce) {
  return `<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>PioneerHub Testnet payment checklist</title>
</head><body><main>
  <h1>Pi Developer Portal payment checklist</h1>
  <p><strong>TESTNET ONLY.</strong> TEST-PI HAS NO REAL VALUE. THIS IS A DEVELOPER PORTAL CONNECTIVITY TEST.</p>
  <p>This isolated technical diagnostic is not a PioneerHub product feature or payment service.</p>
  <button id="run-checklist-payment" type="button" disabled>Run Testnet checklist transaction</button>
  <p id="payment-state" role="status" aria-live="polite">Checking the Testnet-only diagnostic environment…</p>
  <ol id="payment-diagnostic-log" aria-live="polite"></ol>
</main>
<script src="https://sdk.minepi.com/pi-sdk.js"></script><script nonce="${nonce}">
(() => {
  const amount = ${PI_PAYMENT_CHECKLIST_AMOUNT};
  const memo = ${JSON.stringify(PI_PAYMENT_CHECKLIST_MEMO)};
  const metadata = ${JSON.stringify(PI_PAYMENT_CHECKLIST_METADATA)};
  const button = document.querySelector('#run-checklist-payment');
  const state = document.querySelector('#payment-state');
  const log = document.querySelector('#payment-diagnostic-log');
  let authorization = '';
  let busy = false;
  let incompletePayment = null;
  let piInitPromise = null;
  const primaryScopes = ['username', 'payments'];
  const scopeStrategy = 'PRIMARY_USERNAME_PAYMENTS';

  const setState = message => { state.textContent = message; };
  const redact = value => String(value || '').replace(/Bearer\\s+[^\\s,;]+/gi, 'Bearer [REDACTED]').replace(/(access_?token|token|secret|authorization|api_?key|pass(?:phrase)?|wallet|private_?key)=([^\\s&,;]+)/gi, '$1=[REDACTED]').replace(/[A-Za-z0-9_-]{24,}/g, '[REDACTED]').slice(0, 240);
  const render = (marker, detail = '') => { const item = document.createElement('li'); item.textContent = marker + (detail ? ': ' + redact(detail) : ''); log.append(item); };
  const errorDetails = error => JSON.stringify({ name: redact(error?.name), message: redact(error?.message || error), constructor: redact(error?.constructor?.name), type: typeof error });
  const authCode = error => {
    const message = String(error?.message || error || '').toLowerCase();
    if (/failed to check previous consent scopes/.test(message)) return 'AUTH_PI_CONSENT_SCOPE_FAILED';
    if (/scope|permission/.test(message)) return 'AUTH_PI_PRIMARY_FAILED';
    if (/denied|cancelled|canceled|declined/.test(message)) return 'AUTH_PI_PRIMARY_FAILED';
    if (/not.initiali[sz]ed|call init|initiali[sz]ation/.test(message)) return 'AUTH_PI_INIT_FAILED';
    return 'AUTH_PI_PRIMARY_FAILED';
  };
  const initPi = () => {
    if (!piInitPromise) piInitPromise = (async () => {
      render('PI_INIT_ENTERED');
      if (typeof Pi === 'undefined') throw new Error('pi_sdk_missing');
      await Pi.init({ version: "2.0" });
      render('PI_INIT_RESOLVED');
      return Pi;
    })().catch(error => { piInitPromise = null; render('PI_INIT_REJECTED', errorDetails(error)); throw error; });
    return piInitPromise;
  };
  const paymentIdOf = payment => typeof payment?.identifier === 'string' && /^[A-Za-z0-9_-]{1,160}$/.test(payment.identifier) ? payment.identifier : '';
  const txidOf = payment => {
    const txid = payment?.transaction?.txid;
    return typeof txid === 'string' && /^[A-Za-z0-9_-]{1,240}$/.test(txid) ? txid : '';
  };
  async function serverPayment(paymentId, action, txid) {
    const response = await fetch('/api/pi/payments/' + encodeURIComponent(paymentId) + '/' + action, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authorization },
      body: JSON.stringify(action === 'complete' ? { txid } : {}),
    });
    if (!response.ok) throw new Error('server_' + action + '_failed');
    const result = await response.json();
    if (result?.state !== (action === 'approve' ? 'approved' : 'completed')) throw new Error('server_' + action + '_rejected');
    return result;
  }
  async function authenticate() {
    const pi = await initPi();
    render('AUTH_SCOPE_STRATEGY', scopeStrategy);
    render('AUTH_SCOPES', JSON.stringify(primaryScopes));
    render('PI_AUTHENTICATE_ENTERED');
    let promise;
    try { promise = pi.authenticate(['username', 'payments'], onIncompletePaymentFound); render('PI_AUTHENTICATE_PROMISE_CREATED'); }
    catch (error) { render('PI_AUTHENTICATE_REJECTED', errorDetails(error)); throw Object.assign(new Error(authCode(error)), { cause: error }); }
    let result;
    try { result = await promise; }
    catch (error) { render('PI_AUTHENTICATE_REJECTED', errorDetails(error)); throw Object.assign(new Error(authCode(error)), { cause: error }); }
    render('PI_AUTHENTICATE_RESOLVED', JSON.stringify({ accessTokenExists: Boolean(result?.accessToken), userExists: Boolean(result?.user), uidExists: Boolean(result?.user?.uid) }));
    if (typeof result?.accessToken !== 'string' || !result.accessToken) throw new Error('AUTH_ACCESS_TOKEN_MISSING');
    render('AUTH_SERVER_VERIFY_ENTERED');
    let response;
    try { response = await fetch('/api/pi/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessToken: result.accessToken }) }); }
    catch { throw new Error('AUTH_SERVER_VERIFY_FAILED'); }
    const session = await response.json().catch(() => ({}));
    if (!response.ok) {
      const code = session?.code;
      render('AUTH_SERVER_REJECTED', JSON.stringify({ status: response.status, code }));
      throw new Error(code === 'AUTH-ME-VERIFY' || code === 'AUTH-NETWORK' ? 'AUTH_SERVER_VERIFY_FAILED' : 'AUTH_SERVER_SESSION_FAILED');
    }
    if (!session?.authenticated || typeof session.authorization !== 'string') throw new Error('AUTH_SERVER_SESSION_FAILED');
    render('AUTH_SERVER_SESSION_CREATED');
    authorization = session.authorization;
  }
  async function recoverIncomplete(payment) {
    const paymentId = paymentIdOf(payment);
    const txid = txidOf(payment);
    incompletePayment = payment;
    button.disabled = true;
    if (!paymentId || !txid || !authorization) { setState('An incomplete Testnet payment was found. No new payment will be created; complete or cancel it in Pi Wallet, then reload this diagnostic.'); return; }
    try {
      setState('Recovering the existing Testnet payment through server completion…');
      await serverPayment(paymentId, 'complete', txid);
      setState('SUCCESS: the existing Testnet payment was completed by PioneerHub server. Revisit Developer Portal to confirm the checklist item.');
    } catch { setState('An incomplete Testnet payment was found, but server completion is not yet confirmed. No new payment will be created.'); }
  }
  function onIncompletePaymentFound(payment) {
    render('INCOMPLETE_PAYMENT_CALLBACK', JSON.stringify({ paymentPresent: Boolean(payment), transactionPresent: Boolean(payment?.transaction) }));
    incompletePayment = payment || {};
    button.disabled = true;
    if (authorization) void recoverIncomplete(incompletePayment);
    else setState('An incomplete Testnet payment was found. PioneerHub will check whether it can safely complete it after authentication; no new payment will be created.');
  }
  async function run() {
    if (busy || incompletePayment) return;
    busy = true; button.disabled = true;
    try {
      render('RUNTIME_CONTEXT', JSON.stringify({ origin: location.origin, href: location.href, referrer: document.referrer, userAgent: navigator.userAgent, isTopLevel: window.top === window.self, sdkPresent: typeof Pi !== 'undefined' }));
      setState('Authenticating for the Testnet payment scope…');
      await authenticate();
      if (incompletePayment) { await recoverIncomplete(incompletePayment); return; }
      const callbacks = {
        onReadyForServerApproval: async paymentId => {
          setState('Waiting for PioneerHub server approval…');
          await serverPayment(paymentId, 'approve');
          setState('Server approval complete. Confirm the Test-Pi transaction in Pi Wallet.');
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          setState('Confirming the submitted Testnet transaction with PioneerHub server…');
          await serverPayment(paymentId, 'complete', txid);
          setState('SUCCESS: PioneerHub server completed the Testnet transaction. Revisit Developer Portal to confirm the checklist item.');
        },
        onCancel: () => { setState('Testnet payment cancelled. No transaction was completed.'); },
        onError: error => { setState('Testnet payment error: ' + redact(error?.message || error)); },
      };
      setState('Opening the Testnet payment screen…');
      await Pi.createPayment({ amount, memo, metadata }, callbacks);
    } catch (error) {
      const code = /^AUTH_(?:PI_INIT_FAILED|PI_PRIMARY_FAILED|PI_CONSENT_SCOPE_FAILED|ACCESS_TOKEN_MISSING|SERVER_VERIFY_FAILED|SERVER_SESSION_FAILED)$/.test(error?.message) ? error.message : 'AUTH_PI_PRIMARY_FAILED';
      render('AUTH_FAILURE_CODE', code);
      setState('Testnet checklist transaction did not start. Diagnostic code: ' + code + '. Scope strategy: ' + scopeStrategy + '. Pi message: ' + redact(error?.cause?.message || error?.message || error) + '.');
    }
    finally { busy = false; if (!incompletePayment) button.disabled = false; }
  }
  render('PAGE_READY');
  render('SDK_PRESENT', String(typeof Pi !== 'undefined'));
  if (typeof Pi === 'undefined') setState('Pi SDK is unavailable. Open this URL inside Pi Browser.');
  else { button.disabled = false; setState('Ready. Pi SDK initialization and authentication begin only after you press the button.'); }
  button.addEventListener('click', run);
})();
</script></body></html>`;
}

function piSignInDiagnosticShell(nonce) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow, noarchive"><title>Pi Sign-In Isolation Harness</title></head>
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
  if (url.pathname === "/robots.txt" && request.method === "GET") {
    return new Response(robotsTxt(), { headers: { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
  }
  if (url.pathname === "/sitemap.xml" && request.method === "GET") {
    return new Response(sitemapXml(), { headers: { ...securityHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
  }
  if (url.pathname === GOOGLE_SEARCH_CONSOLE_VERIFICATION_PATH && request.method === "GET") {
    return new Response(GOOGLE_SEARCH_CONSOLE_VERIFICATION_CONTENT, { headers: { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
  }
  if (url.pathname === PI_PAYMENT_CHECKLIST_PATH && request.method === "GET") {
    if (env.PI_NETWORK !== "testnet" || !env.PI_TESTNET_API_KEY || !env.PI_SESSION_SECRET || !env.PAYMENT_LEDGER || !env.AUTH_SESSIONS) return json({ error: "testnet_configuration_required" }, 503);
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const contentSecurityPolicy = diagnosticContentSecurityPolicy(nonce);
    return new Response(piPaymentChecklistShell(nonce), {
      headers: { ...securityHeaders, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive", "Content-Security-Policy": contentSecurityPolicy },
    });
  }
  if (url.pathname === PI_AUTH_DIAGNOSTIC_PATH && request.method === "GET") {
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const contentSecurityPolicy = diagnosticContentSecurityPolicy(nonce);
    return new Response(piAuthDiagnosticShell(nonce), {
      headers: {
        ...securityHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": contentSecurityPolicy,
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }
  if (url.pathname === PI_SIGNIN_DIAGNOSTIC_PATH && request.method === "GET") {
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const contentSecurityPolicy = diagnosticContentSecurityPolicy(nonce);
    return new Response(piSignInDiagnosticShell(nonce), {
      headers: { ...securityHeaders, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Content-Security-Policy": contentSecurityPolicy, "X-Robots-Tag": "noindex, nofollow, noarchive" },
    });
  }
  if (url.pathname === "/events" && request.method === "POST") {
    const event = (await request.text()).trim();
    const allowed = new Set(["learn_article_open", "safety_check_start", "safety_check_complete", "scam_shield_start", "scam_shield_complete", "app_radar_view", "app_open_external", "report_scam", "suggest_app", "community_cta", "transfer_rehearsal_start", "transfer_rehearsal_complete", "merchant_readiness_start", "merchant_readiness_complete", "merchant_rehearsal_complete", "payment_lab_start", "payment_lab_complete", "pi_auth_start", "pi_auth_complete", "pi_incomplete_payment_callback", "testnet_payment_start", "testnet_payment_complete"]);
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
    try {
      const token = await authorization(env.PI_SESSION_SECRET);
      const stub = env.AUTH_SESSIONS.get(env.AUTH_SESSIONS.idFromName(await sessionKey(token, env.PI_SESSION_SECRET)));
      const stored = await stub.fetch("https://session.internal/", { method: "POST", body: JSON.stringify({ uid: identity.uid, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }) });
      if (!stored.ok) return json({ code: "AUTH-SESSION" }, 503);
      return json({ authenticated: true, authorization: token, expiresIn: SESSION_TTL_SECONDS });
    } catch { return json({ code: "AUTH-SESSION" }, 503); }
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
  const isMerchantReadinessRoute = url.pathname === MERCHANT_READINESS_ROUTE;
  const assetRequest = isSignInCallback
    ? new Request(new URL("/", request.url), request)
    : isSafetyCenterRoute ? new Request(new URL("/safety-center-shell.txt", request.url), request)
      : isRadarRoute ? new Request(new URL("/radar-shell.txt", request.url), request)
        : isLearnRoute ? new Request(new URL("/learn-shell.txt", request.url), request)
          : isCommunityRoute ? new Request(new URL("/community-shell.txt", request.url), request)
            : isAppInspectorRoute ? new Request(new URL("/app-inspector-shell.txt", request.url), request)
              : isTransferRehearsalRoute ? new Request(new URL("/transfer-rehearsal-shell.txt", request.url), request)
                : isKycStatusNavigatorRoute ? new Request(new URL("/kyc-status-navigator-shell.txt", request.url), request)
                  : isMerchantReadinessRoute ? new Request(new URL("/merchant-readiness-shell.txt", request.url), request)
                    : request;
  const response = await env.ASSETS.fetch(assetRequest);
  const headers = new Headers(response.headers);
  if (isSafetyCenterRoute || isRadarRoute || isLearnRoute || isCommunityRoute || isAppInspectorRoute || isTransferRehearsalRoute || isKycStatusNavigatorRoute || isMerchantReadinessRoute) headers.set("Content-Type", "text/html; charset=utf-8");
  Object.entries(securityHeaders).forEach(([key, value]) => headers.set(key, value)); headers.delete("X-Frame-Options");
  const isShell = isSafetyCenterRoute || isRadarRoute || isLearnRoute || isCommunityRoute || isAppInspectorRoute || isTransferRehearsalRoute || isKycStatusNavigatorRoute || isMerchantReadinessRoute || response.headers.get("Content-Type")?.includes("text/html");
  const isVersionedAsset = url.searchParams.get("v") === FRONTEND_BUILD && url.pathname.match(/\.(?:css|js)$/);
  headers.set("Cache-Control", isShell ? "no-store" : isVersionedAsset ? "public, max-age=31536000, immutable" : response.status === 200 && url.pathname.match(/\.(?:css|png|jpg|svg|woff2)$/) ? "public, max-age=86400" : "no-cache");
  if (env.APP_ENV !== "production" || isSignInCallback) headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (isShell) {
    const version = `?v=${FRONTEND_BUILD}`;
    const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
    const shellStatus = `<!-- PioneerHub build: ${FRONTEND_BUILD}; technical status is available through /healthz and diagnostic routes. -->`;
    if (isSignInCallback) headers.set("Content-Security-Policy", diagnosticContentSecurityPolicy(nonce));
    let html = (await response.text())
      .replaceAll('href="styles.css"', `href="/styles.css${version}"`)
      .replaceAll('href="safety-center.css"', `href="/safety-center.css${version}"`)
      .replaceAll('src="safety-center.js"', `src="/safety-center.js${version}"`)
      .replaceAll('href="shield.css"', `href="/shield.css${version}"`)
      .replaceAll('href="brand.css"', `href="/brand.css${version}"`)
      .replaceAll('src="evidence-v1.js"', `src="/evidence-v1.js${version}"`)
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
      .replaceAll('href="merchant-readiness.css"', `href="/merchant-readiness.css${version}"`)
      .replaceAll('src="merchant-readiness.js"', `src="/merchant-readiness.js${version}"`)
      .replaceAll('src="app.js"', isSignInCallback ? 'type="application/pioneerhub-product-app" data-pioneerhub-product-app' : `src="/app.js${version}"`)
      .replaceAll("REQUIRES PI DEVELOPER PORTAL CONFIGURATION", "TESTNET INTEGRATION ACTIVE — AUTH TESTING")
      .replace("PioneerHub dar nejungia Pi prisijungimo ar realiu mokejimu.", "Pi Developer Portal, domain verification, PiNet ir serverio Testnet raktas yra sukonfiguruoti. Mokėjimas lieka užrakintas iki patikrinto prisijungimo.")
      .replace("Pi loginas nėra aktyvus", "Pi loginas tikrinamas Testnet aplinkoje")
      .replace("Testnet mokėjimas dar nevykdomas", "Testnet mokėjimas užrakintas iki patikrinto prisijungimo")
      .replace("</section>\n<section id=\"community\"", `${shellStatus}</section>\n<section id="community"`)
      .replace("</body>", isSignInCallback ? `${piSignInCallbackBootstrap(nonce, version)}</body>` : "</body>");
    const route = PUBLIC_ROUTE_METADATA.get(url.pathname);
    if (route) {
      html = applyPublicMetadata(html, route);
      if (url.pathname === "/") html = html.replace("</main>", `${publicRouteIndexHtml()}</main>`);
    }
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
} };
