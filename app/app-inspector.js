(() => {
  const evidence = window.PioneerEvidence;
  if (!evidence) throw new Error('PioneerEvidence must load before App Inspector');
  const form = document.querySelector('#appInspector');
  const field = document.querySelector('#inspectorUrl');
  const result = document.querySelector('#inspectorResult');
  if (!form || !field || !result) return;

  const link = (href, text) => { const anchor = document.createElement('a'); anchor.href = href; anchor.textContent = text; if (href.startsWith('http')) { anchor.target = '_blank'; anchor.rel = 'noreferrer'; } return anchor; };
  const render = ({ state, title, paragraphs, signals = [], action }) => {
    result.hidden = false; result.dataset.state = state; result.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = title; result.append(heading);
    paragraphs.forEach(text => { const p = document.createElement('p'); p.textContent = text; result.append(p); });
    if (signals.length) { const list = document.createElement('ul'); signals.forEach(signal => { const item = document.createElement('li'); item.textContent = signal; list.append(item); }); result.append(list); }
    const actionWrap = document.createElement('p'); actionWrap.append(link(action.href, action.text)); result.append(actionWrap);
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = field.value.trim(); let url;
    try { url = new URL(value); } catch {
      render({ state: 'caution', title: 'Nuorodos nepavyko perskaityti.', paragraphs: ['Įklijuok visą viešą http arba https nuorodą. Neatidaryk jos vien tam, kad patikrintum.'], action: { href: '/sauga/itartina-nuoroda', text: 'Atidaryti įtartinos nuorodos gidą →' } }); return;
    }
    const signals = [];
    if (!/^https?:$/.test(url.protocol)) signals.push('Tai nėra įprasta vieša http arba https nuoroda.');
    if (url.protocol !== 'https:') signals.push('Nuoroda nenaudoja HTTPS.');
    if (url.username || url.password) signals.push('Nuorodoje yra prisijungimo duomenų dalis (@) — tai gali klaidinti.');
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname) || url.hostname.includes(':')) signals.push('Nuoroda naudoja IP adresą, ne aiškų domeną.');
    if (url.hostname.startsWith('xn--')) signals.push('Domenas naudoja tarptautinį (punycode) užrašymą; lygink jį labai atidžiai.');
    if (/passphrase|seed|private.?key|kyc|wallet|claim|bonus|airdrop/i.test(`${url.pathname}${url.search}`)) signals.push('Nuorodos kelias ar parametrai mini jautrią wallet/KYC temą; nevesk jokių slaptų duomenų.');
    if (signals.length) {
      render({ state: 'stop', title: 'Sustok ir tikrink kitu keliu.', paragraphs: ['Rasti signalai nereiškia, kad tai būtinai scam, tačiau jų pakanka nepasitikėti gauta nuoroda. Oficialių Pi vietų ieškok pats, ne per šią nuorodą.'], signals, action: { href: '/sauga/itartina-nuoroda', text: 'Atidaryti saugų veiksmų gidą →' } }); return;
    }
    const record = evidence.findByHostname(url.hostname);
    if (record) {
      const freshness = evidence.freshnessFor(record.lastReviewed);
      const state = evidence.states[record.evidenceState];
      const source = record.sources[0];
      render({ state: 'known', title: `Rastas PioneerHub Radar įrodymų įrašas: ${record.name}.`, paragraphs: [`Normalizuotas domenas: ${url.hostname}.`, `Įrodymų būsena: ${state.label}. Peržiūrėta: ${record.lastReviewed}; ${freshness.label}.`, `Šaltinis: ${source.label}. Ribos: ${record.limitations}`, 'Tai nepatvirtina kiekvieno puslapio, paskyros ar veiksmų saugumo. Passphrase įvesk tik wallet.pinet.com ir niekada jos nesiųsk niekam.'], action: { href: `/radar/${record.slug}`, text: `Peržiūrėti ${record.name} įrodymus →` } }); return;
    }
    render({ state: 'caution', title: 'Šio domeno PioneerHub neatpažįsta.', paragraphs: ['Tai nėra įrodymas, kad nuoroda bloga, ir nėra saugumo patvirtinimas. PioneerHub jos neatidarė ir nepatikrino programėlės elgesio.', 'Jei nuoroda atėjo žinute, neskubėk: atsidaryk oficialų Pi šaltinį pats arba patikrink signalus Scam Shield.'], action: { href: '/#shield', text: 'Atidaryti Scam Shield →' } });
  });
})();
