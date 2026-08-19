(() => {
  const key = 'pioneerhub:lastVisit';
  const updates = [
    { type: 'MOKYKIS', title: '15 pilnų Mokykis gidų', date: '2026-08-19', note: 'Rask konkretų atsakymą ir pilną gidą.', href: '/#learn' },
    { type: 'APP RADAR', title: 'App Radar V2', date: '2026-08-19', note: 'Peržiūrėk šaltinius, ribas ir peržiūros šviežumą.', href: '/#radar' },
    { type: 'SAUGA', title: 'Safety Center', date: '2026-08-19', note: 'Trys aiškūs veiksmo gidai be prisijungimo.', href: '/sauga' },
  ];
  const hero = document.querySelector('.hero');
  const launcher = document.createElement('section'); launcher.className='start-return'; launcher.setAttribute('aria-labelledby','startTitle'); launcher.innerHTML=`<h2 id="startTitle">Pasirink, ko dabar reikia.</h2><div class="intent-grid"><a href="/mokykis/pi-network"><strong>Esu naujas Pi vartotojas</strong><span>Pradėk nuo Pi, wallet, KYC ir migracijos.</span></a><a href="/mokykis/pi-wallet"><strong>Noriu suprasti wallet, KYC ar balansą</strong><span>Atidaryk Mokykis gidus.</span></a><a href="#shield"><strong>Neramu dėl žinutės ar scam</strong><span>Greita signalų patikra; pilnam gidui — Sauga.</span></a><a href="/#radar"><strong>Noriu patikrinti Pi programėlę</strong><span>Atidaryk App Radar.</span></a></div></section>`; hero?.after(launcher);
  const mobile = document.createElement('details'); mobile.className='mobile-nav'; mobile.innerHTML=`<summary>Atidaryti navigaciją</summary><nav aria-label="Mobilioji navigacija"><a href="/#learn">Mokykis</a><a href="/sauga">Sauga</a><a href="/#shield">Scam Shield</a><a href="/#radar">App Radar</a></nav>`; document.querySelector('header')?.append(mobile);
  let last = null; try { last = localStorage.getItem(key); } catch {}
  const shown = last ? updates.filter(item => Date.parse(`${item.date}T00:00:00Z`) > Date.parse(last)) : updates;
  const panel = document.createElement('section'); panel.className='updates'; panel.setAttribute('aria-labelledby','updatesTitle'); panel.innerHTML=`<div><p class="eyebrow">KAS NAUJO</p><h2 id="updatesTitle">${last ? 'Nuo paskutinio karto' : 'Naujausi atnaujinimai'}</h2><p>Šiame įrenginyje prisimenamas tik paskutinio apsilankymo laikas.</p></div>${(shown.length?shown:updates.slice(0,1)).map(item=>`<a href="${item.href}"><small>${item.type} · ${item.date}</small><strong>${item.title}</strong><span>${item.note}</span></a>`).join('')}`; document.querySelector('#learn')?.before(panel);
  setTimeout(() => { try { localStorage.setItem(key, new Date().toISOString()); } catch {} }, 1500);
})();
