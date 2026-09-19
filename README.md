# Obec Čehovice Online 2027

Oficiální digitální portál obce Čehovice s veřejnými informacemi pro občany, úřední deskou, digitální podatelnou, krizovými informacemi a AI asistentkou Aničkou. Projekt je postaven na Next.js a používá Convex pro datové modely a bezpečnostní/administrativní funkce.

## Overview

Tento repozitář obsahuje webový portál obce Čehovice, který integruje:

- veřejné informace pro občany a návštěvníky obce,
- úřední desku a informace o obci,
- formuláře pro nahlášení závad a elektronickou podatelnu,
- AI asistenta Aničku s podporou pro chat, transkripci, AI image/music/video a vyhledávání,
- API endpointy pro webhooks, MCP server, SOAR alerty a PDF generation,
- admin panel pro správu a monitoring bezpečnosti a agentních funkcí.

Projekt je zaměřen na digitální komunikaci obce, dostupnost, transparentnost a bezpečnost dat v kontextu veřejné správy.

## Features

- Moderní Next.js frontend s českou lokalizací a responzivním designem
- Stránky pro obec, úřední desku, kontakty, podatelnu, krizové informace, GDPR a nápovědu
- AI asistent Anička pro interaktivní chat a podporu uživatelům
- Zabezpečené webhooky a API endpointy pro hlášení závad, alerty a integrační scénáře
- MCP server pro AI nástroje a externí agenty
- Monitoring bezpečnosti, agent health checks a administrativní dashboard
- PDF generation endpoint
- Convex schema pro záznamy, bezpečnostní snapshoty, tickety a NIS2 logy
- Dříve připravená integrace s agent kit pro externí AI nástroje a automations (`cehovice-agent-kit`)
- Příznivé zajištění WCAG/HTML a přístupnosti přes `AccessibilityBar`

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Convex
- Google GenAI (`@google/genai`)
- D3 + Recharts pro datové vizualizace
- Lucide React pro ikonky
- Motion (Framer Motion compatible animation library)
- ESLint + TypeScript strict build setup
- Bun lockfile (`bun.lock`) for dependency management

## Installation

Požadavky:

- Node.js 20+
- Bun (doporučeno) nebo npm
- Přístup k Convex a Google AI / Gemini API

1. Naklonujte repozitář:

```bash
git clone https://github.com/wedikcz/ceho.git
cd ceho
```

2. Nainstalujte závislosti:

```bash
bun install
```

Nebo:

```bash
npm install
```

3. Vytvořte lokální environment soubor na základě `.env.example`:

```bash
cp .env.example .env.local
```

4. Upravte proměnné dle vašeho prostředí.

## Development

Spusťte vývojový server:

```bash
bun run dev
```

Nebo:

```bash
npm run dev
```

Projekt běží na vývojovém serveru Next.js obvykle na:

- http://localhost:3000

Dostupné skripty:

```bash
bun run build
bun run start
bun run lint
bun run clean
```

## Deployment

Projekt je nastaven pro deployment v moderním Next.js prostředí a používá `output: 'standalone'` v `next.config.ts`, což je vhodné pro kontejnerizované nasazení, Vercel, Cloud Run nebo podobné platformy.

Doporučený návrh nasazení:

- frontend: Next.js app hostovaná v produkčním prostředí,
- API: Next.js route handlers,
- data: Convex,
- AI: Gemini API via environment variable,
- secrets: deployment platform / server env vars.

Pokud nasazujete v AI Studio / podobném prostředí, je důležité nastavit proměnné z `.env.example` a zajistit, aby `APP_URL`, `GEMINI_API_KEY` a další bezpečnostní hodnoty byly správně injektovány do běžící aplikace.

## Folder Structure

```text
ceho/
├── .env.example
├── .eslintrc.json
├── .gitignore
├── bun.lock
├── eslint.config.mjs
├── metadata.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── app/
│   ├── admin/
│   │   ├── gdpr/
│   │   └── page.tsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── agent-health/
│   │   │   ├── image/
│   │   │   ├── music/
│   │   │   ├── search/
│   │   │   ├── transcribe/
│   │   │   └── video/
│   │   ├── anicka/
│   │   ├── cdp-starosta/
│   │   ├── consent/
│   │   ├── mcp/
│   │   ├── pdf/
│   │   ├── webhook/
│   │   └── ...
│   ├── gdpr/
│   ├── kalendar/
│   ├── kontakty/
│   ├── krizove-info/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── ...
│   └── zivotni-situace/
├── components/
│   ├── admin/
│   ├── AccessibilityBar.tsx
│   ├── A11yToggle.tsx
│   ├── AnickaChat.tsx
│   ├── CommandBar.tsx
│   ├── EmergencyBanner.tsx
│   ├── ExpandableSection.tsx
│   ├── Footer.tsx
│   ├── LiveStatusBar.tsx
│   ├── Navbar.tsx
│   └── TownClock.tsx
├── convex/
│   └── schema.ts
├── hooks/
│   └── use-mobile.ts
├── lib/
│   ├── agent-context.ts
│   ├── store.ts
│   ├── types.ts
│   ├── utils.ts
│   └── village-data.ts
├── public/
│   ├── llms.txt
│   └── openapi.yaml
├── cehovice-agent-kit/
│   ├── README.md
│   ├── llms.txt
│   ├── openapi.yaml
│   ├── examples/
│   ├── 01-AGENT-GUIDE.md
│   ├── 02-REST-API.md
│   ├── 03-MCP-SERVER.md
│   ├── 04-SOAR-WEBHOOK.md
│   ├── 05-PTC-ENGINE.md
│   ├── 06-ANICKA-DATOVE-ZDROJE.md
│   └── 07-BEZPECNOST-A-GDPR.md
└── README.md
```

## Environment Variables

Soubor `.env.example` definuje základní proměnné pro běh aplikace:

```dotenv
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

# WEBHOOK_SECRET: Secret for general HTTP webhook (/api/webhook)
WEBHOOK_SECRET="cehovice-sec-2026-webhook"

# SOAR_WEBHOOK_SECRET: HMAC-SHA256 secret for security alerts (/api/webhook/alerts)
SOAR_WEBHOOK_SECRET="cehovice-soar-2026-hmac-key"

# MCP_AUTH_TOKEN: Bearer token for Model Context Protocol (/api/mcp)
MCP_AUTH_TOKEN="cehovice-mcp-bearer-token-2026"
```

Poznámka:

- `GEMINI_API_KEY` je nutný pro AI funkce a gemini calls.
- `APP_URL` se používá pro self-referential links a callbacky.
- `WEBHOOK_SECRET` chrání obecný webhook endpoint.
- `SOAR_WEBHOOK_SECRET` chrání zabezpečené alerty typu SOAR.
- `MCP_AUTH_TOKEN` je použito pro autentizaci MCP serveru.

## Notes

Tento projekt obsahuje i dokumentaci pro AI a agent integration v adresáři `cehovice-agent-kit/`. Tato složka obsahuje REST API, MCP dokumentaci, SOAR webhook specifikaci a další ukázkové příklady pro integrace s externími AI agenty.

Pro další detaily o agentním integračním balíčku viz:

```bash
cat cehovice-agent-kit/README.md
```

## License

V repozitáři není explicitně definovaná licence. Pokud chcete projekt publikovat nebo použít komerčně, doporučuje se doplnit vhodný `LICENSE` soubor podle zvolené licence.

---

Created for: `wedikcz/ceho`































































































































































































































































































































































































































































