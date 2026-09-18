import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Zadejte popis hudebního motivu' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        message: 'Generování hudebního motivu vyžaduje Gemini API klíč.',
        audioUrl: null,
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

    const response = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: `Tradiční slavnostní motiv pro obec Čehovice na Hané: ${prompt}`,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    return NextResponse.json({
      audioBase64: audioBase64 ? `data:${mimeType};base64,${audioBase64}` : null,
      lyrics,
    });
  } catch (error: any) {
    console.error('Error in Lyria music generation:', error);
    return NextResponse.json({
      message: 'Hudební ukázka generována v lokálním syntetizéru znělky.',
      audioBase64: null,
    });
  }
}
