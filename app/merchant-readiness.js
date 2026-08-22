(() => {
  const root = document.querySelector('#merchantReadiness');
  if (!root) return;

  const scenarios = {
    goods: { title: 'Parduodu fizines prekes', focus: 'Pradėk nuo pristatymo, grąžinimo ir aiškaus užsakymo patvirtinimo.' },
    service: { title: 'Teikiu paslaugą ar rezervaciją', focus: 'Pradėk nuo atlikimo ribų, atšaukimo ir kliento patvirtinimo.' },
    digital: { title: 'Parduodu skaitmeninį turinį', focus: 'Pradėk nuo prieigos suteikimo, klaidų sprendimo ir grąžinimo taisyklės.' },
  };
  const areas = [
    { key: 'fulfilment', title: 'Įvykdymas', text: 'Galiu aiškiai pasakyti, ką klientas gaus, kada ir kaip patvirtinsiu užsakymą.' },
    { key: 'refund', title: 'Grąžinimas / ginčas', text: 'Turiu suprantamą kelią, ką darysiu dėl neatitikimo, atšaukimo ar neįvykdyto užsakymo.' },
    { key: 'communication', title: 'Kliento komunikacija', text: 'Galiu parodyti vieną patikimą kanalą užsakymo klausimams ir nevartoti spaudimo kalbos.' },
    { key: 'fraud', title: 'Sukčiavimas ir eskalavimas', text: 'Žinau, kad neprašysiu passphrase ar privataus rakto ir sustabdysiu neaiškią situaciją prieš veiksmą.' },
  ];
  const incidents = [
    { key: 'delay', title: 'Pristatymas vėluoja', prompt: 'Klientas klausia, kada gaus užsakymą.', steps: ['Sustabdyk pažadus, kurių negali patvirtinti.', 'Patikrink realią įvykdymo būseną ir nurodyk vieną aiškų atnaujinimo laiką.', 'Jei negali įvykdyti, pasiūlyk savo iš anksto numatytą atšaukimo ar ginčo kelią.'] },
    { key: 'cancel', title: 'Klientas nori atšaukti', prompt: 'Klientas prašo atšaukti užsakymą arba rezervaciją.', steps: ['Patikrink, kas jau buvo atlikta ir kokia tavo paskelbta atšaukimo riba.', 'Atsakyk per savo nurodytą kontaktą be spaudimo ar naujų sąlygų.', 'Užfiksuok rezultatą savo veiklos procese prieš priimdamas kitą užsakymą.'] },
    { key: 'suspicious', title: 'Gaunu įtartiną prašymą', prompt: 'Kažkas prašo wallet, passphrase, privataus rakto arba skubaus veiksmo.', steps: ['Nieko nesiųsk ir nespausk nuorodos iš prašymo.', 'Perkelk pokalbį į savo patikimą kontaktų kanalą arba jį nutrauk.', 'Peržiūrėk PioneerHub saugaus veiksmo patikrą prieš tęsiant bet kokį veiksmą.'] },
  ];
  let selected = '';
  let started = false;
  const track = event => { if (navigator.sendBeacon) navigator.sendBeacon('/events', event); };

  const renderScenario = () => {
    root.innerHTML = `<h2>Kokia veiklos situacija arčiausia?</h2><div class="scenario-grid">${Object.entries(scenarios).map(([key, item]) => `<button type="button" data-scenario="${key}"><strong>${item.title}</strong><span>Pradėti įvertinimą →</span></button>`).join('')}</div><p class="privacy-note">Nieko apie veiklą neįvedi ir neišsiunti. Pasirinkimas lieka tik šiame puslapyje.</p>`;
    root.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
      selected = button.dataset.scenario;
      if (!started) { started = true; track('merchant_readiness_start'); }
      renderAssessment();
    }));
  };

  const renderAssessment = () => {
    const scenario = scenarios[selected];
    root.innerHTML = `<p class="step-label">1 IŠ 3 · ${scenario.title}</p><h2>Ar pagrindas jau paruoštas?</h2><p class="focus-note">${scenario.focus}</p><form id="merchantForm">${areas.map(area => `<label><input type="checkbox" name="area" value="${area.key}"><span><strong>${area.title}</strong>${area.text}</span></label>`).join('')}<button class="button primary" type="submit">Sudaryti pasirengimo planą</button></form><button class="back-button" type="button">← Keisti situaciją</button>`;
    root.querySelector('.back-button').addEventListener('click', renderScenario);
    root.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      renderPlan(new Set(new FormData(event.currentTarget).getAll('area')));
    });
  };

  const renderPlan = checked => {
    const gaps = areas.filter(area => !checked.has(area.key));
    const status = gaps.length === 0 ? 'Veiklos pagrindas apgalvotas.' : gaps.length === 1 ? 'Liko vienas aiškus tarpas.' : `Liko ${gaps.length} svarbūs tarpai.`;
    const plan = gaps.length ? gaps : areas;
    root.innerHTML = `<p class="step-label">2 IŠ 3 · TAVO PLANAS</p><h2>${status}</h2><p>${gaps.length ? 'Prieš svarstant bet kokį mokėjimo būdą, išspręsk šiuos veiklos klausimus pasirinkta tvarka.' : 'Peržiūrėk šią tvarką dar kartą, jei pasikeičia užsakymo, pristatymo ar klientų aptarnavimo procesas.'}</p><ol class="readiness-plan">${plan.map((area, index) => `<li><b>${index + 1}. ${area.title}</b><span>${area.text}</span></li>`).join('')}</ol><div class="next-actions"><button class="button primary" type="button" data-rehearse>Praktikuoti situacijos atsaką</button><a class="button secondary" href="/sauga/pries-siunciant-pi">Atidaryti saugaus veiksmo patikrą</a><button class="back-button" type="button">← Įvertinti kitą situaciją</button></div><p class="privacy-note">Tai nėra leidimas priimti Pi ir neįvertina teisės, mokesčių ar konkretaus verslo. Jei nuspręsi veikti, savarankiškai patikrink aktualius reikalavimus.</p>`;
    track('merchant_readiness_complete');
    root.querySelector('[data-rehearse]').addEventListener('click', renderRehearsal);
    root.querySelector('.back-button').addEventListener('click', renderScenario);
  };

  const renderRehearsal = () => {
    root.innerHTML = `<p class="step-label">3 IŠ 3 · VEIKLOS REPETICIJA</p><h2>Pasirink situaciją ir patikrink savo pirmą atsaką.</h2><p class="focus-note">Tai trumpa proceso repeticija, ne tikras klientų aptarnavimas. Nieko nesiunčiama ir nesaugoma.</p><div class="scenario-grid">${incidents.map(item => `<button type="button" data-incident="${item.key}"><strong>${item.title}</strong><span>${item.prompt}</span></button>`).join('')}</div><button class="back-button" type="button">← Grįžti prie plano</button>`;
    root.querySelectorAll('[data-incident]').forEach(button => button.addEventListener('click', () => renderResponse(incidents.find(item => item.key === button.dataset.incident))));
    root.querySelector('.back-button').addEventListener('click', () => renderAssessment());
  };

  const renderResponse = incident => {
    root.innerHTML = `<p class="step-label">VEIKLOS REPETICIJA · ATSAKAS</p><h2>${incident.title}</h2><p>${incident.prompt}</p><ol class="readiness-plan">${incident.steps.map((step, index) => `<li><b>${index + 1}. Veiksmas</b><span>${step}</span></li>`).join('')}</ol><div class="next-actions"><a class="button primary" href="/sauga/pries-siunciant-pi">Atidaryti saugaus veiksmo patikrą</a><button class="back-button" type="button">← Repetuoti kitą situaciją</button></div><p class="privacy-note">Naudingas rezultatas: gali aiškiai pasakyti, koks yra pirmas saugus veiksmas, kai pasikeičia įvykdymas, atšaukimas ar kyla įtarimas. Tai nėra teisinė, mokestinė ar finansinė konsultacija.</p>`;
    track('merchant_rehearsal_complete');
    root.querySelector('.back-button').addEventListener('click', renderRehearsal);
  };

  renderScenario();
})();
