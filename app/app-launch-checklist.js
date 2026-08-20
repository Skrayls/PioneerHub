(() => {
  const root = document.querySelector('#appLaunchChecklist');
  if (!root) return;

  const checks = [
    ['purpose', 'Galiu vienu sakiniu paaiškinti vartotojui, kokią konkrečią problemą sprendžia mano appas.', 'Aiškiai aprašyk pirmą vartotojo vertę prieš galvodamas apie augimą ar monetizaciją.'],
    ['core-flow', 'Pagrindinį veiksmą išbandžiau nuo pradžios iki pabaigos be kūrėjo pagalbos.', 'Pakartok vieną pilną pagrindinio veiksmo testą nauju, švariu vartotojo keliu.'],
    ['safe-boundary', 'Appas neprašo passphrase, seed frazės, privataus rakto ar nereikalingų asmens duomenų.', 'Pašalink bet kokį jautrių wallet ar perteklinių asmens duomenų prašymą iš produkto eigos.'],
    ['official-review', 'Peržiūrėjau aktualius oficialius Pi Developer Portal reikalavimus, kurie taikomi mano appui.', 'Prieš pateikimą perskaityk aktualias oficialias Pi kūrėjų instrukcijas; jos yra autoritetingos.'],
  ];

  const render = () => {
    root.innerHTML = `<h2>Greita parengties patikra</h2><form id="launchForm"><fieldset><legend>Pažymėk tik tai, kas jau tiesa</legend>${checks.map(([key, label]) => `<label><input type="checkbox" name="ready" value="${key}"><span>${label}</span></label>`).join('')}</fieldset><button class="button primary" type="submit">Sudaryti mano kitus žingsnius</button></form><p class="privacy-note">Pasirinkimai lieka tik šiame puslapio lange. PioneerHub jų nesiunčia ir neišsaugo.</p>`;
    root.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const ready = new Set(new FormData(event.currentTarget).getAll('ready'));
      const missing = checks.filter(([key]) => !ready.has(key));
      root.innerHTML = `<p class="step-label">TAVO RIBOTAS DARBŲ SĄRAŠAS</p><h2>${missing.length ? `Liko ${missing.length} pagrindinis${missing.length === 1 ? ' žingsnis' : ' žingsniai'}.` : 'Pagrindinė savikontrolė atlikta.'}</h2>${missing.length ? `<ol>${missing.map(([, , action]) => `<li>${action}</li>`).join('')}</ol>` : '<p>Dar kartą savarankiškai patikrink oficialius Pi reikalavimus prieš pateikimą ar viešą paleidimą.</p>'}<section class="outcome"><strong>Riba aiški: šis rezultatas nėra leidimas, sertifikatas ar Pi patvirtinimas.</strong><p>Jis padeda nepamiršti keturių bazinių kūrėjo kontrolės punktų.</p></section><a class="official-link" href="https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/quickStart/" target="_blank" rel="noreferrer">Atidaryti oficialų Pi kūrėjų gidą ↗</a><button class="back-button" type="button">← Pildyti iš naujo</button>`;
      root.querySelector('.back-button').addEventListener('click', render);
    });
  };
  render();
})();
