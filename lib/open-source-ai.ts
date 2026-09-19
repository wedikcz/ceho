import { NextRequest } from "next/server";

const baseUrl = (process.env.AI_API_BASE_URL || "http://localhost:8000/v1").replace(/\/$/, "");

function headers(extra?: HeadersInit) {
  const h = new Headers({ "Content-Type": "application/json", ...extra });
  if (process.env.AI_API_KEY) h.set("Authorization", `Bearer ${process.env.AI_API_KEY}`);
  return h;
}

export async function openSourceChat(input: {
  message: string;
  system?: string;
  history?: Array<{ role: string; content: string }>;
  model?: string;
  temperature?: number;
}) {
  const messages = [
    ...(input.system ? [{ role: "system", content: input.system }] : []),
    ...(input.history || []).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: input.message },
  ];
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ model: input.model || process.env.AI_CHAT_MODEL, messages, temperature: input.temperature ?? 0.2, stream: false }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`AI gateway returned ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function openSourceGenerate(path: string, body: unknown) {
  const response = await fetch(`${baseUrl}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "POST", headers: headers(), body: JSON.stringify(body), signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`AI gateway returned ${response.status}`);
  return response.json();
}

export function requestJson(req: NextRequest) { return req.json() as Promise<Record<string, any>>; }
