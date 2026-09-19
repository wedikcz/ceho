# 07 — Bezpečnost, GDPR a audit

Shrnutí bezpečnostního modelu portálu pro integrátory a auditory.

## Autentizace vrstev

| Vrstva | Mechanismus | Ochrana |
|---|---|---|
| `/webhook` | tajemství v hlavičce `X-Webhook-Secret` | konstantní porovnání (timing-safe) |
| `/webhook/alerts` | HMAC-SHA256 podpis těla (`X-Signature: sha256=…`) | timing-safe, replay okno 10 min |
| `/mcp` | Bearer token (`Authorization`) | fail-closed bez tokenu |
| Admin UI | admin kód (`ADMIN_CODE`) | rate limit, konstantní porovnání |
| Lokální stav | kryptografické SHA-256 hashe | immutable audit ledger |

**Fail-closed:** Když env proměnná s tajemstvím chybí, endpoint je zcela
zamčený (401/503) — nikdy otevřený.

## GDPR principy

- **Minimalizace:** IP adresy se ukládají výhradně jako SHA-256 hash. Surová IP
  se nikdy neukládá ani neloguje.
- **Anonymizace:** Kontakty v hlášeních závad jdou anonymizovat jedním klikem
  v adminu (`reports.anonymize`).
- **Žádná PII v logách:** Error logy obsahují jen typ chyby a status, ne těla
  požadavků, tajemství ani osobní údaje.
- **Soubory cookie:** Externí služby (Open-Meteo počasí) se načítají až po
  souhlasu s funkčními cookies; bez souhlasu se zobrazí vysvětlení.
- **Právní dokumenty:** VOP, informace o zpracování, GDPR žádosti (čl. 15–21)
  mají vlastní modul (`/gdpr`, GDPR dashboard v adminu).

## Human-in-the-Loop (základní bezpečnostní pojistka)

**Nic se na portálu nezveřejní bez rozhodnutí člověka.** Platí pro:

- Návrhy oznámení z webhooku i Aničky (`tasks`, status `pending`)
- SOAR alerty — i Critical alert se sám neizoluje; čeká na vedení
- PTC write-nástroje — návrhy, ne publikace
- Obsah z generativního studia (obrázky, hudba, video, text)

Audit log (`auditLog`) zaznamenává: kdo, co, kdy, detail. Akce jako
`ptc:run`, `soar:alert_schvalen`, `schvaleni`, `zamitnut`.

## Rate limity a limity vstupů

| Ochrana | Hodnota |
|---|---|
| Webhook rate limit | 30 požadavků/min na hash IP → 429 |
| SOAR tělo | max 64 kB → 413 |
| SOAR replay | stejný podpis těla 1× za 10 min → 409 |
| PTC program | max 12 kroků, ID `^[a-zA-Z0-9_]{1,24}$` |
| PTC zadání | max 1000 znaků |
| MCP argumenty | zod validace (min/max délky per nástroj) |

## Co se nikdy neděje (negativní záruky)

- Portál nikdy nepublikuje autonomně (žádný „auto-post")
- Tajemství se nikdy nevrací v odpovědích (jen boolean `secretConfigured`)
- Podpisy a klíče se nelogují
- Neexistuje endpoint, který by mazal obsah bez admin kódu
- AI obrázky nejsou schválené pro úřední použití (bez ručního rozhodnutí)

## Doporučení pro integrátory

1. **Klíče v tajném úložišti** — ne v kódu, ne v env souborech v repu.
2. **Podpisujte přesný bytes** — stejný řetězec, který odešlete (viz python-soar-sender.py).
3. **Retry s backoff** na 429/5xx; neopakujte 4xx kromě 429.
4. **Idempotence** — SOAR má replay ochranu; pro webhook přidejte vlastní
   deduplikaci podle `title`+čas, pokud posíláte opakovaně.
5. **Monitorujte odpovědi** — `202/200` = uloženo (ne publikováno!); publikaci
   potvrzuje vedení v adminu.
