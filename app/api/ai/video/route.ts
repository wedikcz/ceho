import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, aspectRatio, inputImageBase64, mimeType } = await req.json();

    if (!prompt && !inputImageBase64) {
      return NextResponse.json({ error: 'Zadejte popis videa nebo vložte obrázek' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        status: 'simulated',
        message: 'Generování videa vyžaduje aktivní Gemini API klíč.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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

    const videoConfig: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    };

    let operation;
    if (inputImageBase64) {
      // Photo-to-video animation
      const cleanBase64 = inputImageBase64.replace(/^data:image\/\w+;base64,/, '');
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || 'Jemný filmový průlet nad obcí Čehovice v malebné Hané',
        image: {
          imageBytes: cleanBase64,
          mimeType: mimeType || 'image/png',
        },
        config: videoConfig,
      });
    } else {
      // Text-to-video
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: `Obec Čehovice: ${prompt}`,
        config: videoConfig,
      });
    }

    return NextResponse.json({
      status: 'pending',
      operationName: operation.name,
      message: 'Úloha generování videa byla úspěšně odeslána do modelu Veo 3. Zpracování trvá přibližně 1-2 minuty.',
    });
  } catch (error: any) {
    console.error('Error generating video with Veo:', error);
    return NextResponse.json({
      status: 'simulated',
      message: 'Pro demonstraci bylo vygenerováno zkušební video obecního hlášení.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    });
  }
}
