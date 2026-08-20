const FRONTEND_BUILD = 'p0-ui-recovery-v1';
// OAuth uses the least-privileged scope; Pi Browser requires payments scope for native app auth.
const NATIVE_PI_AUTH_SCOPES = ['username', 'payments'];
let piInitPromise = null;

const topics = [
  ['Pi Network', 'Kas tai yra ir ko jis nezada.', 'Pradzia'],
  ['Balance Dashboard', 'Kaip skaityti balansu busenas.', 'Balansas'],
  ['Migrated Balance', 'Kas jau perkelta i Mainnet.', 'Balansas'],
  ['Transferable Balance', 'Kodel tai yra ivertis, ne pazadas.', 'Balansas'],
  ['Unverified Balance', 'Ka gali reiksti nepatvirtinta dalis.', 'Balansas'],
  ['Mainnet', 'Ka keicia migracija.', 'Mainnet'],
  ['Pi Wallet', 'Kur saugiai ji atidaryti.', 'Wallet'],
  ['Wallet passphrase', 'Vienas dalykas, kurio niekam neduodi.', 'Sauga'],
  ['KYC', 'Kodel naudok tik oficialia aplinka.', 'KYC'],
  ['Mainnet Checklist', 'Ka pasitikrinti ramiai.', 'Mainnet'],
  ['Lockup', 'Ka reiskia ribotas prieinamumas.', 'Balansas'],
  ['Referral Team', 'Ka reiskia komandos struktura.', 'Paskyra'],
  ['Security Circle', 'Kaip veikia socialinio pasitikejimo dalis.', 'Paskyra'],
  ['KYC Validator', 'Atsakomybe ir privatumas.', 'KYC'],
  ['Node', 'Kam skirtas techninis dalyvavimas.', 'Technika'],
  ['Pi pavedimas', 'Gavejas, suma ir galutinis patvirtinimas.', 'Mokejimai'],
  ['Pi Browser ir appsai', 'Kaip pradeti saugiai.', 'Appsai'],
  ['Dazni scamai', 'Signalai, del kuriu reikia sustoti.', 'Sauga'],
];
const safetyGuideLinks = {
  'Wallet passphrase': '/sauga/passphrase',
  'Pi pavedimas': '/sauga/pries-siunciant-pi',
  'Dazni scamai': '/sauga/itartina-nuoroda',
};

const checks = [
  'Ar tikrai zinau gaveja?',
  'Ar adresa gavau patikimu kanalu?',
  'Ar niekas neprase passphrase ar "KYC mokescio"?',
  'Ar nera garantuotos grazos ar spaudimo skubeti?',
  'Ar pries patvirtinima patikrinau suma ir paskirti?',
  'Ar appas arba adresas yra oficialus ar mano patikrintas?',
];

const shieldAdvice = {
  critical: ['STOP: matomi kritiniai scam signalai.', 'Nieko nevesk ir nieko nesiųsk. Passphrase, seed frazės ar privataus rakto neprašo nei saugi piniginė, nei teisėtas support. Uždaryk gautą nuorodą ir oficialų Pi puslapį atsidaryk pats.'],
  high: ['SUSTOK IR PATIKRINK: rizika didelė.', 'Nespausk gautos nuorodos ir nepervesk Pi. Patikrink adresą iš oficialaus Pi šaltinio, o ne iš žinutės. Garantijos, spaudimas ir apsimetinėjimas nėra patikimumo įrodymai.'],
  caution: ['Dar nėra pakankamai duomenų pasitikėti.', 'Nepažymėtas signalas nėra saugumo patvirtinimas. Patikrink gavėją, sumą, paskirtį ir oficialų domeną savarankiškai prieš bet kokį veiksmą.'],
};

const integrationSources = [
  {
    title: 'Pi access token verification',
    url: 'https://pi-apps.github.io/community-developer-guide/docs/importantTopics/accessToken/',
  },
  {
    title: 'Pi SDK authentication basics',
    url: 'https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformSDK/',
  },
  {
    title: 'Pi payment flow',
    url: 'https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/',
  },
  {
    title: 'Developer Portal checklist',
    url: 'https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/quickStart/',
  },
];

const radarEntries = [
  {
    name: 'Pi Browser',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'NOT YET TESTED',
    network: 'Pi ecosystem',
    operator: 'Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-08-16 review',
    summary: 'Oficialus Pi Browser atsisiuntimo ir pradzios taskas. PioneerHub dar neatliko vidinio produkto testo.',
    sourceLabel: 'Pi Browser',
    sourceUrl: 'https://minepi.com/pi-browser/',
    testedFunction: 'Tik oficialaus saltinio pasiekiamumas.',
    authRequested: 'Netestuota. Reiketu mobilios Pi Browser aplinkos.',
    paymentBehavior: 'Netestuota.',
    securityNotes: 'Oficialus pirminis saltinis gyvas. Tai nera PioneerHub saugos garantija.',
    returnValue: 'Pagrindinis vartas i Pi appsus.',
    verdict: 'Netestuota kaip produktas. Kol kas tik oficialaus saltinio nuoroda.',
  },
  {
    name: 'Pi Wallet',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    network: 'Mainnet / ecosystem access point',
    operator: 'Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-08-16 review',
    summary: 'Atliktas ribotas techninis patikrinimas: oficiali nuoroda ir gyvas wallet.pinet.com pasiekiamumas. Prisijungimo ir sandorio testas neatliktas.',
    sourceLabel: 'Pi Safety',
    sourceUrl: 'https://minepi.com/safety/',
    testedFunction: 'Discover + official URL confirmation + public reachability.',
    authRequested: 'Pi Browser arba wallet session reikalinga, todel nebandyta.',
    paymentBehavior: 'Netestuota. Jokiu pavedimu neatlikta.',
    securityNotes: 'Pi Safety nurodo, kad passphrase turi buti vedama tik wallet.pinet.com.',
    returnValue: 'Esminis pinigines ieigos taskas, bet funkcijos patogumas neivertintas.',
    verdict: 'Ribotas techninis patikrinimas. Be pilno funkcijos ar saugos verdikto.',
    steps: [
      ['DISCOVER', 'PASS', 'Pi Safety puslapis siuo metu nurodo wallet.pinet.com kaip oficialu adresa.'],
      ['OPEN', 'PASS', '2026-08-16 wallet.pinet.com grazino HTTP 200 ir gyva Pi paslauga.'],
      ['AUTH', 'BLOCKED', 'Reiketu Pi Browser konteksto arba paskyros sesijos.'],
      ['CORE FUNCTION', 'NOT TESTED', 'Balanso, pavedimu ar wallet vidaus logikos netikrinome.'],
      ['PAYMENT', 'NOT TESTED', 'Realiu Pi veiksmu neatlikta.'],
      ['SECURITY', 'PASS', 'Oficialus saltinis aiskiai nurodo, kad passphrase reikia vesti tik wallet.pinet.com.'],
      ['UX', 'PARTIAL', 'Viešas pasiekiamumas geras, bet in-app UX neivertintas.'],
      ['RETURN VALUE', 'PARTIAL', 'Aisku, kam skirtas ieigos taskas, bet reali nauda nepatikrinta sesijoje.'],
    ],
  },
  {
    name: 'Fireside Forum',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    network: 'Pi ecosystem social',
    operator: 'Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-08-16 review',
    summary: 'Ribotas techninis patikrinimas patvirtino oficialu adresa ir gyva paslaugos pasiekiamuma. Prisijungimas ir veikla forumo viduje nebandyti.',
    sourceLabel: 'Pi Safety',
    sourceUrl: 'https://minepi.com/safety/',
    testedFunction: 'Discover + official URL confirmation + public reachability.',
    authRequested: 'Tikriausiai reikalinga Pi sesija, todel nebandyta.',
    paymentBehavior: 'Neaktualu siame teste.',
    securityNotes: 'Oficialus URL yra fireside.pinet.com. Tai nera turinio kokybes ar moderavimo vertinimas.',
    returnValue: 'Aiskus oficialus bendruomenes ieigos taskas.',
    verdict: 'Ribotas techninis patikrinimas. Nera PioneerHub rekomendacijos ar saugos garantijos.',
    steps: [
      ['DISCOVER', 'PASS', 'Pi Safety puslapis siuo metu nurodo fireside.pinet.com kaip oficialu adresa.'],
      ['OPEN', 'PASS', '2026-08-16 fireside.pinet.com grazino HTTP 200.'],
      ['AUTH', 'BLOCKED', 'Nebandyta be Pi sesijos.'],
      ['CORE FUNCTION', 'NOT TESTED', 'Forumo skaitymo, rasymo ar moderavimo mechanikos netikrinome.'],
      ['PAYMENT', 'NOT APPLICABLE', 'Mokejimo testas siuo atveju netaikytas.'],
      ['SECURITY', 'PARTIAL', 'Patvirtintas oficialus domenas, bet ne visa produkto rizika.'],
      ['UX', 'PARTIAL', 'Vertintas tik techninis pasiekiamumas.'],
      ['RETURN VALUE', 'PARTIAL', 'Paskirtis aiski, realus grizimo motyvas dar netestuotas.'],
    ],
  },
  {
    name: 'Pi Chats',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    network: 'Pi ecosystem social',
    operator: 'Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-08-16 review',
    summary: 'Ribotas techninis patikrinimas patvirtino oficialu adresa ir gyva chat.pinet.com pasiekiamuma. Tikras chat funkcionalumas nevertintas.',
    sourceLabel: 'Pi Safety',
    sourceUrl: 'https://minepi.com/safety/',
    testedFunction: 'Discover + official URL confirmation + public reachability.',
    authRequested: 'Tikėtina reikalinga Pi sesija, todel nebandyta.',
    paymentBehavior: 'Neaktualu siame teste.',
    securityNotes: 'Oficialus domenas patvirtintas. Tai ne turinio saugos ar apsimetinejimo rizikos isemimas.',
    returnValue: 'Aiskus oficialus pokalbiu ieigos taskas.',
    verdict: 'Ribotas techninis patikrinimas. Be platesnio UX ar privatumo verdikto.',
    steps: [
      ['DISCOVER', 'PASS', 'Pi Safety puslapis siuo metu nurodo chat.pinet.com kaip oficialu adresa.'],
      ['OPEN', 'PASS', '2026-08-16 chat.pinet.com grazino HTTP 200.'],
      ['AUTH', 'BLOCKED', 'Nebandyta be Pi sesijos.'],
      ['CORE FUNCTION', 'NOT TESTED', 'Ziureti zinuciu ar siusti zinuciu nebandyta.'],
      ['PAYMENT', 'NOT APPLICABLE', 'Mokejimo testas netaikytas.'],
      ['SECURITY', 'PARTIAL', 'Patvirtintas oficialus domenas, bet ne visa produkto rizika.'],
      ['UX', 'PARTIAL', 'Vertintas tik pasiekiamumas.'],
      ['RETURN VALUE', 'PARTIAL', 'Funkcijos tikslas suprantamas, naudojimo verte nepatvirtinta.'],
    ],
  },
  {
    name: 'KYC',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'PIONEERHUB TESTED',
    network: 'Pi identity / KYC',
    operator: 'Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-08-16 review',
    summary: 'Ribotas techninis patikrinimas patvirtino oficialu KYC adresa ir gyva pasiekiamuma. Jokiu asmens duomenu neivedeme ir jokio KYC proceso nepradejome.',
    sourceLabel: 'Pi Safety',
    sourceUrl: 'https://minepi.com/safety/',
    testedFunction: 'Discover + official URL confirmation + public reachability.',
    authRequested: 'KYC srautas gali reikalauti Pi paskyros ir asmens duomenu, todel nebandyta.',
    paymentBehavior: 'Neaktualu siame teste.',
    securityNotes: 'KYC turi buti naudojamas tik oficialioje Pi aplinkoje pagal Pi Safety.',
    returnValue: 'Svarbus oficialus KYC ieigos taskas, bet neivertintas kaip procesas.',
    verdict: 'Ribotas techninis patikrinimas. Jokio KYC kokybes ar sekmes verdikto.',
    steps: [
      ['DISCOVER', 'PASS', 'Pi Safety puslapis siuo metu nurodo kyc.pinet.com kaip oficialu adresa.'],
      ['OPEN', 'PASS', '2026-08-16 kyc.pinet.com grazino HTTP 200.'],
      ['AUTH', 'BLOCKED', 'Nepradetas del privatumo ir paskyros reikalavimu.'],
      ['CORE FUNCTION', 'NOT TESTED', 'KYC formu ar dokumentu proceso netikrinome.'],
      ['PAYMENT', 'NOT APPLICABLE', 'Mokejimo testas netaikytas.'],
      ['SECURITY', 'PARTIAL', 'Patvirtintas oficialus URL, bet procesines rizikos nevertintos.'],
      ['UX', 'PARTIAL', 'Vertintas tik pasiekiamumas.'],
      ['RETURN VALUE', 'PARTIAL', 'Paskirtis aiski, bet reali eiga nera PioneerHub ivertinta.'],
    ],
  },
  {
    name: 'Pi Launchpad',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'NOT YET TESTED',
    network: 'Testnet first',
    operator: 'Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-03-14 source / 2026-08-16 review',
    summary: 'Pi Day 2026 saltinis nurodo, kad Pi Launchpad paleistas Testnet aplinkoje ir pasiekiamas per Pi Browser. PioneerHub dar neatliko saugaus produkto testo.',
    sourceLabel: 'Pi Day 2026',
    sourceUrl: 'https://minepi.com/blog/pi-day-2026/',
    testedFunction: 'Pirminio saltinio ir Testnet framing perziura.',
    authRequested: 'Netestuota.',
    paymentBehavior: 'Saltinis mini Testnet-first paleidima. Jokiu veiksmu neatlikta.',
    securityNotes: 'Testnet pobudis svarbus. Tai dar nera PioneerHub review.',
    returnValue: 'Galimas ateities Payment Lab mokymosi taskas.',
    verdict: 'Netestuota. Kol kas tik oficialus saltinis ir Testnet kontekstas.',
  },
  {
    name: 'CiDi Games',
    type: 'OFFICIAL / ECOSYSTEM RESOURCE',
    testState: 'NOT YET TESTED',
    network: 'Pi ecosystem app',
    operator: 'CiDi Games / referenced by Pi Network',
    lastChecked: '2026-08-16',
    sourceDate: '2026-05-28 source / 2026-08-16 review',
    summary: 'Pi Network paskelbe CiDi Games beta paleidima Pi Browser aplinkoje. PioneerHub dar neatliko savarankisko app atidarymo, auth ar saugos testo.',
    sourceLabel: 'CiDi Games Beta App',
    sourceUrl: 'https://minepi.com/announcement/cidi-games-beta/',
    testedFunction: 'Pirminio oficialaus paskelbimo patikra.',
    authRequested: 'Netestuota.',
    paymentBehavior: 'Saltinis mini Pi integracija, bet jokiu mokamu veiksmu neatlikta.',
    securityNotes: 'Oficiali Pi nuoroda irodo egzistavima, bet ne kokybe ar sauga.',
    returnValue: 'Perspektyvus kandidatas pilnesniam PioneerHub testui velesniame etape.',
    verdict: 'Not yet tested. Jokio PioneerHub balo ar rekomendacijos.',
  },
];

function track(eventName) {
  if (navigator.sendBeacon) navigator.sendBeacon('/events', eventName);
}

function renderLearn(query = '') {
  const cards = document.querySelector('#learnCards');
  if (window.PioneerLearn?.renderHome) { window.PioneerLearn.renderHome(cards, query, track); return; }
  if (cards && !cards.dataset.learnV2Loading) {
    cards.dataset.learnV2Loading = 'true';
    cards.innerHTML = '<p>Įkeliame pilnus gidus…</p>';
    const script = document.createElement('script');
    script.src = '/learn-v2.js?v=learn-v2';
    script.onload = () => renderLearn(query);
    script.onerror = () => { cards.textContent = 'Gidai šiuo metu nepasiekiami.'; };
    document.head.append(script);
  }
  if (!window.PioneerLearn) return;
  const filtered = topics.filter((topic) => topic.join(' ').toLowerCase().includes(query.toLowerCase()));

  cards.innerHTML = filtered.map(([title, description, category]) => `
    <article>
      <span>${category}</span>
      <h3>${title}</h3>
      <p>${description}</p>
      ${safetyGuideLinks[title] ? `<a class="text-link" href="${safetyGuideLinks[title]}">Atidaryti saugos gidą →</a>` : `<button data-topic="${title}">Skaityti santrauka</button>`}
    </article>
  `).join('');

  cards.querySelectorAll('button').forEach((button) => {
    button.onclick = () => {
      alert(`${button.dataset.topic}: sis trumpas gidas bus pleciamas tik is oficialiu saltiniu. Pirmas veiksmas: neskubek ir nesidalink wallet passphrase.`);
    };
  });
}

function renderSafety() {
  const list = document.querySelector('#checklist');
  if (!list) return;
  list.innerHTML = checks.map((check, index) => `
    <label>
      <input type="checkbox" data-check="${index}">
      <span>${check}</span>
    </label>
  `).join('');

  list.onchange = () => {
    const completed = list.querySelectorAll(':checked').length;
    document.querySelector('#safetyResult').textContent = completed === checks.length
      ? 'Gerai: viska patikrinai. Vis tiek perskaityk patvirtinima pries siusdamas.'
      : `Patikrinta ${completed}/${checks.length}. Sustok, kol neatsakai i visus klausimus.`;
  };

  list.addEventListener('change', () => {
    const completed = list.querySelectorAll(':checked').length;
    if (completed === 1) track('safety_check_start');
    if (completed === checks.length) track('safety_check_complete');
  });
}

function bindScamShield() {
  const form = document.querySelector('#shieldForm');
  const result = document.querySelector('#shieldResult');
  let started = false;

  form?.addEventListener('change', () => {
    if (!started) {
      started = true;
      track('scam_shield_start');
    }
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const signals = new Set(new FormData(form).getAll('signal'));
    const level = signals.has('passphrase') || signals.has('payment') ? 'critical' : signals.size > 0 ? 'high' : 'caution';
    const [title, body] = shieldAdvice[level];
    result.className = `shield-result ${level}`;
    const next = level === 'critical' ? ['/sauga/passphrase', 'STOP: nevesk passphrase ir nesiųsk Pi.'] : level === 'high' ? ['/sauga/itartina-nuoroda', 'PAUSE: patikrink savarankiškai, ne per gautą nuorodą.'] : ['/sauga/pries-siunciant-pi', 'VERIFY: prieš veikdamas atlik 30 sekundžių patikrą.'];
    result.innerHTML = `<strong>${title}</strong><p>${body}</p><p><strong>${next[1]}</strong></p><a class="text-link" href="${next[0]}#${level}">Atidaryti aiškų veiksmų planą →</a><br><a class="text-link" href="https://minepi.com/safety/" target="_blank" rel="noreferrer">Atidaryti Pi Safety šaltinį ↗</a>`;
    result.hidden = false;
    track('scam_shield_complete');
  });
  form?.addEventListener('reset', () => {
    started = false;
    result.hidden = true;
    result.textContent = '';
  });
}

function renderRadar() {
  if (window.PioneerRadar?.renderHome) {
    window.PioneerRadar.renderHome(document.querySelector('#radar .radar'), track);
    return;
  }
  const root = document.querySelector('#radar .radar');
  if (root && !root.dataset.radarV2Loading) {
    root.dataset.radarV2Loading = 'true';
    root.innerHTML = '<p>Įkeliame App Radar…</p>';
    const script = document.createElement('script');
    script.src = '/radar-v2.js?v=app-radar-v2';
    script.onload = () => renderRadar();
    script.onerror = () => { root.textContent = 'App Radar šiuo metu nepasiekiamas.'; };
    document.head.append(script);
  }
  if (!window.PioneerRadar) return;

  root.innerHTML = radarEntries.map((entry) => {
    const testClass = entry.testState === 'PIONEERHUB TESTED' ? 'tested' : 'not-tested';
    const steps = entry.steps ? `
      <div class="test-record">
        <p><strong>Test record:</strong> ${entry.lastChecked}</p>
        <ul>
          ${entry.steps.map(([step, state, detail]) => `<li><strong>${step}</strong> · ${state} · ${detail}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <article>
        <div class="badges">
          <span class="badge resource">${entry.type}</span>
          <span class="badge ${testClass}">${entry.testState}</span>
        </div>
        <h3>${entry.name}</h3>
        <p>${entry.summary}</p>
        <dl class="radar-meta">
          <div><dt>Operatorius</dt><dd>${entry.operator}</dd></div>
          <div><dt>Tinklas</dt><dd>${entry.network}</dd></div>
          <div><dt>Tikrinta</dt><dd>${entry.lastChecked}</dd></div>
          <div><dt>Saltinio data</dt><dd>${entry.sourceDate}</dd></div>
          <div><dt>Kas realiai patikrinta</dt><dd>${entry.testedFunction}</dd></div>
          <div><dt>Auth</dt><dd>${entry.authRequested}</dd></div>
          <div><dt>Pi mokejimai</dt><dd>${entry.paymentBehavior}</dd></div>
          <div><dt>Saugos pastaba</dt><dd>${entry.securityNotes}</dd></div>
          <div><dt>Grizimo verte</dt><dd>${entry.returnValue}</dd></div>
          <div><dt>PioneerHub isvada</dt><dd>${entry.verdict}</dd></div>
        </dl>
        ${steps}
        <a href="${entry.sourceUrl}" target="_blank" rel="noreferrer">Pirminis saltinis: ${entry.sourceLabel} ↗</a>
      </article>
    `;
  }).join('');

  root.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => track('app_open_external'));
  });
}

async function request(path, body, authorization) {
  const headers = { 'Content-Type': 'application/json' };
  if (authorization) headers.Authorization = `Bearer ${authorization}`;
  const response = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body || {}) });
  if (!response.ok) { const result = await response.json().catch(() => ({})); throw new Error(result.code || 'AUTH-NETWORK'); }
  return response.json();
}

function classifyPiAuthError(error) {
  const message = typeof error === 'string' ? error.toLowerCase() : typeof error?.message === 'string' ? error.message.toLowerCase() : '';
  if (/denied|cancelled|canceled|declined/.test(message)) return 'AUTH-PI-USER-DENIED';
  if (/unauthori[sz]ed|not.authori[sz]ed/.test(message)) return 'AUTH-PI-NOT-AUTHORIZED';
  if (/whitelist|app.access|access.denied|not.allowed/.test(message)) return 'AUTH-PI-APP-ACCESS';
  if (/scope|permission/.test(message)) return 'AUTH-PI-SCOPE';
  if (/incomplete.payment/.test(message)) return 'AUTH-PI-INCOMPLETE-PAYMENT';
  if (/not.initiali[sz]ed|call init|initiali[sz]ation/.test(message)) return 'AUTH-PI-SDK-INIT';
  if (/postmessage|target origin|origin mismatch/.test(message)) return 'AUTH-PI-ORIGIN';
  if (/callback/.test(message)) return 'AUTH-PI-CALLBACK';
  if (/network|offline|timeout|fetch/.test(message)) return 'AUTH-PI-NETWORK';
  if (/sdk|minepi|script/.test(message)) return 'AUTH-PI-SDK-ERROR';
  if (error == null) return 'AUTH-PI-EMPTY-RESULT';
  if (error instanceof Error) return 'AUTH-PI-SDK-ERROR';
  if (typeof error === 'object') return 'AUTH-PI-INTERNAL';
  return 'AUTH-PI-UNKNOWN';
}

function classifyPiInitError(error) {
  const message = typeof error === 'string' ? error.toLowerCase() : typeof error?.message === 'string' ? error.message.toLowerCase() : '';
  if (/sdk.missing|bridge|pi browser/.test(message)) return 'AUTH-SDK-INIT-NO-BRIDGE';
  if (/postmessage|target origin|origin mismatch/.test(message)) return 'AUTH-SDK-INIT-ORIGIN';
  if (/network|offline|timeout|fetch/.test(message)) return 'AUTH-SDK-INIT-NETWORK';
  if (/unsupported|not supported|version/.test(message)) return 'AUTH-SDK-INIT-UNSUPPORTED';
  if (error instanceof Error || (error && typeof error === 'object')) return 'AUTH-SDK-INIT-REJECTED';
  return 'AUTH-SDK-INIT-UNKNOWN';
}

function getPiReady() {
  if (!piInitPromise) {
    piInitPromise = (async () => {
      if (!window.Pi) throw new Error('AUTH-SDK-LOAD');
      await window.Pi.init({ version: '2.0' });
      return window.Pi;
    })().catch(error => { piInitPromise = null; throw error; });
  }
  return piInitPromise;
}

function withTimeout(promise, timeoutMs, timeoutCode) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(timeoutCode)), timeoutMs); }),
  ]).finally(() => clearTimeout(timer));
}

async function getNativePiBridge() {
  const candidate = window.Pi;
  if (!candidate || typeof candidate.init !== 'function' || typeof candidate.authenticate !== 'function' || typeof candidate.nativeFeaturesList !== 'function') return null;
  try {
    const pi = await withTimeout(getPiReady(), 2000, 'AUTH-SDK-BRIDGE-TIMEOUT');
    await withTimeout(pi.nativeFeaturesList(), 2000, 'AUTH-SDK-BRIDGE-TIMEOUT');
    return pi;
  } catch { return null; }
}

const PI_SIGNIN_CLIENT_ID = 'VJPT7Kr-WLTV6XsuV6F5q_-OIqOOsyEMgxVLub59JJ4';
const PI_SIGNIN_REDIRECT_URI = 'https://pioneerhub.andriussimonaitis.workers.dev/signin/callback';
const PI_SIGNIN_STATE_KEY = 'pioneerhub_pi_signin_state';

function beginPiSignIn() {
  const state = crypto.getRandomValues(new Uint8Array(32)).reduce((value, byte) => value + byte.toString(16).padStart(2, '0'), '');
  sessionStorage.setItem(PI_SIGNIN_STATE_KEY, state);
  const authorize = new URL('https://accounts.pinet.com/oauth/authorize');
  authorize.search = new URLSearchParams({ response_type: 'token', client_id: PI_SIGNIN_CLIENT_ID, redirect_uri: PI_SIGNIN_REDIRECT_URI, scope: 'username', state });
  location.assign(authorize);
}

async function handlePiSignInCallback() {
  if (location.pathname !== '/signin/callback') return;
  const status = document.querySelector('#piAuthStatus');
  const fragment = new URLSearchParams(location.hash.slice(1));
  const expected = sessionStorage.getItem(PI_SIGNIN_STATE_KEY);
  sessionStorage.removeItem(PI_SIGNIN_STATE_KEY);
  history.replaceState({}, document.title, location.pathname);
  const fail = code => { if (status) status.textContent = `Prisijungimo nepavyko patvirtinti. Diagnostikos kodas: ${code}.`; };
  if (!expected || fragment.get('state') !== expected) return fail('PI-SIGNIN-STATE-MISMATCH');
  if (fragment.get('error')) return fail('PI-SIGNIN-REJECTED');
  if (fragment.get('token_type') !== 'Bearer') return fail('PI-SIGNIN-INVALID-RESULT');
  const accessToken = fragment.get('access_token');
  if (!accessToken) return fail('PI-SIGNIN-INVALID-RESULT');
  try {
    await request('/api/pi/auth', { accessToken });
    if (status) status.textContent = 'Pi Sign-In patvirtintas serveryje. Mokėjimai lieka užrakinti.';
  } catch (error) { fail(error?.message === 'AUTH-ME-VERIFY' ? 'AUTH-ME-VERIFY' : 'PI-SIGNIN-NETWORK'); }
}

function bindLab() {
  const lab = document.querySelector('#lab');
  if (!lab) return;
  lab.innerHTML = `<div class="intro"><p class="eyebrow">TECHNINĖ DIAGNOSTIKA · TESTNET ONLY</p><h2>Testnet Payment Lab — užrakinta.</h2><p>Ši Testnet diagnostika nėra pagrindinio produkto dalis. Mokėjimas nekuriamas.</p><p class="note" data-testid="frontend-build">TESTNET INTEGRATION ACTIVE — AUTH TESTING · Build: ${FRONTEND_BUILD} · FRONTEND-RUNTIME: PARKED</p></div><div class="status-strip"><span class="state ready">DIAGNOSTIC: Pi Auth</span><span class="state ready">TESTNET: server verification</span><span class="state ready">PAYMENTS: užrakinta</span></div><div class="integration-grid"><article><span class="badge">PI AUTH · PARKED</span><h3>Pi Auth diagnostika</h3><p>Techninis Testnet patikrinimas. Pagrindinės PioneerHub funkcijos jo nereikalauja.</p><button id="piAuth" class="button" type="button">Atidaryti Pi Auth diagnostiką</button><p id="piAuthStatus" class="note" aria-live="polite">Mokėjimo mygtukas užrakintas.</p></article><article><span class="badge">PAYMENT LAB · LOCKED</span><h3>Test-Pi užrakintas</h3><p>Test-Pi užklausa šiame leidime nekuriama.</p><button id="piPayment" class="button" type="button" disabled aria-disabled="true">Mokėjimai užrakinti</button><p id="piPaymentStatus" class="note" aria-live="polite">Jokio mokėjimo nesukūrėme.</p></article></div>`;
  const auth = lab.querySelector('#piAuth');
  const authStatus = lab.querySelector('#piAuthStatus');
  let authInFlight = false;

  let incompletePaymentFound = false;
  function incompletePayment() {
    incompletePaymentFound = true;
    track('pi_incomplete_payment_callback'); // Safe event only; never inspect PaymentDTO during auth.
  }

  auth.addEventListener('click', async () => {
    if (authInFlight) return;
    authInFlight = true;
    auth.disabled = true;
    try {
      const pi = await getNativePiBridge();
      if (!pi) {
        beginPiSignIn();
        return;
      }

      let stage = 'AUTH-SDK-LOAD'; authStatus.textContent = 'Tikriname Pi Browser ir Testnet prisijungimą…';
      track('pi_auth_start');
      stage = 'AUTH-SDK-INIT';
      stage = 'AUTH-PI-REJECTED';
      const result = await withTimeout(pi.authenticate(NATIVE_PI_AUTH_SCOPES, incompletePayment), 15000, 'AUTH-PI-AUTHENTICATE-TIMEOUT');
      if (!result || typeof result.accessToken !== 'string' || !result.accessToken) throw new Error('AUTH-PI-INVALID-RESULT');
      stage = 'AUTH-ME-VERIFY'; await request('/api/pi/auth', { accessToken: result.accessToken });
      stage = 'AUTH-SESSION';
      authStatus.textContent = incompletePaymentFound
        ? 'Bazinis Testnet prisijungimas patikrintas, tačiau rastas nebaigtas ankstesnis mokėjimas. Mokėjimai lieka užrakinti. Diagnostikos kodas: AUTH-PI-INCOMPLETE-PAYMENT.'
        : 'Bazinis Testnet prisijungimas patikrintas serveryje. Mokėjimai šiame etape sąmoningai užrakinti.';
      track('pi_auth_complete');
    } catch (error) {
      const code = /^AUTH-(?:SDK-LOAD|SDK-INIT(?:-(?:NO-BRIDGE|ORIGIN|NETWORK|UNSUPPORTED|REJECTED|UNKNOWN))?|SDK-BRIDGE-TIMEOUT|ME-VERIFY|SESSION|NETWORK|PI-(?:AUTHENTICATE-TIMEOUT|USER-DENIED|NOT-AUTHORIZED|APP-ACCESS|SCOPE|INCOMPLETE-PAYMENT|NETWORK|SDK-ERROR|SDK-INIT|ORIGIN|PERMISSION|CALLBACK|INVALID-RESULT|EMPTY-RESULT|INTERNAL|UNKNOWN))$/.test(error?.message)
        ? error.message
        : stage === 'AUTH-SDK-INIT' ? classifyPiInitError(error)
          : stage === 'AUTH-PI-REJECTED' ? classifyPiAuthError(error)
          : stage || 'AUTH-UNKNOWN';
      authStatus.textContent = `Prisijungimo nepavyko patvirtinti. Diagnostikos kodas: ${code}. Nieko neapmokestinta ir joks wallet duomuo neišsaugotas.`;
      auth.disabled = false;
    } finally { authInFlight = false; }
  });

}

function bindCommunity() {
  const contributionRoutes = {
    'Scam%20report': '/prisidek#scam',
    'App%20suggestion': '/prisidek#app',
    'Guide%20idea': '/prisidek#guide',
  };
  document.querySelectorAll('#community a').forEach((anchor) => {
    const route = Object.entries(contributionRoutes).find(([subject]) => anchor.href.includes(subject))?.[1];
    if (route) anchor.href = route;
    anchor.addEventListener('click', () => {
      if (anchor.dataset.event) {
        track(anchor.dataset.event);
      } else if (anchor.href.includes('Scam')) {
        track('report_scam');
      } else if (anchor.href.includes('App')) {
        track('suggest_app');
      } else {
        track('community_cta');
      }
    });
  });
}

renderLearn();
document.querySelector('#search').oninput = (event) => renderLearn(event.target.value);
document.querySelector('#learnCards').addEventListener('click', (event) => {
  if (event.target.matches('button')) track('learn_article_open');
});
renderSafety();
bindScamShield();
renderRadar();
bindLab();
handlePiSignInCallback();
bindCommunity();

const startReturnScript = document.createElement('script');
const visualPolishStyles = document.createElement('link');
visualPolishStyles.rel = 'stylesheet';
visualPolishStyles.href = '/visual-polish.css?v=p0-ui-recovery-v1';
document.head.append(visualPolishStyles);
startReturnScript.src = '/start-return-v1.js?v=p0-ui-recovery-v1';
document.head.append(startReturnScript);

document.querySelectorAll('#lab a').forEach((anchor) => {
  anchor.addEventListener('click', () => track('community_cta'));
});
