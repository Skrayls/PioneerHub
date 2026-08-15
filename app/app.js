const topics = [
  ["01", "Pradžia", "Ką Pi programa daro ir ko ji nežada."],
  ["02", "Wallet sauga", "Passphrase, oficialūs keliai ir phishing signalai."],
  ["03", "KYC ir Mainnet", "Ką reiškia patvirtinimas bei migracija."],
  ["04", "Balansas", "Unverified, transferable ir migrated nėra tas pats."],
  ["05", "Lockup", "Boost nėra priežastis prarasti likvidumą."],
  ["06", "Mokėjimai", "Kaip perskaityti prašymą prieš jį patvirtinant."],
  ["07", "Programėlės", "Kaip įvertinti naudą, saugą ir skaidrumą."],
  ["08", "Node ir kūrimas", "Kada verta prisidėti techniškai."],
];
document.querySelector('#learnCards').innerHTML = topics.map(([number, title, text]) => `<article><span class="number">${number}</span><h3>${title}</h3><p>${text}</p></article>`).join('');
document.querySelector('#labButton').addEventListener('click', () => {
  document.querySelector('#labResult').textContent = 'Testnet scenarijus: pirmiausia įvertini siūlomą naudą, tada tik oficialioje Pi sąsajoje tikrini gavėją ir sumą. PioneerHub niekada neprašo tavo passphrase.';
});
