const FRONTEND_BUILD = 'testnet-cache-r2';

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
  const filtered = topics.filter((topic) => topic.join(' ').toLowerCase().includes(query.toLowerCase()));

  cards.innerHTML = filtered.map(([title, description, category]) => `
    <article>
      <span>${category}</span>
      <h3>${title}</h3>
      <p>${description}</p>
      <button data-topic="${title}">Skaityti santrauka</button>
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
    result.innerHTML = `<strong>${title}</strong><p>${body}</p><a class="text-link" href="https://minepi.com/safety/" target="_blank" rel="noreferrer">Atidaryti Pi Safety šaltinį ↗</a>`;
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
  const root = document.querySelector('#radar .radar');

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

function loadPiSdk() {
  if (window.Pi) return Promise.resolve(window.Pi);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => window.Pi ? resolve(window.Pi) : reject(new Error('sdk_unavailable'));
    script.onerror = () => reject(new Error('sdk_unavailable'));
    document.head.append(script);
  });
}

function bindLab() {
  const lab = document.querySelector('#lab');
  if (!lab) return;
  lab.innerHTML = `<div class="intro"><p class="eyebrow">PI INTEGRACIJA · TESTNET ONLY</p><h2>Testnet Payment Lab.</h2><p><strong>LIVE:</strong> Pi Browser Testnet autentifikacija, serverio patikra ir mokėjimo flow. Portal konfigūracija jau užbaigta; jei runtime patikra nepraeina, parodomas tik saugus diagnostinis kodas.</p><p class="note" data-testid="frontend-build">TESTNET INTEGRATION ACTIVE — AUTH TESTING · Build: ${FRONTEND_BUILD} · FRONTEND-RUNTIME: ACTIVE</p></div><div class="status-strip"><span class="state live">LIVE: Testnet-only Payment Lab</span><span class="state ready">READY: server verification ir duplicate protection</span><span class="state ready">RUNTIME CHECK: Pi Browser ir Testnet paskyros būsena</span></div><div class="integration-grid"><article><span class="badge">PI AUTH · TESTNET ONLY</span><h3>Prisijunk tik per Pi Browser</h3><p>Nėra el. pašto, slaptažodžio ar wallet importo. Tokenas tikrinamas per serverinį <code>/me</code>; passphrase niekada neprašoma ir nesaugoma.</p><button id="piAuth" class="button primary" type="button">Prisijungti prie Testnet Lab</button><p id="piAuthStatus" class="note" aria-live="polite">Iki patikrinto prisijungimo mokėjimo mygtukas neveikia.</p></article><article><span class="badge">PAYMENT LAB · TESTNET ONLY</span><h3>Vienas aiškus Test-Pi bandymas</h3><p>Po patikrinto prisijungimo gali pats sukurti <strong>0.01 Test-Pi</strong> užklausą. Test-Pi neturi piniginės vertės.</p><button id="piPayment" class="button" type="button" disabled aria-disabled="true">Pirma prisijunk per Pi Browser</button><p id="piPaymentStatus" class="note" aria-live="polite">Jokio mokėjimo dar nesukūrėme.</p></article></div>`;
  const auth = lab.querySelector('#piAuth');
  const authStatus = lab.querySelector('#piAuthStatus');
  const payment = lab.querySelector('#piPayment');
  const paymentStatus = lab.querySelector('#piPaymentStatus');
  let pi;
  let authorization;

  async function incompletePayment(paymentRecord) {
    const id = paymentRecord?.identifier;
    const txid = paymentRecord?.transaction?.txid;
    if (!id || !txid) return;
    try { await request(`/api/pi/payments/${encodeURIComponent(id)}/complete`, { txid }, authorization); } catch { /* The SDK shows its own retry path. */ }
  }

  auth.addEventListener('click', async () => {
    auth.disabled = true;
    let stage = 'AUTH-SDK-LOAD'; authStatus.textContent = 'Įkeliame Pi SDK ir tikriname Testnet prisijungimą…';
    track('pi_auth_start');
    try {
      pi = await loadPiSdk();
      stage = 'AUTH-SDK-INIT'; await pi.init({ version: '2.0' });
      stage = 'AUTH-PI-REJECTED';
      const result = await pi.authenticate(['payments'], incompletePayment);
      stage = 'AUTH-ME-VERIFY'; const verified = await request('/api/pi/auth', { accessToken: result.accessToken });
      stage = 'AUTH-SESSION';
      authorization = verified.authorization;
      authStatus.textContent = 'Testnet prisijungimas patikrintas serveryje. Pi username ir tokenas PioneerHub UI nerodomi.';
      payment.disabled = false;
      payment.removeAttribute('aria-disabled');
      payment.textContent = 'Sukurti 0.01 Test-Pi mokėjimą';
      track('pi_auth_complete');
    } catch (error) {
      const code = /^AUTH-(?:SDK-LOAD|SDK-INIT|PI-REJECTED|ME-VERIFY|SESSION|NETWORK)$/.test(error?.message) ? error.message : stage || 'AUTH-UNKNOWN';
      authStatus.textContent = `Prisijungimo nepavyko patvirtinti. Diagnostikos kodas: ${code}. Nieko neapmokestinta ir joks wallet duomuo neišsaugotas.`;
      auth.disabled = false;
    }
  });

  payment.addEventListener('click', async () => {
    if (!pi || payment.disabled) return;
    payment.disabled = true;
    paymentStatus.textContent = 'Kuriama aiškiai pažymėta Testnet užklausa Pi Browser lange…';
    track('testnet_payment_start');
    try {
      await pi.createPayment({ amount: 0.01, memo: 'PioneerHub Testnet Payment Lab', metadata: { purpose: 'testnet_payment_lab' } }, {
        onReadyForServerApproval: async (paymentId) => { await request(`/api/pi/payments/${encodeURIComponent(paymentId)}/approve`, {}, authorization); },
        onReadyForServerCompletion: async (paymentId, txid) => {
          await request(`/api/pi/payments/${encodeURIComponent(paymentId)}/complete`, { txid }, authorization);
          paymentStatus.textContent = 'Testnet mokėjimas užbaigtas serveryje. Test-Pi neturi piniginės vertės.';
          track('testnet_payment_complete');
        },
        onCancel: () => { paymentStatus.textContent = 'Testnet mokėjimas atšauktas. Nieko nepervesta Mainnet tinkle.'; },
        onError: () => { paymentStatus.textContent = 'Testnet mokėjimo nepavyko užbaigti. Nieko nepatvirtinta kaip sėkminga.'; },
      });
    } catch {
      paymentStatus.textContent = 'Testnet mokėjimo užklausa nepavyko. Nieko nepatvirtinta kaip sėkminga.';
    } finally { payment.disabled = false; }
  });
}

function bindCommunity() {
  document.querySelectorAll('#community a').forEach((anchor) => {
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
bindCommunity();

document.querySelectorAll('#lab a').forEach((anchor) => {
  anchor.addEventListener('click', () => track('community_cta'));
});
