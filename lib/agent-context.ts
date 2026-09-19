/**
 * Unified Agent Context & Knowledge Provider for 'Obec Čehovice Online 2027'
 * Strictly conforms to /public/llms.txt, cehovice-agent-kit, and municipal records.
 * Ensures that Anička, ČDP-starosta, MCP Server, and PTC Engine share an identical source of truth.
 */

import { VILLAGE_DATA } from './village-data';

export interface MunicipalFacts {
  name: string;
  population: number;
  cadastralCode: string;
  district: string;
  region: string;
  firstWrittenMention: number;
  mayor: string;
  viceMayor: string;
  address: string;
  registry: {
    ico: string;
    dic: string;
    dataBoxId: string;
    bankAccount: string;
  };
  contacts: {
    phone: string;
    mobile: string;
    email: string;
    podatelna: string;
    web: string;
  };
  officeHoursPublic: string;
  wasteSchedule: {
    plastics: string;
    paper: string;
    communal: string;
    bio: string;
  };
  fees: {
    dog: string;
    waste: string;
    paymentInfo: string;
  };
  securityAndGov: {
    nis2Code: string;
    zeroTrustTarget: string;
    statutoryDeadlineDays: number;
    auditLogRetention: string;
  };
}

export const UNIFIED_MUNICIPAL_FACTS: MunicipalFacts = {
  name: 'Obec Čehovice',
  population: 520,
  cadastralCode: '619175',
  district: 'Prostějov',
  region: 'Olomoucký kraj',
  firstWrittenMention: 1299,
  mayor: 'Milan Smékal',
  viceMayor: 'Ing. Radim Kovář',
  address: 'Čehovice 80, 798 17 Čehovice',
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
    podatelna: 'podatelna@cehovice.cz',
    web: 'https://cehovice.cz',
  },
  officeHoursPublic: 'Pondělí 16:00–18:00 a Středa 16:00–18:00 (v ostatní dny po předchozí domluvě)',
  wasteSchedule: {
    plastics: 'Každé sudé úterý (žluté pytle / popelnice)',
    paper: 'Každou 1. středu v měsíci (modré kontejnery)',
    communal: 'Každý pátek ráno (černé popelnice)',
    bio: 'Každé pondělí (duben–listopad, hnědé nádoby)',
  },
  fees: {
    dog: '200 Kč/rok za 1. psa v rodinném domě (100 Kč pro seniory a důchodce nad 65 let, 300 Kč za každého dalšího)',
    waste: '650 Kč/osoba/rok (děti do 3 let zdarma), splatnost do 31. května',
    paymentInfo: 'Číslo účtu 15024761/0100, variabilní symbol = číslo popisné nemovitosti',
  },
  securityAndGov: {
    nis2Code: 'CZ-NIS2-VS-79817-00288101',
    zeroTrustTarget: '98/100',
    statutoryDeadlineDays: 30,
    auditLogRetention: '5 let (spisový a skartační řád)',
  },
};

/**
 * Machine-readable Text Representation directly mirroring /public/llms.txt
 */
export const UNIFIED_LLMS_TXT_CONTENT = `# Portál Čehovice — jednotný kontext pro AI agenty

> Obec Čehovice (okres Prostějov, Olomoucký kraj, 520 obyvatel, IČO 00288101, Katastr 619175, založeno 1299)
> Provozuje moderní digitální portál 'Obec Čehovice Online 2027' s AI asistentkou Aničkou, jádrem Titan a otevřeným rozhraním pro agenty.

## Identifikace a vedení obce
- Starosta: Milan Smékal (mobil: +420 724 182 455, tel: +420 582 373 723)
- Místostarosta: Ing. Radim Kovář
- Obecní úřad: Čehovice 80, 798 17 Čehovice
- IČO: 00288101, Datová schránka: 3vgb2y3 (záložní: kdmbren)
- E-maily: obec@cehovice.cz, podatelna@cehovice.cz, Web: https://cehovice.cz
- Úřední hodiny pro veřejnost: Pondělí 16:00–18:00, Středa 16:00–18:00

## Poplatky a svoz odpadů
- Odpady: Plasty (sudé úterý), Papír (1. středa v měsíci), Komunální (pátek ráno), Bioodpad (pondělí). Poplatek 650 Kč/osoba/rok.
- Poplatek ze psů: 200 Kč za 1. psa (100 Kč pro seniory nad 65 let).
- Platby: Účet 15024761/0100, VS = číslo popisné domu.

## Památky a spolky
- Kostel sv. Prokopa (1787–1789), socha sv. Jana Nepomuckého (1742 u Vřesovky).
- Spolky: SDH Čehovice (hasiči od 1891), Moravský rybářský svaz (rybník Pod Hrází), Český zahrádkářský svaz (obecní moštárna).

## Bezpečnost, NIS2 a pravidla pro agenty
- Human-in-the-loop: Žádný zápis ani alert se nezveřejní bez autorizace starostou/administrátorem (/admin).
- Fail-closed: Všechna API bez platného tajemství/tokenu odmítnou přístup.
- GDPR: IP adresy se logují pouze jako SHA-256 hash. Osobní údaje se v logách nezaznamenávají.
- Zákonné lhůty: 30 dnů pro vyřízení podání občanů.`;

export type AgentRole = 'anicka' | 'cdp_starosta' | 'mcp' | 'ptc_engine';

/**
 * Builds the unified system instruction for any agent type.
 */
export function getUnifiedAgentSystemPrompt(
  role: AgentRole,
  options?: { currentPage?: string; userContext?: string }
): string {
  const baseHeader = `${UNIFIED_LLMS_TXT_CONTENT}\n\n`;

  switch (role) {
    case 'anicka':
      return `${baseHeader}Úloha: Jsi Anička, laskavá, přesná a deterministická oficiální AI průvodkyně občanů na portálu 'Obec Čehovice Online 2027'.
Pravidla komunikace:
1. Mluv přirozenou, spisovnou, vstřícnou češtinou.
2. Vycházej VÝHRADNĚ z výše uvedených faktů o obci Čehovice. Nikdy si nevymýšlej ani nehalucinuj.
3. Pokud občan potřebuje konkrétní formulář, poskytni Markdown odkaz:
   - [Nahlásit závadu](/nahlasit-zavadu)
   - [Digitální podatelna](/podatelna)
   - [Úřední deska](/urad)
   - [Krizové varování](/varovani)
   - [Spolky a historie](/spolky)
Aktuální stránka návštěvníka: ${options?.currentPage || '/'}.`;

    case 'cdp_starosta':
      return `${baseHeader}Úloha: Jsi ČDP-starosta, exekutivní digitální poradce starosty obce Milana Smékala v rámci platformy Titan Core.
Pravidla komunikace:
1. Odpovídej věcně, uctivě a operativně bez technického žargonu.
2. Zvýrazňuj klíčová čísla, termíny a finanční částky.
3. Všechny návrhy exekutivních akcí (schválení záměrů, rozhlasová hlášení, bezpečnostní remediace) předkládej k finálnímu schválení starostou (Human-in-the-Loop).`;

    case 'mcp':
      return `${baseHeader}Úloha: Model Context Protocol (MCP) server obce Čehovice. Poskytuje strukturovaná data nástrojů pro LLM agenty s nulovou tolerancí k neověřeným datům.`;

    case 'ptc_engine':
      return `${baseHeader}Úloha: Programmatic Tool Calling (PTC) Engine. Sestavuj deterministické JSON sekvence volání nástrojů z allowlistu.`;
  }
}

/**
 * Deterministic Answer Router — shared by Anička, MCP, and search fallback.
 */
export function getDeterministicFaqAnswer(query: string): string | null {
  const q = query.toLowerCase();

  if (q.includes('popelnic') || q.includes('odpad') || q.includes('svoz') || q.includes('plast') || q.includes('papír') || q.includes('bio')) {
    return `🗑️ **Svoz odpadu v Čehovicích (harmonogram):**\n- **Plasty (žluté pytle / popelnice):** ${UNIFIED_MUNICIPAL_FACTS.wasteSchedule.plastics}.\n- **Bioodpad (hnědé nádoby):** ${UNIFIED_MUNICIPAL_FACTS.wasteSchedule.bio}.\n- **Směsný komunální odpad (černé nádoby):** ${UNIFIED_MUNICIPAL_FACTS.wasteSchedule.communal}.\n- **Papír (modré kontejnery):** ${UNIFIED_MUNICIPAL_FACTS.wasteSchedule.paper}.\n\nPoplatek za odpad činí **${UNIFIED_MUNICIPAL_FACTS.fees.waste}**. ${UNIFIED_MUNICIPAL_FACTS.fees.paymentInfo}.`;
  }

  if (q.includes('otevřen') || q.includes('úřední hodin') || q.includes('kdy má') || q.includes('hodin') || q.includes('starost')) {
    return `🏛️ **Úřední hodiny Obecního úřadu Čehovice pro veřejnost:**\n- **Pondělí: 16:00 – 18:00** (ověřování podpisů, matrika, starosta Milan Smékal)\n- **Středa: 16:00 – 18:00** (pokladna, starosta, stavební záležitosti)\n- *Úterý, Čtvrtek, Pátek:* zavřeno pro veřejnost (po předchozí domluvě na tel. ${UNIFIED_MUNICIPAL_FACTS.contacts.phone}).\n\nStarostou obce je **${UNIFIED_MUNICIPAL_FACTS.mayor}** (mobil ${UNIFIED_MUNICIPAL_FACTS.contacts.mobile}).`;
  }

  if (q.includes('pes') || q.includes('psa') || q.includes('psů')) {
    return `🐕 **Místní poplatek ze psů v Čehovicích:**\n- **${UNIFIED_MUNICIPAL_FACTS.fees.dog}**.\n- ${UNIFIED_MUNICIPAL_FACTS.fees.paymentInfo}.\n- Přihlásit psa lze osobně na úřadě nebo online přes [Digitální podatelnu](/podatelna).`;
  }

  if (q.includes('závad') || q.includes('lampa') || q.includes('díra') || q.includes('výtluk') || q.includes('strom') || q.includes('nesvítí')) {
    return `⚠️ **Hlášení závad:**\nZávadu na veřejném osvětlení, komunikaci či zeleni můžete okamžitě nahlásit přes online formulář [Nahlásit závadu](/nahlasit-zavadu). Obdržíte identifikační kód pro sledování postupu opravy technickou četou obce.`;
  }

  if (q.includes('podateln') || q.includes('žádost') || q.includes('106') || q.includes('stížnost')) {
    return `📨 **Digitální podatelna Čehovic:**\nElektronické podání žádosti, dotaz dle zákona č. 106/1999 Sb. nebo podnět můžete podat online na stránce [Digitální podatelna](/podatelna). Každé podání získá trasovací kód a lhůta pro vyřízení je do ${UNIFIED_MUNICIPAL_FACTS.securityAndGov.statutoryDeadlineDays} dnů.`;
  }

  if (q.includes('kontakt') || q.includes('telefon') || q.includes('mail') || q.includes('ičo') || q.includes('datov') || q.includes('adresa')) {
    return `📞 **Oficiální kontakty obce Čehovice:**\n- **Adresa:** ${UNIFIED_MUNICIPAL_FACTS.address}\n- **Telefon:** ${UNIFIED_MUNICIPAL_FACTS.contacts.phone}\n- **Mobil starosty:** ${UNIFIED_MUNICIPAL_FACTS.contacts.mobile}\n- **E-mail:** ${UNIFIED_MUNICIPAL_FACTS.contacts.email}, ${UNIFIED_MUNICIPAL_FACTS.contacts.podatelna}\n- **Datová schránka:** \`${UNIFIED_MUNICIPAL_FACTS.registry.dataBoxId}\`\n- **IČO:** ${UNIFIED_MUNICIPAL_FACTS.registry.ico}`;
  }

  if (q.includes('hasič') || q.includes('sdh') || q.includes('rybář') || q.includes('zahrádkář') || q.includes('spolk')) {
    return `👥 **Spolky v obci Čehovice:**\n- **SDH Čehovice (hasiči):** založeno 1891, velitel František Novák.\n- **Moravský rybářský svaz:** správa rybníka Pod Hrází, závody pro děti, předseda Jiří Dvořák.\n- **Český zahrádkářský svaz:** provoz moštárny ovoce, výstavy, předsedkyně Věra Pospíšilová.\nVíce informací najdete na stránce [Spolky a organizace](/spolky).`;
  }

  if (q.includes('historie') || q.includes('založen') || q.includes('kostel') || q.includes('památk')) {
    return `🏰 **Historie obce Čehovice:**\nPrvní písemná zmínka pochází z roku **${UNIFIED_MUNICIPAL_FACTS.firstWrittenMention}**. Hlavní dominantou je pozdně barokní **Kostel sv. Prokopa** z let 1787–1789 s historickými zvony a pískovcová socha sv. Jana Nepomuckého z roku 1742 u mostku přes Vřesovku. Podrobnosti naleznete na stránce [O obci Čehovice](/obec).`;
  }

  return null;
}
