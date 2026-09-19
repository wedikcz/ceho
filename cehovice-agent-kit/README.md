# Portál Čehovice — Agent & AI Integration Kit

**Verze:** 1.0 · **Datum:** 2026-09-18 · **Jazyk:** čeština

Kompletní balíček pro napojení botů, AI asistentů, LLM agentů a automatizačních
nástrojů na portál obce Čehovice. Obsahuje veškerou dokumentaci, připravené
skripty a příklady pro každou integraci.

---

## Obsah balíčku

```
cehovice-agent-kit/
├── README.md                     ← Tento soubor — začínáte tady
├── 01-AGENT-GUIDE.md             ← Hlavní příručka: co který agent umí, jak vybrat
├── 02-REST-API.md                ← Veřejné HTTP API (webhook, status, SOAR)
├── 03-MCP-SERVER.md              ← MCP (Model Context Protocol) — 7 nástrojů
├── 04-SOAR-WEBHOOK.md            ← Bezpečnostní alerty (HMAC podpis, triage, NIS2)
├── 05-PTC-ENGINE.md              ← Programmatic Tool Calling — AI píše program
├── 06-ANICKA-DATOVE-ZDROJE.md    ← Datové zdroje Aničky (co umí načíst)
├── 07-BEZPECNOST-A-GDPR.md       ← Pravidla, limity, GDPR, audit
├── llms.txt                      ← Shrnutí pro LLM (machine-readable)
├── examples/
│   ├── curl-webhook.sh           ← Odeslání hlášení přes /webhook
│   ├── curl-mcp.sh               ← Volání MCP serveru (tools/list + tools/call)
│   ├── curl-soar.sh              ← Podepsaný SOAR alert + validace podpisu
│   ├── python-soar-sender.py     ← Produkcí připravený odesílatel alertů (Python)
│   ├── python-agent-client.py    ← Univerzální AI agent klient (MCP + REST)
│   └── claude-desktop-config.json ← Konfigurace MCP pro Claude Desktop
└── openapi.yaml                  ← Machine-readable spec REST endpointů
```

---

## Rychlý start (30 sekund)

### 1. MCP — pro Claude Desktop, Cursor, Copilot a další agenty

MCP server portálu: `https://tremendous-fly-13.api.macaly.app/mcp` (či `/api/mcp`)
Autentizace: `Authorization: Bearer <MCP_AUTH_TOKEN>` (token nastaví správce v env)

Konfigurace pro Claude Desktop je v `examples/claude-desktop-config.json`.

### 2. REST webhook — pro notifikační služby a externí formuláře

```bash
curl -X POST https://tremendous-fly-13.api.macaly.app/webhook \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"kind":"report","title":"Rozbitá lampa","category":"veřejné osvětlení","body":"U kostela"}'
```

### 3. SOAR — pro bezpečnostní systémy (Falco, Warden, IDS…)

Endpoint `/webhook/alerts` (či `/api/webhook/alerts`), HMAC-SHA256 podpis těla v hlavičce `X-Signature`.
Klíč: env `SOAR_WEBHOOK_SECRET`. Detaily v `04-SOAR-WEBHOOK.md`.

---

## Co portál agentům nabízí

| Vrstva | Endpoint | Určení |
|---|---|---|
| **MCP server** | `/mcp` / `/api/mcp` | Standardní protokol pro AI agenty (7 nástrojů: úřední deska, kalendář, závady, projekty, config, health, znalosti) |
| **Všeobecný webhook** | `/webhook` / `/api/webhook` | Příjem hlášení a návrhů oznámení z externích systémů |
| **SOAR webhook** | `/webhook/alerts` / `/api/webhook/alerts` | Podepsané bezpečnostní alerty s triage a NIS2 eskalací |
| **PTC engine** | přes admin | AI složí program volání nástrojů, interpret ho vykoná (human-in-the-loop) |
| **Anička** | chat v aplikaci | Konverzační asistentka s nástroji (web search, PDF, YouTube, překlad, obrázky, TTS, přepis) |

---

## Základní principy (platí pro vše)

1. **Human-in-the-Loop:** Nic se nezveřejní automaticky. Všechny zápisy z webhooků
   i agentů jdou do schvalovací fronty vedení obce (admin panel `/admin`).
2. **Zero Trust:** Všechny endpointy vyžadují autentizaci (tajemství, HMAC podpis
   nebo bearer token). Bez správného klíče: 401. Bez nastaveného klíče na serveru:
   fail-closed (503/401).
3. **GDPR:** IP adresy se ukládají jen jako SHA-256 hash. Žádná PII v logách.
   Kontakty v hlášeních lze anonymizovat.
4. **Audit:** Každé doručení (i odmítnuté) má stopu v `webhookDeliveries` a audit logu.
5. **Rate limit:** 30 požadavků/min na hash IP pro všeobecný webhook (429 při překročení).

---

## Kde získat přístupové klíče

Všechny klíče spravuje správce portálu přes nastavení serveru. Žádný klíč není v kódu.

| Proměnná | K čemu slouží | Které endpointy |
|---|---|---|
| `WEBHOOK_SECRET` | Autentizace všeobecného webhooku | `/webhook`, `/webhook/status` |
| `SOAR_WEBHOOK_SECRET` | HMAC klíč pro podpis alertů (min 16 znaků) | `/webhook/alerts` |
| `MCP_AUTH_TOKEN` | Bearer token MCP serveru | `/mcp` |
| `ADMIN_CODE` | Přístup vedení do admin panelu (ne do API!) | jen `/admin` UI |

**Bezpečnostní pravidlo:** Klíče nikdy nekódujte do repozitáře, nelogujte je
a neposílejte v URL. Rotujte je při podezření z kompromitace.

---

## Podpora

- Provozovatel: Obec Čehovice, Čehovice 93, 798 21 Bedihošť
- E-mail: cehovice@cehovice.cz · Tel: +420 582 368 513
- Datová schránka: kdmbren · IČO: 00288101
- Web: https://www.cehovice.cz/
