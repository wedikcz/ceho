import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { VILLAGE_DATA } from '@/lib/village-data';

// Deterministic RAG Knowledge Context
const MUNICIPAL_KNOWLEDGE = `
Jsi Anička, oficiální digitální asistentka a AI průvodkyně obce Čehovice (okres Prostějov, Olomoucký kraj, 520 obyvatel, založeno 1299).
Vystupuješ laskavě, věcně, spisovnou češtinou, vždy přesně a deterministicky podle obecních dat. Nikdy si nevymýšlíš.
Pokud se občan ptá na něco mimo obec, ochotně ho odkaž na příslušný úřad či linku.

Základní fakta o obci Čehovice:
- Starosta: Milan Smékal
- Místostarosta: Ing. Radim Kovář
- Adresa úřadu: Čehovice 80, 798 17 Čehovice
- IČO: 00288101, Datová schránka: 3vgb2y3, Bankovní účet: 15024761/0100 (Komerční banka)
- Telefon: +420 582 373 723, Mobil: +420 724 182 455, E-mail: obec@cehovice.cz, podatelna@cehovice.cz
- Úřední hodiny pro veřejnost: Pondělí 16:00 – 18:00 a Středa 16:00 – 18:00. V ostatní dny po předchozí domluvě.

Svoz odpadu (kalendář):
- Plasty (žluté pytle/popelnice): každé sudé úterý (nejbližší úterý 22. září 2026)
- Papír (modré kontejnery): každou 1. středu v měsíci (7. října 2026)
- Směsný komunální odpad (černé popelnice): každý pátek ráno
- Bioodpad (hnědé nádoby): každé pondělí (duben–listopad)

Poplatky:
- Pes: 200 Kč / rok za psa v rodinném domě (100 Kč pro seniory a důchodce nad 65 let). Splatnost do 31. března.
- Komunální odpad: 650 Kč / osoba / rok (děti do 3 let zdarma).
- Platby na účet 15024761/0100, variabilní symbol = číslo popisné domu (např. 80).

Spolky:
- SDH Čehovice (hasiči, zal. 1891, velitel František Novák, mladí hasiči Plamen, ples)
- Moravský rybářský svaz Čehovice (správa rybníka Pod Hrází, závody, Jiří Dvořák)
- Český zahrádkářský svaz (provoz obecní moštárny, výstavy, Věra Pospíšilová)

Památky a historie:
- První písemná zmínka: 1299. Dominanta je barokní Kostel sv. Prokopa z let 1787–1789 a socha sv. Jana Nepomuckého z roku 1742 u potoka Vřesovka.

Krizové kontakty:
- Tísňová linka: 112, Hasiči: 150, Záchranka: 155, Policie: 158
- Poruchy vody: +420 582 332 444 (VaK Prostějov), Plyn: 1239 (GasNet), Elektřina: 800 22 55 77 (ČEZ)

Pokud uživatel chce nahlásit závadu nebo podat žádost, nabídni mu přímý proklik na příslušnou stránku:
[Nahlásit závadu](/nahlasit-zavadu)
[Přejít do digitální podatelny](/podatelna)
[Zobrazit úřední desku](/urad)
[Registrovat SMS/e-mail varování](/varovani)
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, currentPage } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Zpráva je prázdná' }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // Fast Deterministic Local Fallback Router for instant response or if API key not available
    const getLocalDeterministicAnswer = (query: string): string | null => {
      if (query.includes('popelnic') || query.includes('odpad') || query.includes('svoz') || query.includes('plast') || query.includes('papír') || query.includes('bio')) {
        return `🗑️ **Svoz odpadu v Čehovicích:**\n- **Plasty (žluté):** Každé sudé úterý (nejbližší: úterý 22. září 2026).\n- **Bioodpad (hnědé):** Každé pondělí ráno.\n- **Směsný odpad (černé popelnice):** Každý pátek ráno.\n- **Papír (modré):** 1. středa v měsíci (7. října 2026).\n\nPoplatek za odpad činí **650 Kč / osoba / rok** na účet 15024761/0100 s variabilním symbolem vašeho čísla popisného.`;
      }
      if (query.includes('otevřen') || query.includes('úřední hodin') || query.includes('kdy má') || query.includes('hodin') || query.includes('starost')) {
        return `🏛️ **Úřední hodiny Obecního úřadu Čehovice pro veřejnost:**\n- **Pondělí: 16:00 – 18:00** (ověřování podpisů, matrika, starosta)\n- **Středa: 16:00 – 18:00** (pokladna, starosta, stavební záležitosti)\n- *Úterý, Čtvrtek, Pátek:* zavřeno pro veřejnost (po předchozí domluvě na tel. +420 582 373 723).\n\nStarostou obce je **Milan Smékal** (mobil +420 724 182 455).`;
      }
      if (query.includes('pes') || query.includes('psa') || query.includes('psů')) {
        return `🐕 **Místní poplatek ze psů v Čehovicích:**\n- **200 Kč / rok** za jednoho psa v rodinném domě.\n- **100 Kč / rok** pro poživatele invalidního, starobního nebo vdovského důchodu nad 65 let.\n- Číslo účtu obce: **15024761/0100**, jako variabilní symbol uveďte vaše **číslo popisné**.\n- Přihlásit psa můžete v úředních hodinách na úřadě nebo přes [Digitální podatelnu](/podatelna).`;
      }
      if (query.includes('závad') || query.includes('lampa') || query.includes('díra') || query.includes('výtluk') || query.includes('strom') || query.includes('rozbit')) {
        return `⚠️ **Hlášení závad:**\nZávadu na veřejném osvětlení, komunikaci či zeleni můžete okamžitě odeslat s fotografií a GPS polohou přes formulář [Nahlásit závadu](/nahlasit-zavadu). Technická četa obce závadu zaeviduje a obdržíte sledovací status.`;
      }
      if (query.includes('podateln') || query.includes('žádost') || query.includes('106') || query.includes('stížnost')) {
        return `📨 **Digitální podatelna Čehovic:**\nPodání žádosti, dotaz dle zákona č. 106/1999 Sb. nebo jiný podnět můžete podat online na stránce [Digitální podatelna](/podatelna). Každé podání získá trasovací kód (např. CEH-2026-XXXX) a lhůta pro vyřízení je do 30 dnů.`;
      }
      if (query.includes('kontakt') || query.includes('telefon') || query.includes('mail') || query.includes('ičo') || query.includes('datov')) {
        return `📞 **Oficiální kontakty obce Čehovice:**\n- **Adresa:** Čehovice 80, 798 17 Čehovice\n- **Telefon úřadu:** +420 582 373 723\n- **Mobil starosty (Milan Smékal):** +420 724 182 455\n- **E-mail:** obec@cehovice.cz, podatelna@cehovice.cz\n- **Datová schránka:** \`3vgb2y3\`\n- **IČO:** 00288101`;
      }
      if (query.includes('hasič') || query.includes('sdh') || query.includes('rybář') || query.includes('zahrádkář') || query.includes('spolk')) {
        return `👥 **Spolky v obci Čehovice:**\n- **SDH Čehovice (hasiči):** založeno 1891, velitel František Novák.\n- **Moravský rybářský svaz:** správa rybníka Pod Hrází, závody pro děti, předseda Jiří Dvořák.\n- **Český zahrádkářský svaz:** provoz moštárny ovoce, výstavy, předsedkyně Věra Pospíšilová.\nVíce informací naleznete v sekci [Spolky a organizace](/spolky).`;
      }
      if (query.includes('historie') || query.includes('založen') || query.includes('kostel') || query.includes('památk')) {
        return `🏰 **Historie obce Čehovice:**\nPrvní písemná zmínka pochází z roku **1299**. Obec má v současnosti 520 obyvatel. Hlavní památkou je pozdně barokní **Kostel sv. Prokopa** z let 1787–1789 s historickými zvony a pískovcová socha sv. Jana Nepomuckého z roku 1742 u mostku přes potok Vřesovka. Podrobnosti na stránce [O obci Čehovice](/obec).`;
      }
      return null;
    };

    // If Gemini API Key exists, call Gemini model with system instruction
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `${MUNICIPAL_KNOWLEDGE}\nAktuální stránka, kde se občan nachází: ${currentPage || '/'}.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `Kontext dotazu: Uživatel je na portálu obce Čehovice. Otázka: ${message}` }],
            },
          ],
          config: {
            systemInstruction: { parts: [{ text: systemInstruction }] },
            temperature: 0.2, // Low temperature for high factual accuracy
          },
        });

        const reply = response.text || 'Omlouvám se, nepodařilo se mi vygenerovat odpověď. Zkuste to prosím znovu.';
        return NextResponse.json({ reply, source: 'gemini-2.5-flash' });
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to deterministic municipal engine:', err);
      }
    }

    // Deterministic fallback response
    const localAnswer = getLocalDeterministicAnswer(lower);
    if (localAnswer) {
      return NextResponse.json({ reply: localAnswer, source: 'cehovice-deterministic-rag' });
    }

    // Default polite municipal guidance
    return NextResponse.json({
      reply: `Děkuji za váš dotaz. Jsem Anička, asistentka obce Čehovice. K tomuto tématu vám doporučuji navštívit sekci [Úřední deska a vyhlášky](/urad), podat dotaz přes [Digitální podatelnu](/podatelna) nebo kontaktovat starostu Milana Smékala v úředních hodinách (Pondělí a Středa 16:00 – 18:00) na tel. **+420 582 373 723**.`,
      source: 'cehovice-general-rag',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chyba serveru' }, { status: 500 });
  }
}
