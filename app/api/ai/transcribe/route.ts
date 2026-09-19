import { NextRequest, NextResponse } from "next/server";
import { openSourceGenerate, requestJson } from "@/lib/open-source-ai";

export async function POST(req: NextRequest) {
  try { return NextResponse.json(await openSourceGenerate("/audio/transcriptions", await requestJson(req))); }
  catch (error: any) { return NextResponse.json({ error: error.message || "Transcription REST gateway unavailable" }, { status: 502 }); }
}
