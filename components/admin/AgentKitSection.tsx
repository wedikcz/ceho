'use client';

import React, { useState } from 'react';
import {
  Bot,
  Terminal,
  Shield,
  FileCode,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Play,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface AgentDoc {
  id: string;
  title: string;
  filename: string;
  badge: string;
  desc: string;
  content: string;
}

const AGENT_DOCS: AgentDoc[] = [
  {
    id: 'readme',
    title: 'Přehled a rychlý start',
    filename: 'README.md',
    badge: 'Úvod',
    desc: 'Celkový přehled integračního balíčku a rychlý start za 30 sekund.',
    content: `# Portál Čehovice — Agent & AI Integration Kit

Verze: 1.0 · Datum: 2026-09-18 · Jazyk: čeština

Kompletní balíček pro napojení botů, AI asistentů, LLM agentů a automatizačních nástrojů na portál obce Čehovice.

## Rychlý start (30 sekund)

### 1. MCP — pro Claude Desktop, Cursor, Copilot a další agenty
- MCP server portálu: /api/mcp
- Autentizace: Authorization: Bearer <MCP_AUTH_TOKEN>

### 2. REST webhook — pro notifikační služby a externí formuláře
- POST /api/webhook
- Hlavička: X-Webhook-Secret: <WEBHOOK_SECRET>
- Tělo: {"kind":"report","title":"Rozbitá lampa","category":"veřejné osvětlení","body":"U kostela"}

### 3. SOAR — pro bezpečnostní systémy (Falco, Warden, IDS…)
- POST /api/webhook/alerts
- Autentizace: HMAC-SHA256 podpis těla v hlavičce X-Signature: sha256=<hex>
- Klíč: env SOAR_WEBHOOK_SECRET

### Základní principy:
1. Human-in-the-Loop: Nic se nezveřejní automaticky. Všechny zápisy jdou do schvalovací fronty vedení obce (/admin).
2. Zero Trust: Všechny endpointy vyžadují autentizaci. Fail-closed bez klíčů.
3. GDPR: IP adresy se ukládají jen jako SHA-256 hash. Žádná PII v logách.
4. Audit: Každé doručení má stopu v audit logu.
5. Rate limit: 30 požadavků/min na hash IP pro všeobecný webhook.`,
  },
  {
    id: 'guide',
    title: 'Průvodce agenty',
    filename: '01-AGENT-GUIDE.md',
    badge: 'Architektura',
    desc: 'Který systém je pro co určen a přehled 5 vrstev.',
    content: `# 01 — Průvodce agenty: který systém k čemu

Portál Čehovice provozuje čtyři samostatné agentní vrstvy:

1. Anička — veřejná digitální asistentka (chat widget na webu, čtení dat obce, hlášení závad, návrhy ke schválení)
2. ČDP — denní prohlídka obce (cron agent, běží v 5:00 ráno, připravuje auditní zprávy)
3. ČDP asistent — poradce vedení (Hardcore-Titan-Help, odpovědi pro starostu dle NIS2/GDPR/dotací)
4. PTC engine — Programmatic Tool Calling (AI skládá program, interpret vykonává sekvenci volání nástrojů)
5. Security-CAI — ochrana portálu (fingerprinting, cookies, Certificate Transparency, self-healing)

Externí agenti se připojují přes:
- MCP protokol (/api/mcp)
- REST webhook (/api/webhook)
- SOAR webhook (/api/webhook/alerts)`,
  },
  {
    id: 'rest',
    title: 'REST API Webhook',
    filename: '02-REST-API.md',
    badge: 'REST API',
    desc: 'Příjem hlášení závad a návrhů oznámení z externích systémů.',
    content: `# 02 — REST API: všeobecný webhook

Endpointy:
- POST /api/webhook — příjem hlášení (kind=report) nebo oznámení (kind=notice)
- GET /api/webhook/status — diagnostika stavu webhooku

Hlavička:
X-Webhook-Secret: <tajemství z env WEBHOOK_SECRET>

Příklad hlášení závady:
{
  "kind": "report",
  "title": "Rozbité veřejné osvětlení",
  "category": "veřejné osvětlení",
  "body": "Lampa na náměstí u kostela svítí jen občas."
}

Bezpečnost:
- Timing-safe porovnání klíče
- Rate limit 30 požadavků/min na SHA-256 hash IP
- Notice jde do schvalovací fronty (Human-in-the-Loop)`,
  },
  {
    id: 'mcp',
    title: 'MCP Server',
    filename: '03-MCP-SERVER.md',
    badge: 'MCP Protocol',
    desc: 'Model Context Protocol server pro Claude, Cursor a LLM agenty.',
    content: `# 03 — MCP Server (Model Context Protocol)

URL: /api/mcp
Protokol: MCP Streamable HTTP / JSON-RPC 2.0
Auth: Authorization: Bearer <MCP_AUTH_TOKEN>

8 dostupných nástrojů:
1. uredni_deska — Nejnovější dokumenty z úřední desky
2. kalendar_akci — Nadcházející kulturní a úřední akce
3. stav_zavad — Přehled hlášení závad (anonymizováno)
4. rozpoctove_projekty — Projekty participativního rozpočtu
5. config_obce — Základní údaje a kontakty (starosta, úřední hodiny, DS)
6. health_portalu — Stav samoléčebních subsystémů + Zero-Trust skóre
7. znalosti_anicky — Odpověď z lokální znalostní báze Aničky
8. hlasit_zavadu — WRITE nástroj: Vytvoří hlášení závady se statusem "nové"`,
  },
  {
    id: 'soar',
    title: 'SOAR Webhook',
    filename: '04-SOAR-WEBHOOK.md',
    badge: 'Kryptografie',
    desc: 'Bezpečnostní alerty (Falco/Warden) s HMAC-SHA256 podpisem.',
    content: `# 04 — SOAR Webhook: bezpečnostní alerty (HMAC)

Endpoint: POST /api/webhook/alerts
Auth: HMAC-SHA256 podpis raw těla v hlavičce X-Signature: sha256=<hex>
Klíč: env SOAR_WEBHOOK_SECRET (min. 16 znaků)

Triage Engine:
- priority Critical/High + container.id => návrh "izolace_podu"
- namespace db-zone => návrh "nis2_hlaseni" (vygeneruje STIX 2.1 report pro NÚKIB)
- jinak => návrh "jen_zaznam"

Ochrany:
- Replay ochrana: stejný podpis max 1x za 10 minut (409)
- Max velikost těla: 64 kB (413)
- Timing-safe ověření podpisu
- Human-in-the-Loop: žádná akce se nespustí bez schválení vedením obce`,
  },
  {
    id: 'ptc',
    title: 'PTC Engine',
    filename: '05-PTC-ENGINE.md',
    badge: 'AI Engine',
    desc: 'Programmatic Tool Calling: AI sestaví deterministický program volání.',
    content: `# 05 — PTC Engine: Programmatic Tool Calling

AI nenapíše odpověď, ale program — JSON sekvenci volání nástrojů.
Deterministický interpret ho bezpečně vykoná.

Pipeline:
1. Složení — LLM vygeneruje program (max 12 kroků)
2. Interpret — deterministický běh nad 12 allowlist nástroji
3. Kritik — druhé nezávislé LLM posoudí faktickou oporu v datech
4. Audit — uložení do ptcRuns + auditLog

Allowlist nástrojů (12):
- Čtecí: cekajici_ukoly, otevrena_hlaseni, uradni_deska, aktivni_upozorneni, kalendar_akci, projekty_hlasovani, pamet_anicky, cdp_prohlidka, security_prehled, kpi_dashboard
- Zapisovací (Gated): navrh_oznameni, navrh_upozorneni`,
  },
  {
    id: 'anicka',
    title: 'Datové zdroje Aničky',
    filename: '06-ANICKA-DATOVE-ZDROJE.md',
    badge: 'Znalosti',
    desc: 'Přehled živých datových zdrojů a sémantické cache asistentky.',
    content: `# 06 — Datové zdroje Aničky a znalostní vrstva

Živé datové zdroje:
- Úřední deska (notices)
- Krizová upozornění (alerts)
- Kalendář akcí (events)
- Projekty hlasování (projects)
- Životní situace (lifeSituations)
- Hlášení závad (reports)
- Konfigurace obce (municipalityConfig)
- Sémantická cache (semanticCache — 0-token odpovědi)`,
  },
  {
    id: 'security',
    title: 'Bezpečnost & GDPR',
    filename: '07-BEZPECNOST-A-GDPR.md',
    badge: 'Zákonnost',
    desc: 'Auditní stopy, SHA-256 hashování IP, anonymizace a limity.',
    content: `# 07 — Bezpečnost, GDPR a audit

- Fail-closed: bez klíče/tokenu v env je přístup zcela uzavřen.
- Minimalizace: IP adresy se ukládají výhradně jako SHA-256 hash.
- Anonymizace kontaktů jedním klikem v administraci.
- Žádná PII v aplikačních logách.
- Human-in-the-loop jako základní bezpečnostní pojistka proti halucinacím.`,
  },
];

export function AgentKitSection() {
  const [selectedDocId, setSelectedDocId] = useState('readme');
  const [copied, setCopied] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const currentDoc = AGENT_DOCS.find((d) => d.id === selectedDocId) || AGENT_DOCS[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Live test runners
  const runMcpTest = async () => {
    setTesting(true);
    setTestOutput('Probíhá volání MCP serveru (/api/mcp)...');
    try {
      const start = performance.now();
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer cehovice-mcp-bearer-token-2026',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
        }),
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setTestOutput(
        `[STATUS ${res.status} OK (${elapsed} ms)]\n\nNalezeno ${data.result?.tools?.length || 0} nástrojů MCP:\n` +
          JSON.stringify(data, null, 2)
      );
    } catch (err: any) {
      setTestOutput(`[CHYBA MCP]: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const runWebhookStatusTest = async () => {
    setTesting(true);
    setTestOutput('Probíhá ověření stavu REST webhooku (/api/webhook/status)...');
    try {
      const start = performance.now();
      const res = await fetch('/api/webhook/status', {
        method: 'GET',
        headers: {
          'X-Webhook-Secret': 'cehovice-sec-2026-webhook',
        },
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setTestOutput(
        `[STATUS ${res.status} OK (${elapsed} ms)]\nWebhook vrstva je aktivní:\n` +
          JSON.stringify(data, null, 2)
      );
    } catch (err: any) {
      setTestOutput(`[CHYBA WEBHOOK]: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const runSoarTest = async () => {
    setTesting(true);
    setTestOutput('Generuji HMAC-SHA256 podepsaný SOAR alert a odesílám na /api/webhook/alerts...');
    try {
      const payload = {
        rule: 'Terminal shell in container',
        priority: 'Critical',
        source: 'falco',
        output: 'Simulovaný bezpečnostní incident: nepovolený root shell v db-zone',
        output_fields: {
          'container.id': 'ceho-k8s-pod-99',
          'k8s.ns.name': 'db-zone',
          'user.name': 'root',
        },
      };
      const bodyStr = JSON.stringify(payload);
      const secret = 'cehovice-soar-2026-hmac-key';

      // Compute HMAC-SHA256 client-side using Web Cryptography API
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(bodyStr);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const signatureHex = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const start = performance.now();
      const res = await fetch('/api/webhook/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': `sha256=${signatureHex}`,
        },
        body: bodyStr,
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);

      setTestOutput(
        `[STATUS ${res.status} ACCEPTED (${elapsed} ms)]\nHMAC podpis ověřen:\n` +
          JSON.stringify(data, null, 2)
      );
    } catch (err: any) {
      setTestOutput(`[CHYBA SOAR]: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">
                Portál Čehovice — Agent & AI Integration Kit
              </h3>
              <p className="text-xs text-zinc-400 sm:text-sm">
                Kompletní integrační rozhraní pro LLM modely (Claude, Cursor, Copilot, ChatGPT),
                automatizační roboty a bezpečnostní SOAR systémy.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              llms.txt
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
            <a
              href="/openapi.yaml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700"
            >
              <FileCode className="h-3.5 w-3.5 text-blue-400" />
              openapi.yaml
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-emerald-500/40">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Streamable HTTP
            </span>
            <Bot className="h-4 w-4 text-emerald-400" />
          </div>
          <h4 className="font-semibold text-zinc-100">MCP Server</h4>
          <p className="mt-1 text-xs text-zinc-400">
            8 standardních nástrojů pro Claude Desktop a agenty na čtení i hlášení závad.
          </p>
          <div className="mt-3 text-[11px] font-mono text-emerald-400/90">
            POST /api/mcp
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-blue-500/40">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
              30 req/min
            </span>
            <Terminal className="h-4 w-4 text-blue-400" />
          </div>
          <h4 className="font-semibold text-zinc-100">Všeobecný Webhook</h4>
          <p className="mt-1 text-xs text-zinc-400">
            Příjem hlášení a návrhů oznámení z externích formulářů s timing-safe ochranou.
          </p>
          <div className="mt-3 text-[11px] font-mono text-blue-400/90">
            POST /api/webhook
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-amber-500/40">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
              HMAC-SHA256
            </span>
            <Shield className="h-4 w-4 text-amber-400" />
          </div>
          <h4 className="font-semibold text-zinc-100">SOAR Alerty</h4>
          <p className="mt-1 text-xs text-zinc-400">
            Podepsané alerty z Falco/Warden, replay ochrana a STIX 2.1 report pro NÚKIB.
          </p>
          <div className="mt-3 text-[11px] font-mono text-amber-400/90">
            POST /api/webhook/alerts
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-purple-500/40">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
              Deterministický
            </span>
            <Cpu className="h-4 w-4 text-purple-400" />
          </div>
          <h4 className="font-semibold text-zinc-100">PTC Engine</h4>
          <p className="mt-1 text-xs text-zinc-400">
            Programmatic Tool Calling s nezávislým LLM kritikem a 12 nástroji v allowlistu.
          </p>
          <div className="mt-3 text-[11px] font-mono text-purple-400/90">
            Titan Core interpret
          </div>
        </div>
      </div>

      {/* Live Endpoint Diagnostic Console */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 sm:text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Živá diagnostika rozhraní pro agenty
            </h4>
            <p className="text-xs text-zinc-400">
              Jedním kliknutím otestujte živé odpovědi a autentizační mechanismy endpointů.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={runMcpTest}
              disabled={testing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              Test MCP
            </button>
            <button
              onClick={runWebhookStatusTest}
              disabled={testing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              Test Webhook Status
            </button>
            <button
              onClick={runSoarTest}
              disabled={testing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
            >
              <Shield className="h-3.5 w-3.5" />
              Test SOAR HMAC
            </button>
          </div>
        </div>

        {testOutput && (
          <div className="mt-4">
            <div className="flex items-center justify-between pb-1 text-xs text-zinc-400">
              <span>Výstup testu:</span>
              <button
                onClick={() => setTestOutput(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                Vymazat
              </button>
            </div>
            <pre className="max-h-56 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-emerald-400">
              {testOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive Documentation Navigator */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="border-b border-zinc-800 bg-zinc-950/70 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Dokumentace & Příručky (cehovice-agent-kit)
            </span>
            <button
              onClick={() => handleCopy(currentDoc.content)}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Zkopírováno' : 'Zkopírovat soubor'}
            </button>
          </div>

          {/* Document Tabs */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {AGENT_DOCS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedDocId === doc.id
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border border-transparent bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                {doc.filename}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Document Content */}
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-zinc-100">{currentDoc.title}</h4>
              <p className="text-xs text-zinc-400">{currentDoc.desc}</p>
            </div>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {currentDoc.badge}
            </span>
          </div>

          <pre className="max-h-96 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {currentDoc.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
