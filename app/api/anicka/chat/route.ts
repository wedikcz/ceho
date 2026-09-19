import { NextRequest, NextResponse } from "next/server";
import { getDeterministicFaqAnswer, getUnifiedAgentSystemPrompt } from "@/lib/agent-context";
import { openSourceChat, requestJson } from "@/lib/open-source-ai";

export async function POST(req: NextRequest) {
  try {
    const { message, currentPage, history } = await requestJson(req);
    if (typeof message !== "string" || !message.trim()) return NextResponse.json({ error: "Zpráva je prázdná" }, { status: 400 });
    const fallback = getDeterministicFaqAnswer(message);
    try {
      const reply = await openSourceChat({ message: `Stránka: ${currentPage || "/"}\nDotaz občana: ${message}`, system: getUnifiedAgentSystemPrompt("anicka"), history: Array.isArray(history) ? history.slice(-6).map((h: any) => ({ role: h.sender === "user" ? "user" : "assistant", content: h.text || h.content || "" })) : [] });
      if (reply) return NextResponse.json({ reply, source: "open-source-rest" });
    } catch (error) { console.warn("Open-source AI gateway unavailable:", error); }
    return NextResponse.json({ reply: fallback || "Dobrý den! Kontaktujte prosím Obecní úřad Čehovice nebo položte dotaz k úředním hodinám, poplatkům či hlášení závad.", source: "deterministic-local" });
  } catch (error: any) { return NextResponse.json({ error: error.message || "Chyba serveru" }, { status: 500 }); }
}
