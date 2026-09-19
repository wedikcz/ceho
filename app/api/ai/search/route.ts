import { NextRequest, NextResponse } from "next/server";
import { openSourceChat, requestJson } from "@/lib/open-source-ai";

export async function POST(req: NextRequest) {
  try { const { query } = await requestJson(req); if (typeof query !== "string" || !query.trim()) return NextResponse.json({ error: "Zadejte dotaz" }, { status: 400 }); const answer = await openSourceChat({ message: query, system: "Jsi rešeršní asistent obce Čehovice. Pokud nemáš ověřený zdroj, přiznej nejistotu." }); return NextResponse.json({ answer, sources: [], model: process.env.AI_CHAT_MODEL }); }
  catch (error: any) { return NextResponse.json({ error: error.message || "Search REST gateway unavailable" }, { status: 502 }); }
}
