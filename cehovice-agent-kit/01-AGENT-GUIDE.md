# 01 — Průvodce agenty: který systém k čemu

Portál Čehovice provozuje **čtyři samostatné agentní vrstvy**. Každá má jiné
oprávnění, jiný účel a jiný způsob napojení. Tahle příručka vám pomůže vybrat.

---

## Přehled všech agentů

### 1. Anička — veřejná digitální asistentka

- **Kde běží:** Chatovací widget na všech stránkách portálu (plavoucí tlačítko vpravo dole).
- **Pro koho:** Občané a návštěvníci webu. Přímé napojení externího bota na Aničku
  není veřejné — Anička běží uvnitř aplikace.
- **Co umí:**
  - Odpovídat z živých dat portálu (úřední deska, akce, projekty, upozornění, životní situace)
  - Hlásit závady do systému (jako formulář na webu)
  - Navrhovat oznámení a upozornění (vždy ke schválení vedením)
  - Vyhledávat na internetu a číst oficiální stránky (allowlist: gov.cz, cehovice.cz, kraje, zpravodajské weby)
  - Shrnovat YouTube videa a PDF dokumenty (jen z oficiálních domén)
  - Překládat text, vyrábět obrázky, číst nahlas (TTS), přepisovat audio
- **Bezpečnost:** Výstupy z internetu jsou označeny jako neoficiální. Obrázky z AI
  nejsou schválené pro úřední použití. Žádná autonomní publikace.
- **Pro vývojáře:** Logika v chatovacím modulu a API `/api/anicka`.

### 2. ČDP — denní prohlídka obce (cron agent)

- **Kde běží:** Serverově, každé ráno v 5:00.
- **Pro koho:** Vedení obce. Výsledky v admin panelu (`/admin` → ČDP).
- **Co umí:** Sám projde web, najde nesrovnalosti (zastaralá oznámení, chybějící
  údaje) a připraví návrhy ke schválení. Nic nepublikuje.

### 3. ČDP asistent — poradce vedení (Hardcore-Titan-Help)

- **Kde běží:** Admin panel (`/admin` → ČDP asistent).
- **Pro koho:** Starosta a úředníci.
- **Co umí:** Odpovídá na otázky o digitalizaci 2027, NIS2, GDPR a dotacích
  podle živých dat portálu. Odpovědi jsou auditovány.

### 4. PTC engine — Programmatic Tool Calling (all-in-one)

- **Kde běží:** Admin panel (`/admin` → PTC).
- **Pro koho:** Vedení obce.
- **Co umí:** Vedení zadá úkol v češtině. AI **nenapíše odpověď, ale program** —
  JSON sekvenci volání nástrojů. Deterministický interpret program vykoná
  nad registry všech agentů (max 12 kroků). Nezávislý kritik posoudí výsledek.
- **Nástroje v registru (12):** čtení — čekající úkoly, otevřená hlášení, úřední
  deska, upozornění, kalendář, projekty, paměť Aničky, ČDP prohlídka, security
  přehled, KPI dashboard; zápisy — návrh oznámení, návrh upozornění
  (vždy ke schválení).
- **Detaily:** Viz `05-PTC-ENGINE.md`.

### 5. Security-CAI — ochrana portálu

- **Kde běží:** Serverově + admin panel (`/admin` → Security-CAI).
- **Co umí:** Detekce fingerprintingu, správa cookies politik, Certificate
  Transparency (TLS certifikáty), klasifikace reklam, self-healing politik.

---

## Jak externí agent (váš bot) portál využívá

Extenrní AI agenti se nepřipojují na Aničku, ale na **veřejná rozhraní portálu**:

```
Váš AI agent (Claude, GPT, Cursor, vlastní bot)
        │
        ├── MCP protokol ────────────► /mcp          (čtení dat + hlášení závad)
        ├── REST webhook ────────────► /webhook      (hlášení + návrhy oznámení)
        └── SOAR (HMAC podpis) ─────► /webhook/alerts (bezpečnostní alerty)
```

**Doporučený postup:**
1. Pokud váš agent umí MCP → použijte `03-MCP-SERVER.md` (nejpohodlnější).
2. Pokud umí jen HTTP → použijte `02-REST-API.md`.
3. Pro bezpečnostní infrastrukturu → `04-SOAR-WEBHOOK.md`.

---

## Matice oprávnění

| Schopnost | Anička | ČDP | PTC | Externí agent (MCP/webhook) |
|---|---|---|---|---|
| Čtení veřejných dat | ✅ | ✅ | ✅ | ✅ (MCP) |
| Hlásit závady | ✅ | — | — | ✅ (MCP + webhook) |
| Navrhovat oznámení | ✅ (ke schválení) | ✅ (návrhy) | ✅ (ke schválení) | ✅ webhook kind=notice (ke schválení) |
| Publikovat přímo | ❌ | ❌ | ❌ | ❌ |
| Přístup k admin datům | ❌ | ✅ | ✅ | ❌ |
| Bezpečnostní alerty | ❌ | — | — | ✅ (SOAR, podepsané) |
