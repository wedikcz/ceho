import { NextRequest, NextResponse } from "next/server";
import { openSourceGenerate, requestJson } from "@/lib/open-source-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await requestJson(req);
    const data = await openSourceGenerate("/images/generations", { prompt: `Obec Čehovice: ${body.prompt || ""}`, size: body.aspectRatio === "9:16" ? "768x1344" : "1024x1024", n: 1 });
    return NextResponse.json({ imageUrl: data.data?.[0]?.url || data.imageUrl, prompt: body.prompt });
  } catch (error: any) { return NextResponse.json({ error: error.message || "Image REST gateway unavailable" }, { status: 502 }); }
}
