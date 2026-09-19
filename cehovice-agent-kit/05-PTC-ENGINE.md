# 05 — PTC Engine: Programmatic Tool Calling

PTC (Programmatic Tool Calling) je all-in-one engine, kde AI **nenapíše odpověď,
ale program** — JSON sekvenci volání nástrojů — a deterministický interpret ho
bezpečně vykoná. Model nikdy nespustí libovolný kód: může volat jen nástroje
z allowlist registru, s limity a human-in-the-loop pro zápisy.

## Kde

Admin panel `/admin` → sekce „PTC — Programmatic Tool Calling".
Přístup: admin kód (`ADMIN_CODE`). Není to veřejné API — PTC běží jako zabezpečená
akce volaná z autorizovaného UI.

## Pipeline (4 kroky)

```
Zadání v češtině (max 1000 znaků)
   │
   ▼
1. SLOŽENÍ  — LLM vygeneruje program (JSON, viz formát níže)
   │
   ▼
2. INTERPRET — deterministický běh: max 12 kroků, allowlist 12 nástrojů,
   │            provazování výsledků, výstupy zkrácené na 1200 znaků/krok
   ▼
3. KRITIK   — druhé nezávislé LLM posoudí, zda odpověď vychází z dat kroků
   │            (verdict: „ok" | „varovani")
   ▼
4. AUDIT    — běh se uloží (ptcRuns, ring buffer 30) + auditLog; write
                nástroje míří do schvalovací fronty vedení
```

## Formát programu

Model generuje čisté JSON:

```json
{
  "steps": [
    { "id": "krok1", "tool": "cekajici_ukoly", "args": {} },
    { "id": "krok2", "tool": "otevrena_hlaseni", "args": {} },
    {
      "id": "krok3",
      "tool": "navrh_oznameni",
      "args": {
        "titulek": "Stav hlášení za týden",
        "text": "Otevřených hlášení: {krok2.openReports}. Na schválení čeká: {krok1.pending}.",
        "uroven": "info"
      }
    }
  ],
  "answerTemplate": "Souhrn: čeká {krok1.pending} návrhů, otevřených hlášení {krok2.openReports}."
}
```

**Provazování výsledků:**
- `{"$": "krok1"}` — vloží celý výsledek kroku jako argument
- `"{krok1.pole}"` — textová substituce pole z výsledku
- Cesta s tečkou: `{krok2.openReports}` → field `openReports` výsledku `krok2`

## Registr nástrojů (12, allowlist)

### Čtecí (bez vedlejších efektů)

| Nástroj | Vrací |
|---|---|
| `cekajici_ukoly` | `{pending: N}` — počet návrhů čekajících na schválení |
| `otevrena_hlaseni` | `{openReports: N}` — počet otevřených hlášení závad |
| `uradni_deska` | `{notices: [...]}` — dokumenty úřední desky |
| `aktivni_upozorneni` | `{alerts: [...]}` — aktivní upozornění na webu |
| `kalendar_akci` | `{events: [...]}` — nadcházející akce |
| `projekty_hlasovani` | `{projects: [...]}` — projekty participativního rozpočtu |
| `pamet_anicky` | statistika sémantické cache (entries, hits) |
| `cdp_prohlidka` | výsledek poslední denní prohlídky (findings, proposals) |
| `security_prehled` | bezpečnostní přehled Security-CAI (fingerprinting, certifikáty, cookies, reklamy) |
| `kpi_dashboard` | KPI metriky (7 kategorií ISO 9001/GovTech) |

### Zapisovací (GATED — vždy jen návrh ke schválení)

| Nástroj | Parametry | Vytvoří |
|---|---|---|
| `navrh_oznameni` | `titulek`, `text`, `uroven` (info\|varovani\|pohroma) | návrh oznámení na úřední desku |
| `navrh_upozorneni` | `titulek`, `text`, `uroven` | návrh krizového upozornění (banner) |

Write nástroje **nikdy nepublikují**. Výsledkem je task ve schvalovací frontě
(`tasks`, status `pending`), který musí vedení schválit nebo zamítnout.

## Bezpečnostní limity

- Max **12 kroků** na program, IDs `^[a-zA-Z0-9_]{1,24}$`, unikátní
- Neznámý nástroj → celý program odmítnut (fail-fast před vykonáním)
- Výstupy kroků zkráceny (1200 znaků do trace, 4000 do odpovědi)
- Pád kroku → běh končí, části výsledků se uchovají, status „chyba" do auditu
- Kritik je best-effort: selhání kritiky = verdikt „varovani", ne pád
- Vše za admin kódem; audit bez tajemství a PII

## Ukázkové úlohy (osvědčené)

- „Kolik návrhů čeká na schválení a kolik je otevřených hlášení? Shrň." →
  2 kroky (`cekajici_ukoly`, `otevrena_hlaseni`), kritik „ok"
- „Zjisti poslední ČDP prohlídku a navrhni oznámení, že web je v pořádku." →
  2 kroky včetně gated `navrh_oznameni`; návrh skončil ve frontě vedení

## Proč PTC a ne obyčejný function calling

Klasický agentní loop (model volá tool → vidí výsledek → volá další) spotřebuje
tolik LLM kolik má kol; PTC složí program jedním LLM voláním a pak běží
deterministicky bez modelu. Výsledek: **levnější, rychlejší, plně auditovatelné
a deterministické** — stejný program dá vždy stejný běh.
