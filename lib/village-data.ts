export interface OfficeHoursDay {
  day: string;
  dayIndex: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  hours: string;
  openTime: string; // "16:00"
  closeTime: string; // "18:00"
  note?: string;
}

export interface OfficialNotice {
  id: string;
  title: string;
  category: 'vyhlaska' | 'usneseni' | 'zamer' | 'rozpocet' | 'volby' | 'ostatni';
  fileNumber: string; // Č.j.
  publishedDate: string;
  expirationDate: string;
  description: string;
  fileSize?: string;
  downloadUrl?: string;
  status: 'active' | 'archived';
}

export interface VillageEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'kultura' | 'sport' | 'spolky' | 'obec' | 'pro-deti';
  description: string;
  organizer: string;
  admission?: string;
}

export interface WasteCollectionItem {
  type: 'plast' | 'papir' | 'komunal' | 'bio';
  name: string;
  color: string;
  accentClass: string;
  bgClass: string;
  borderClass: string;
  scheduleDescription: string;
  nextDate: string; // ISO date
  daysUntil: number;
}

export interface RadioAnnouncement {
  id: string;
  title: string;
  recordedAt: string;
  duration: string;
  audioSimulatedUrl: string;
  transcript: string;
  isImportant?: boolean;
}

export interface VillageClub {
  id: string;
  name: string;
  foundedYear: number;
  leader: string;
  membersCount: number;
  contact: string;
  description: string;
  activities: string[];
}

export const VILLAGE_DATA = {
  name: 'Obec Čehovice',
  cadastralCode: '619175',
  district: 'Prostějov',
  region: 'Olomoucký kraj',
  population: 520,
  firstWrittenMention: 1299,
  mayor: 'Milan Smékal',
  viceMayor: 'Ing. Radim Kovář',
  address: {
    street: 'Čehovice 80',
    zip: '798 17',
    municipality: 'Čehovice',
    gps: '49.4312° N, 17.1895° E',
  },
  registry: {
    ico: '00288101',
    dic: 'CZ00288101',
    dataBoxId: '3vgb2y3',
    bankAccount: '15024761/0100 (Komerční banka)',
  },
  contacts: {
    phone: '+420 582 373 723',
    mobile: '+420 724 182 455',
    email: 'obec@cehovice.cz',
    postOfficeEmail: 'podatelna@cehovice.cz',
    webUrl: 'https://cehovice.cz',
  },
  emergency: {
    sos: '112',
    fire: '150',
    ambulance: '155',
    police: '158',
    waterFailure: '+420 582 332 444 (Vodovody a kanalizace Prostějov)',
    gasFailure: '1239 (GasNet poruchy plynu)',
    electricityFailure: '800 22 55 77 (ČEZ Distribuce)',
  },
  officeHours: [
    {
      day: 'Pondělí',
      dayIndex: 1,
      hours: '16:00 – 18:00',
      openTime: '16:00',
      closeTime: '18:00',
      note: 'Úřední den pro veřejnost a ověřování podpisů',
    },
    {
      day: 'Úterý',
      dayIndex: 2,
      hours: 'Zavřeno',
      openTime: '',
      closeTime: '',
      note: 'Pouze po předchozí telefonické domluvě',
    },
    {
      day: 'Středa',
      dayIndex: 3,
      hours: '16:00 – 18:00',
      openTime: '16:00',
      closeTime: '18:00',
      note: 'Úřední den starosty a pokladny obce',
    },
    {
      day: 'Čtvrtek',
      dayIndex: 4,
      hours: 'Zavřeno',
      openTime: '',
      closeTime: '',
      note: 'Terénní šetření a administrativa',
    },
    {
      day: 'Pátek',
      dayIndex: 5,
      hours: 'Zavřeno',
      openTime: '',
      closeTime: '',
      note: 'Nestanovený úřední den',
    },
  ] as OfficeHoursDay[],
  wasteSchedule: [
    {
      type: 'plast',
      name: 'Plasty a tetrapacky',
      color: '#eab308',
      accentClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/30',
      scheduleDescription: 'Každé sudé úterý (žluté pytle / popelnice)',
      nextDate: '2026-09-22',
      daysUntil: 4,
    },
    {
      type: 'papir',
      name: 'Papír a lepenka',
      color: '#38bdf8',
      accentClass: 'text-sky-400',
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/30',
      scheduleDescription: 'Každou 1. středu v měsíci (modré kontejnery)',
      nextDate: '2026-10-07',
      daysUntil: 19,
    },
    {
      type: 'komunal',
      name: 'Směsný komunální odpad',
      color: '#94a3b8',
      accentClass: 'text-slate-300',
      bgClass: 'bg-slate-500/10',
      borderClass: 'border-slate-500/30',
      scheduleDescription: 'Každý pátek ráno (černé popelnice)',
      nextDate: '2026-09-25',
      daysUntil: 7,
    },
    {
      type: 'bio',
      name: 'Bioodpad & větve',
      color: '#22c55e',
      accentClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/30',
      scheduleDescription: 'Každé pondělí (duben–listopad, hnědé nádoby)',
      nextDate: '2026-09-21',
      daysUntil: 3,
    },
  ] as WasteCollectionItem[],
  latestRadioAnnouncement: {
    id: 'rozhlas-2026-09-17',
    title: 'Upozornění na plánované očkování psů proti vzteklině a svoz nebezpečného odpadu',
    recordedAt: '17. září 2026 v 17:30',
    duration: '1:45',
    audioSimulatedUrl: '/assets/rozhlas_sample.mp3',
    transcript:
      'Vážení občané, obecní úřad Čehovice oznamuje, že tuto sobotu 20. září proběhne u hasičské zbrojnice očkování psů proti vzteklině od 9:00 do 10:30. Současně bude přistaven velkoobjemový kontejner na nebezpečný odpad za kulturním domem. Žádáme majitele o předložení očkovacích průkazů.',
    isImportant: true,
  } as RadioAnnouncement,
  clubs: [
    {
      id: 'sdh',
      name: 'SDH Čehovice (Sbor dobrovolných hasičů)',
      foundedYear: 1891,
      leader: 'František Novák (velitel jednotky)',
      membersCount: 48,
      contact: 'sdh@cehovice.cz',
      description: 'Více než 135 let aktivní ochrany obce, zásahová jednotka JPO V, výchova mladých hasičů (Plamen) a organizace tradičního hasičského plesu i soutěže O pohár starosty obce.',
      activities: ['Zásahy při povodních a požárech', 'Mladí hasiči', 'Hasičský ples', 'Pálení čarodějnic'],
    },
    {
      id: 'rybari',
      name: 'Moravský rybářský svaz – pobočka Čehovice',
      foundedYear: 1968,
      leader: 'Jiří Dvořák',
      membersCount: 32,
      contact: 'rybari@cehovice.cz',
      description: 'Správa obecního rybníka "Pod Hrází", péče o rybí obsádku, jarní a podzimní výlovy a vyhlášené dětské rybářské závody s občerstvením.',
      activities: ['Péče o rybník Pod Hrází', 'Dětské rybářské závody', 'Tradiční uzení pstruhů', 'Ochrana biotopu'],
    },
    {
      id: 'zahradkari',
      name: 'Český zahrádkářský svaz Čehovice',
      foundedYear: 1974,
      leader: 'Věra Pospíšilová',
      membersCount: 27,
      contact: 'zahradkari@cehovice.cz',
      description: 'Provoz obecní moštárny ovoce v podzimních měsících, odborné přednášky o řezu ovocných stromů a každoroční výstava ovoce a zeleniny v sále KD.',
      activities: ['Provoz moštárny ovoce', 'Přednášky a semináře', 'Výstava výpěstků a vína', 'Zvelebování zeleně'],
    },
  ] as VillageClub[],
  historyAndMonuments: {
    foundation: 1299,
    summary:
      'Čehovice jsou malebná hanácká obec ležící v úrodné rovině Hané 6 km jihovýchodně od Prostějova. První písemná zmínka pochází již z roku 1299. Život obce byl historicky spjat s úrodným zemědělstvím a rybníkářstvím na potoce Vřesovka.',
    monuments: [
      {
        name: 'Kostel sv. Prokopa',
        era: 'Barokní stavba z let 1787–1789',
        description: 'Dominanta návsi se vzácným oltářním obrazem sv. Prokopa a historickými zvony ulitými v Olomouci.',
      },
      {
        name: 'Socha sv. Jana Nepomuckého',
        era: 'Rok 1742',
        description: 'Pískovcová barokní socha u mostku přes Vřesovku, zapsaná v ústředním seznamu kulturních památek ČR.',
      },
      {
        name: 'Pomník padlým v 1. a 2. světové válce',
        era: '1922 (obnoven 2018)',
        description: 'Důstojné pietní místo v parku před obecním úřadem připomínající čehovické občany.',
      },
      {
        name: 'Historická zvonička a kříže v katastru',
        era: '19. století',
        description: 'Soustava smírčích a polních křížů lemující staré úvozové cesty směrem na Bedihošť a Čelčice.',
      },
    ],
  },
  participatoryProjects: [
    {
      id: 'proj-1',
      title: 'Modernizace workoutového a dětského hřiště Pod Hrází',
      budget: '180 000 Kč',
      votes: 142,
      description: 'Doplnění bezpečnostního dopadového povrchu, nová houpačka pro nejmenší děti a venkovní cvičební prvky pro dospělé.',
      status: 'voting',
    },
    {
      id: 'proj-2',
      title: 'Solární LED osvětlení stezky k vlakové zastávce Bedihošť',
      budget: '250 000 Kč',
      votes: 189,
      description: 'Instalace 12 autonomních solárních sloupků s detekcí pohybu pro bezpečný návrat občanů z práce a dětí ze škol za šera.',
      status: 'voting',
    },
    {
      id: 'proj-3',
      title: 'Revitalizace zeleně a výsadba aleje starých hanáckých odrůd jabloní',
      budget: '95 000 Kč',
      votes: 114,
      description: 'Obnova větrolamu a výsadba 40 vysokokmenů podél polní cesty za humny, lavičky z masivu.',
      status: 'voting',
    },
  ],
  noticesSeed: [
    {
      id: 'deska-2026-001',
      title: 'Záměr obce Čehovice na pacht obecních pozemků parc. č. 452/3 v k.ú. Čehovice',
      fileNumber: 'ČEH/089/2026',
      category: 'zamer',
      publishedDate: '12. září 2026',
      expirationDate: '28. září 2026',
      description: 'Zveřejnění záměru obce pronajmout zemědělský pozemek o výměře 4 820 m² pro hospodaření v souladu s péčí řádného hospodáře.',
      fileSize: '240 kB PDF',
      status: 'active',
    },
    {
      id: 'deska-2026-002',
      title: 'Návrh střednědobého výhledu rozpočtu obce Čehovice na období 2027–2029',
      fileNumber: 'ČEH/084/2026',
      category: 'rozpocet',
      publishedDate: '8. září 2026',
      expirationDate: '30. září 2026',
      description: 'Návrh finančního plánu investic a provozu obce, plánované kofinancování dotačních titulů z Národního plánu obnovy.',
      fileSize: '512 kB PDF',
      status: 'active',
    },
    {
      id: 'deska-2026-003',
      title: 'Obecně závazná vyhláška č. 2/2026 o místním poplatku ze psů',
      fileNumber: 'OZV 2/2026',
      category: 'vyhlaska',
      publishedDate: '1. září 2026',
      expirationDate: '1. října 2026',
      description: 'Aktualizace sazebníku poplatku za jednoho a dalšího psa, osvobození pro držitele průkazů ZTP a seniory nad 65 let.',
      fileSize: '185 kB PDF',
      status: 'active',
    },
    {
      id: 'deska-2026-004',
      title: 'Usnesení z 18. zasedání Zastupitelstva obce Čehovice konaného dne 28. srpna 2026',
      fileNumber: 'ČEH/081/2026',
      category: 'usneseni',
      publishedDate: '30. srpna 2026',
      expirationDate: '15. října 2026',
      description: 'Schválení účetní závěrky, rozpočtových opatření č. 4/2026 a smlouvy o dílo na opravu místní komunikace u rybníka.',
      fileSize: '390 kB PDF',
      status: 'active',
    },
  ] as OfficialNotice[],
  eventsSeed: [
    {
      id: 'ev-1',
      title: 'Tradiční Čehovické vinobraní a burčákobraní',
      date: 'Sobota 26. září 2026',
      time: '14:00 – 23:00',
      location: 'Kulturní dům Čehovice a přilehlá zahrada',
      category: 'kultura',
      description: 'Ochutnávka moravských vín a čerstvého burčáku, cimbálová muzika, hanácké koláče a soutěž o nejlepší domácí štrúdl.',
      organizer: 'Obec Čehovice a Zahrádkáři',
      admission: 'Vstupné dobrovolné',
    },
    {
      id: 'ev-2',
      title: 'Dětské rybářské závody Pod Hrází',
      date: 'Sobota 3. října 2026',
      time: '08:00 – 12:30',
      location: 'Obecní rybník Pod Hrází',
      category: 'sport',
      description: 'Závody pro děti do 15 let. Ceny pro všechny účastníky, občerstvení zajištěno (pečené klobásy, nealko pivo pro doprovod).',
      organizer: 'MRS Čehovice',
      admission: 'Startovné 50 Kč',
    },
    {
      id: 'ev-3',
      title: 'Hasičské námětové cvičení okrsku Prostějov-jih',
      date: 'Neděle 11. října 2026',
      time: '09:30 – 13:00',
      location: 'Náves a areál ZD Čehovice',
      category: 'spolky',
      description: 'Ukázka zásahu s historickou i moderní technikou, dálková doprava vody a ukázka vyprošťování osob pro veřejnost.',
      organizer: 'SDH Čehovice',
      admission: 'Zdarma',
    },
    {
      id: 'ev-4',
      title: 'Lampionový průvod a dýňové strašení',
      date: 'Pátek 30. října 2026',
      time: '17:30 – 19:30',
      location: 'Sraz před mateřskou školou, cíl v parku',
      category: 'pro-deti',
      description: 'Průvod obcí se svítícími lampiony, teplý čaj pro děti a svařené víno pro rodiče, opékání špekáčků.',
      organizer: 'Klub maminek a ZŠ/MŠ',
      admission: 'Zdarma',
    },
  ] as VillageEvent[],
  lifeSituations: [
    {
      id: 'poplatek-pes',
      title: 'Místní poplatek ze psů',
      description: 'Přihlášení psa do evidence, výše poplatku (200 Kč / rok v rodinném domě, 100 Kč pro důchodce) a platba online přes QR kód.',
      steps: [
        'Vyplňte evidenční lístek psa (k dispozici online nebo na úřadě).',
        'Předložte očkovací průkaz psa s platným očkováním proti vzteklině.',
        'Uhraďte poplatek na účet obce 15024761/0100 s variabilním symbolem (číslo popisné + 1341) nebo kartou na úřadě.',
        'Obdržíte trvalou evidenční známku na obojek psa.',
      ],
      fee: '200 Kč / rok (100 Kč důchodci)',
      legalBasis: 'OZV č. 2/2026',
    },
    {
      id: 'odpady-poplatek',
      title: 'Poplatek za komunální odpad',
      description: 'Roční poplatek za odkládání komunálního odpadu pro trvale hlášené občany i vlastníky rekreačních nemovitostí.',
      steps: [
        'Splatnost poplatku je do 31. března příslušného kalendářního roku.',
        'Sazba činí 650 Kč na osobu s trvalým pobytem v obci.',
        'Možnost platby bezhotovostně QR kódem vygenerovaným v portálu nebo v hotovosti v úředních hodinách.',
        'Po zaplacení obdržíte kontrolní známku na popelnici pro daný rok.',
      ],
      fee: '650 Kč / osoba / rok (děti do 3 let zdarma)',
      legalBasis: 'OZV č. 1/2025',
    },
    {
      id: 'overovani-listin',
      title: 'Ověřování podpisů a listin (Vidimace a Legalizace)',
      description: 'Úřední ověření shody opisů listin s originálem a ověření pravosti podpisu na smlouvách a plných mocech.',
      steps: [
        'Dostavte se osobně v úřední dny (Pondělí, Středa 16:00 – 18:00).',
        'Předložte platný doklad totožnosti (občanský průkaz nebo cestovní pas).',
        'Pro legalizaci se podepisujete přímo před úředníkem nebo uznáte podpis za vlastní.',
        'Správní poplatek činí 50 Kč za každý podpis nebo 30 Kč za stránku ověřené listiny.',
      ],
      fee: '50 Kč / podpis, 30 Kč / strana A4',
      legalBasis: 'Zákon č. 634/2004 Sb., o správních poplatcích',
    },
    {
      id: 'kaceni-drevin',
      title: 'Povolení ke kácení dřevin rostoucích mimo les',
      description: 'Žádost o povolení kácení stromů na soukromém pozemku s obvodem kmene nad 80 cm měřeno ve výšce 130 cm.',
      steps: [
        'Stáhněte a vyplňte žádost o kácení dřevin v sekci Formuláře.',
        'K žádosti přiložte situační náčrtek s vyznačením stromu a doložte vlastnické právo k pozemku.',
        'Uveďte důvod kácení (zdravotní stav, ohrožení stavby, bezpečnost).',
        'Obecní úřad provede místní šetření a do 30 dnů vydá rozhodnutí (kácení probíhá v době vegetačního klidu od 1. 10. do 31. 3.).',
      ],
      fee: 'Bez poplatku',
      legalBasis: 'Zákon č. 114/1992 Sb., o ochraně přírody a krajiny',
    },
    {
      id: 'pronajem-kd',
      title: 'Pronájem kulturního domu Čehovice',
      description: 'Krátkodobý pronájem sálu nebo přísálí pro rodinné oslavy, svatby, schůze a firemní prezentace.',
      steps: [
        'Ověřte volný termín v kalendáři na webu nebo u správce KD.',
        'Podejte elektronickou žádost přes podatelnu portálu minimálně 14 dní předem.',
        'Podepište smlouvu o nájmu a složte vratnou kauci 2 000 Kč.',
        'Předání prostor probíhá den před akcí se zápisem o stavu elektroměru a inventáře.',
      ],
      fee: '1 500 Kč / den (pro občany Čehovic sleva 50 %)',
      legalBasis: 'Ceník schválený Zastupitelstvem obce',
    },
  ],
};
