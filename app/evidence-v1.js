(() => {
  // Curated local evidence: no requests, tracking, or destination fetching.
  const FRESH_DAYS = 14;
  const DUE_DAYS = 30;
  const states = {
    VERIFIED_BASICS: { label: 'PATVIRTINTI PAGRINDAI', className: 'verified', note: 'Atlikti nurodyti tapatybės ir šaltinio patikrinimai; tai nėra oficialus Pi patvirtinimas.' },
    CAUTION: { label: 'ATSARGIAI', className: 'caution', note: 'Yra svarbios trūkstamos, pasenusios ar neaiškios informacijos.' },
    LIMITED_DATA: { label: 'RIBOTI DUOMENYS', className: 'limited', note: 'Įrodymų nepakanka prasmingam platesniam vertinimui.' },
    HIGH_RISK: { label: 'VENGTI / DIDELĖ RIZIKA', className: 'risk', note: 'Naudojama tik esant konkrečiam dokumentuotam rimtos rizikos įrodymui.' },
  };
  const records = [
    ['pi-browser', ['minepi.com'], 'VERIFIED_BASICS', '2026-08-19', '2026-09-18', 'Pi Browser', 'PioneerHub neatliko prisijungimo, piniginės ar atskirų programėlių funkcijų testo.', 'Pi Browser', 'https://minepi.com/pi-browser/'],
    ['pi-wallet', ['wallet.pinet.com'], 'VERIFIED_BASICS', '2026-08-19', '2026-09-18', 'Pi Wallet', 'PioneerHub netestavo piniginės prisijungimo, likučių ar siuntimo funkcijų.', 'Pi Safety Center', 'https://minepi.com/safety/'],
    ['fireside-forum', ['fireside.pinet.com'], 'VERIFIED_BASICS', '2026-08-19', '2026-09-18', 'Fireside Forum', 'PioneerHub netestavo paskyros, moderavimo ar konkrečių įrašų patikimumo.', 'Pi Safety Center', 'https://minepi.com/safety/'],
    ['pi-chats', ['chat.pinet.com'], 'VERIFIED_BASICS', '2026-08-19', '2026-09-18', 'Pi Chats', 'PioneerHub netestavo pokalbių funkcijų ar vartotojų tapatybių.', 'Pi Safety Center', 'https://minepi.com/safety/'],
    ['kyc', ['kyc.pinet.com'], 'VERIFIED_BASICS', '2026-08-19', '2026-09-18', 'KYC', 'PioneerHub neatliko KYC proceso ir netikrino asmens duomenų pateikimo eigos.', 'Pi Safety Center', 'https://minepi.com/safety/'],
    ['pi-launchpad', [], 'LIMITED_DATA', '2026-08-19', '2026-09-02', 'Pi Launchpad', 'PioneerHub netestavo programėlės, jos skaičiavimų, projektų ar bet kokios finansinės rizikos.', 'Pi Day 2026 pranešimas', 'https://minepi.com/blog/pi-day-2026/'],
    ['cidi-games', [], 'LIMITED_DATA', '2026-08-19', '2026-09-02', 'CiDi Games', 'PioneerHub netestavo paskyros, žaidimų, mokėjimų, privatumo ar saugumo praktikų.', 'CiDi Games beta pranešimas', 'https://minepi.com/announcement/cidi-games-beta/'],
  ].map(([slug, domains, evidenceState, lastReviewed, nextReview, name, limitations, sourceLabel, sourceUrl]) => ({ slug, canonicalId: slug, domains, evidenceState, lastReviewed, nextReview, name, limitations, sources: [{ type: 'Oficialus Pi šaltinis', label: sourceLabel, url: sourceUrl }] }));
  const freshnessFor = (lastReviewed, now = new Date()) => {
    const age = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.parse(`${lastReviewed}T00:00:00Z`)) / 86400000);
    if (age <= FRESH_DAYS) return { key: 'fresh', label: 'Šviežia peržiūra' };
    if (age <= DUE_DAYS) return { key: 'due', label: 'Peržiūra netrukus' };
    return { key: 'overdue', label: 'Peržiūra vėluoja' };
  };
  const findByHostname = hostname => records.find(record => record.domains.includes(String(hostname).toLowerCase()));
  window.PioneerEvidence = { version: 'evidence-v1', records, states, FRESH_DAYS, DUE_DAYS, freshnessFor, findByHostname };
})();
