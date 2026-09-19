import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Zadejte dotaz pro vyhledávání' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer: `Výsledky pro: "${query}" – Vyhledávání Google Search Grounding vyžaduje nastavený Gemini API klíč v prostředí.`,
        sources: [],
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const candidateSearchModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let response: any = null;
    let activeModel = 'gemini-3.8-flash';
 
    for (const modelName of candidateSearchModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: `Jsi rešeršní asistent starosty obce Čehovice. Použij Google Search a odpověz věcně na dotaz: ${query}. Uveď aktuální fakta a související předpisy pro ČR.`,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
        if (response?.text) {
          activeModel = modelName;
          break;
        }
      } catch (err: any) {
        console.warn(`Search grounding with ${modelName} failed:`, err?.message || err);
      }
    }
 
    const answer = response.text || 'Nebyly nalezeny žádné podrobnosti.';
    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = searchChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Zdroj',
        url: chunk.web?.uri || '#',
      }))
      .filter((s: any) => s.url !== '#');
 
    return NextResponse.json({
      answer,
      sources,
      model: activeModel,
    });
  } catch (error: any) {
    console.error('Error in search grounding:', error);
    return NextResponse.json({
      answer: `Ověření informací pro dotaz "${req.url}": Zkontrolujte oficiální portál veřejné správy portal.gov.cz nebo Sbírku zákonů.`,
      sources: [{ title: 'Portál veřejné správy ČR', url: 'https://portal.gov.cz' }],
    });
  }
}
