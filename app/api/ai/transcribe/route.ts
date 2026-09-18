import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { audioBase64, mimeType } = await req.json();

    if (!audioBase64) {
      return NextResponse.json({ error: 'Chybí audiodata pro přepis' }, { status: 400 });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        transcript: 'Předpis audionahrávky: Schvaluji záměr směny pozemků a rozpočtové opatření č. 3 pro obec Čehovice.',
        simulated: true,
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

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Přepiš tuto českou hlasovou nahrávku starosty obce do čistého textu s diakritikou.',
          },
        ],
      },
    });

    const transcript = response.text?.trim() || 'Hlasový záznam byl prázdný nebo nesrozumitelný.';

    return NextResponse.json({
      transcript,
      simulated: false,
    });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json({
      transcript: 'Hlasový záznam starosty byl zaevidován v systému Titan.',
      simulated: true,
    });
  }
}
