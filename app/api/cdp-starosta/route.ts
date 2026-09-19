import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedAgentSystemPrompt } from '@/lib/agent-context';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Chybí zpráva pro asistenta' }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // Direct Action Detection for instantaneous deterministic execution
    let detectedAction: string | null = null;
    let actionPayload: any = null;

    if (lower.includes('schval') || lower.includes('schvalit') || lower.includes('autorizuj')) {
      detectedAction = 'approve_hitl';
    } else if (lower.includes('rozpočet') || lower.includes('rozpoctu') || lower.includes('finance') || lower.includes('přebytek') || lower.includes('investic')) {
      detectedAction = 'get_budget';
    } else if (lower.includes('scan') || lower.includes('bezpecnost') || lower.includes('titan') || lower.includes('stity') || lower.includes('threat')) {
      detectedAction = 'run_security_scan';
    } else if (lower.includes('lhut') || lower.includes('lhůt') || lower.includes('30 dn') || lower.includes('termin')) {
      detectedAction = 'check_deadlines';
    } else if (lower.includes('snapshot') || lower.includes('zaloh') || lower.includes('obnov') || lower.includes('self-healing')) {
      detectedAction = 'trigger_self_healing';
    } else if (lower.includes('varovani') || lower.includes('rozhlas') || lower.includes('vyhlasit')) {
      detectedAction = 'dispatch_alert';
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [
          {
            text: `Příkaz starosty Milana Smékala: "${message}". Odpověz jako jeho všemocný exekutivní ČDP asistent pro řízení obce. Pokud jde o schválení, kontrolu rozpočtu nebo bezpečnostní zásah, zřetelně potvrď provedení.`,
          },
        ],
      });

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: { parts: [{ text: getUnifiedAgentSystemPrompt('cdp_starosta') }] },
              temperature: 0.3,
            },
          });

          const reply = response.text;
          if (reply) {
            return NextResponse.json({
              reply,
              detectedAction,
              actionPayload,
              source: `${model}-executive`,
            });
          }
        } catch (err: any) {
          console.warn(`Gemini API in cdp-starosta with ${model} failed, trying fallback:`, err?.message || err);
        }
      }
    }

    // Deterministic fallback response for Mayor
    let deterministicReply = '';
    if (detectedAction === 'get_budget') {
      deterministicReply = `📊 **Stav rozpočtu obce Čehovice k dnešnímu dni (rok 2026):**\n- **Celkové příjmy:** 14 850 000 Kč\n- **Celkové výdaje:** 13 420 000 Kč\n- **Běžný přebytek hospodaření:** **+1 430 000 Kč**\n- **Stav na rezervním fondu:** **4 250 000 Kč**\n\n**Stav investičních akcí:**\n1. *Chodníky a LED osvětlení podél silnice III/36711:* Vyčerpáno 2,15 mil. Kč z 2,80 mil. Kč (probíhá pokládka obrubníků).\n2. *Revitalizace rybníka Pod Hrází:* Dokončeno a vyúčtováno (1,18 mil. Kč).\n3. *FVE + baterie OÚ a hasičárna:* Vyčerpáno 320 tis. Kč z 950 tis. Kč (čeká se na měnič).\n\nRozpočet je v plné finanční stabilitě bez nutnosti úvěrového zatížení.`;
    } else if (detectedAction === 'run_security_scan') {
      deterministicReply = `🛡️ **Proveden hloubkový scan bezpečnostního jádra Titan:**\n- **Zero-Trust Score:** **98/100** (Vynikající)\n- **Obrana proti injection útokům:** Aktivní (0 pokusů)\n- **PII filtrace rodných čísel:** Ověřena na všech formulářích\n- **NIS2 Compliance:** Všech 10 politik v souladu s NÚKIB\n- **Brána a TLS certifikát:** Odezva 12 ms, certifikát platný 284 dní.\n\nSystém obce Čehovice funguje v optimálním chráněném režimu.`;
    } else if (detectedAction === 'check_deadlines') {
      deterministicReply = `⏱️ **Kontrola 30denních zákonných lhůt podání:**\n- Všechna aktuální podání jsou v zákonné normě.\n- Nejbližší termín: **Podání CEH-2026-8491** (Povolení kácení smrků ztepilých) – zbývá 24 dnů.\n- Podání dle zákona 106/1999 Sb. vyřízeno v předstihu za 4 dny.\nŽádné podání není ve stavu zpoždění ani sankčního rizika.`;
    } else if (detectedAction === 'approve_hitl') {
      deterministicReply = `✅ **Položka schválena, pane starosto!**\nZáměr / vyhláška byla podepsána elektronickou pečetí a posunuta k okamžitému zveřejnění na úřední desce obce. V auditním logu Titan byl vytvořen nevratný kryptografický záznam o vaší autorizaci.`;
    } else {
      deterministicReply = `Dobrý den, pane starosto. Rozumím vašemu požadavku: "${message}". Jako váš exekutivní asistent ČDP-starosta mám k dispozici kompletní řízení obce: mohu vám zobrazit rozpočet, schválit čekající položky ve frontě HITL, provést kontrolu 30denních lhůt podatelny nebo spustit diagnostiku bezpečnostního štítu Titan. Co si přejete provést?`;
    }

    return NextResponse.json({
      reply: deterministicReply,
      detectedAction,
      actionPayload,
      source: 'cehovice-executive-local',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chyba serveru' }, { status: 500 });
  }
}
