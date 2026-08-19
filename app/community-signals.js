(() => {
  const choices = { scam: ['Pranešti apie scam', 'Scam report'], app: ['Pasiūlyti App Radar įrašą', 'App suggestion'], guide: ['Pasiūlyti gidą', 'Guide idea'] };
  const forbidden = /passphrase|seed phrase|private key|privatus raktas|slapta fraz/i;
  const root = document.querySelector('#communitySignals');
  if (!root) return;
  const initial = choices[location.hash.slice(1)] ? location.hash.slice(1) : 'scam';
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const render = type => {
    const [title, subject] = choices[type];
    root.innerHTML = `<div class="community-choice" role="group" aria-label="Pasirink pranešimo tipą">${Object.entries(choices).map(([key, item]) => `<button type="button" data-type="${key}" aria-pressed="${key === type}"><strong>${item[0]}</strong></button>`).join('')}</div><form class="signal-form"><h2>${title}</h2><label>Ką norėtum pranešti?<textarea name="details" maxlength="1200" required placeholder="Aprašyk trumpai. Nerašyk slaptažodžių, passphrase, seed frazių, privačių raktų ar KYC dokumentų."></textarea></label><label>Vieša nuoroda arba programėlės pavadinimas <input name="reference" maxlength="500" placeholder="Nebūtina"></label><p class="privacy-note">PioneerHub šių laukų neskaito ir neišsaugo. Paspaudus atidaroma tavo el. pašto programa; laišką išsiųsi tik pats.</p><button class="button primary" type="submit">Paruošti laišką mano programoje</button></form><div class="signal-result" aria-live="polite" hidden></div>`;
    root.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => { location.hash = button.dataset.type; render(button.dataset.type); }));
    root.querySelector('form').addEventListener('submit', event => {
      event.preventDefault(); const form = new FormData(event.currentTarget); const details = String(form.get('details') || '').trim(); const reference = String(form.get('reference') || '').trim(); const result = root.querySelector('.signal-result');
      if (forbidden.test(`${details} ${reference}`)) { result.hidden = false; result.textContent = 'Nesiųsk jautrių wallet ar tapatybės duomenų. Juos pašalink ir aprašyk tik situaciją arba viešą nuorodą.'; return; }
      const body = [`Tipas: ${title}`, '', 'Aprašymas:', details, '', 'Vieša nuoroda / pavadinimas:', reference || 'Nenurodyta', '', 'Pastaba: Šį laišką savanoriškai paruošė vartotojas.'].join('\n');
      location.href = `mailto:hello@pioneerhub.lt?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  };
  render(initial);
})();
