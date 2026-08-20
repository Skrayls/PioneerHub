(() => {
  const root = document.querySelector('#kycStatusNavigator');
  if (!root) return;

  const situations = {
    invitation: {
      title: 'Dar nematau KYC kvietimo arba eigos',
      prompt: 'Ką daryti dabar?',
      steps: ['Neieškok „pagreitinimo“ paslaugų, mokamų tarpininkų ar DM nuorodų.', 'Pi programėlę ar Pi Browser atsidaryk savarankiškai iš savo įrenginio.', 'Patikrink tik oficialioje Pi aplinkoje, ar rodoma eiga arba pranešimas.'],
      outcome: 'Palauk oficialios eigos ir tikrink ją tik oficialioje Pi aplinkoje.',
      note: 'PioneerHub negali matyti, ar ir kada tavo paskyrai bus pasiūlyta KYC eiga.',
    },
    waiting: {
      title: 'KYC pradėjau, bet būsena ilgai nesikeičia',
      prompt: 'Ką verta patikrinti saugiai?',
      steps: ['Nesiųsk dokumentų, selfie ar ekrano nuotraukų per pokalbius, el. paštą ar formas.', 'Patikrink būseną toje pačioje oficialioje Pi aplinkoje, kur pradėjai eigą.', 'Jei matai nurodymą, vadovaukis tik jo tekstu — ne nepažįstamo žmogaus interpretacija.'],
      outcome: 'Nespręsk pagal laiką ar gandus: remkis tik tuo, kas rodoma oficialioje eigoje.',
      note: 'Laukimas savaime neįrodo nei patvirtinimo, nei atmetimo.',
    },
    request: {
      title: 'Kažkas prašo mokesčio, dokumentų ar prisijungimo dėl KYC',
      prompt: 'Ar tai saugu?',
      steps: ['SUSTOK: nepervesk Pi ir neatidaryk gautos nuorodos.', 'Niekam neduok wallet passphrase, seed frazės, privataus rakto ar KYC dokumentų.', 'Oficialią Pi aplinką atsidaryk pats ir palygink informaciją nepriklausomai.'],
      outcome: 'Laikyk tokį prašymą rizikos signalu, kol jo nepatvirtinai oficialioje Pi aplinkoje.',
      note: 'PioneerHub neprašo ir neapdoroja KYC informacijos.',
    },
    unclear: {
      title: 'Matau neaiškų pranešimą arba nežinau, ką reiškia būsena',
      prompt: 'Kaip nepadaryti skubotos išvados?',
      steps: ['Nespręsk pagal ekrano nuotrauką, įrašą grupėje ar neoficialų „statusų sąrašą“.', 'Užsirašyk tik bendrą pranešimo prasmę sau, bet nekelk asmens duomenų į viešumą.', 'Atidaryk oficialų KYC punktą savarankiškai ir remkis tik tuo, kas ten rodoma.'],
      outcome: 'Neaiškus tekstas nėra kvietimas veikti per trečiąją šalį.',
      note: 'Šis gidas paaiškina saugų sprendimo būdą, o ne interpretuoja tavo individualų statusą.',
    },
  };

  const renderChoices = () => {
    root.innerHTML = `<h2>Kuri situacija arčiausia?</h2><div class="situation-grid">${Object.entries(situations).map(([key, item]) => `<button type="button" data-situation="${key}"><strong>${item.title}</strong><span>Rodyti saugų kitą žingsnį →</span></button>`).join('')}</div><p class="privacy-note">Nereikia nieko įvesti — pasirinkimas lieka tik šiame puslapio lange.</p>`;
    root.querySelectorAll('[data-situation]').forEach(button => button.addEventListener('click', () => renderGuidance(situations[button.dataset.situation])));
  };

  const renderGuidance = item => {
    root.innerHTML = `<p class="step-label">SAUGUS KELIAS</p><h2>${item.prompt}</h2><ol>${item.steps.map(step => `<li>${step}</li>`).join('')}</ol><section class="outcome"><strong>${item.outcome}</strong><p>${item.note}</p></section><a class="button primary" href="/sauga">Atidaryti Safety Center</a><button class="back-button" type="button">← Pasirinkti kitą situaciją</button>`;
    root.querySelector('.back-button').addEventListener('click', renderChoices);
  };

  renderChoices();
})();
