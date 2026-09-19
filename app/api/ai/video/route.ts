import { NextRequest, NextResponse } from "next/server";
import { openSourceGenerate, requestJson } from "@/lib/open-source-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await requestJson(req);
    if (!body.prompt && !body.inputImageBase64) return NextResponse.json({ error: "Zadejte popis videa nebo vložte obrázek" }, { status: 400 });
    const data = await openSourceGenerate("/video/generations", body);
    return NextResponse.json(data);
  } catch (error: any) { return NextResponse.json({ error: error.message || "Video REST gateway unavailable" }, { status: 502 }); }
}
