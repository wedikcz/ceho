import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getUnifiedAgentSystemPrompt, getDeterministicFaqAnswer } from '@/lib/agent-context';

export async function POST(req: NextRequest) {
  try {
    const { message, currentPage, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Zpráva je prázdná' }, { status: 400 });
    }

    // Fast Deterministic Local Fallback Router from unified agent context
    const fastFaqAnswer = getDeterministicFaqAnswer(message);

    // If Gemini API Key exists, call Gemini model with unified system instruction
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

      const systemInstruction = getUnifiedAgentSystemPrompt('anicka', { currentPage });

      // Build conversation contents including history
      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-4)) {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text || h.content || '' }],
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: `Kontext dotazu: Uživatel je na stránce "${currentPage || '/'}". Otázka občana: ${message}` }],
      });

      // Try primary model (gemini-3.8-flash) and fallback model (gemini-3.1-flash-lite)
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: { parts: [{ text: systemInstruction }] },
              temperature: 0.2, // Low temperature for high factual accuracy
            },
          });

          const reply = response.text || fastFaqAnswer;
          if (reply) {
            return NextResponse.json({ reply, source: model });
          }
        } catch (err: any) {
          console.warn(`Gemini API call with ${model} failed, trying next fallback:`, err?.message || err);
        }
      }
    }

    // Deterministic fallback response
    if (fastFaqAnswer) {
      return NextResponse.json({
        reply: fastFaqAnswer,
        source: 'deterministic-unified-knowledge',
      });
    }

    return NextResponse.json({
      reply: `Dobrý den! Jsem Anička, digitální asistentka obce Čehovice. Ráda vám pomohu s informacemi o svozu odpadu, úředních hodinách starosty Milana Smékala, poplatcích za psy a odpad, nebo vás navedu k online formulářům:\n\n- [Nahlásit závadu v obci](/nahlasit-zavadu)\n- [Digitální podatelna a žádosti](/podatelna)\n- [Elektronická úřední deska](/urad)\n- [Krizové SMS a e-mail varování](/varovani)\n\nÚřad Čehovice má úřední dny v **pondělí a ve středu 16:00 – 18:00** (tel. +420 582 373 723).`,
      source: 'deterministic-unified-knowledge',
    });
  } catch (error: any) {
    console.error('Anicka chat error:', error);
    return NextResponse.json(
      { error: error?.message || 'Chyba serveru při komunikaci s asistentkou Aničkou.' },
      { status: 500 }
    );
  }
}
