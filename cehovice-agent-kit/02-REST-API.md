# 02 — REST API: všeobecný webhook

## Endpointy

| Metoda | Cesta | Auth | Popis |
|---|---|---|---|
| `POST` | `/api/webhook` (alias `/webhook`) | `X-Webhook-Secret` | Příjem hlášení (kind=report) nebo návrhu oznámení (kind=notice) |
| `GET` | `/api/webhook/status` (alias `/webhook/status`) | `X-Webhook-Secret` | Stav a konfigurace webhook vrstvy |

---

## POST /api/webhook — vytvořit hlášení

### Požadavek

```http
POST /api/webhook HTTP/1.1
Host: cehovice.cz
X-Webhook-Secret: <tajemství z env WEBHOOK_SECRET>
Content-Type: application/json

{
  "kind": "report",
  "title": "Rozbité veřejné osvětlení",
  "category": "veřejné osvětlení",
  "body": "Lampa na náměstí u kostela svítí jen občas už třetí den."
}
```

### Pole

| Pole | Povinné | Typ | Popis |
|---|---|---|---|
| `kind` | ✅ | `"report"` \| `"notice"` | Typ záznamu |
| `title` | ✅ | string (neprázdný) | Titulek |
| `category` | pro report | string | Kategorie závady (default „Jiné") |
| `body` | volitelné | string | Podrobný popis (spojuje se s titulkem) |

### Odpovědi

| Status | Význam |
|---|---|
| `200` | `{ok:true}` — uloženo. Report dostane status „nové", notice jde do schvalovací fronty |
| `401` | Špatné nebo chybějící tajemství |
| `405` | Metoda není POST |
| `429` | Rate limit (30/min na IP hash) — `{error:"Příliš mnoho požadavků…"}` |
| `400` | `{error:"Neplatné JSON."}` / `{error:"kind musí být 'report' nebo 'notice'."}` / `{error:"Chybí title."}` / `{error:"Neplatná data."}` (nevalidní délky/typy) |

**Poznámka:** Odpověď `200` znamená uložení, NE publikaci. Notice čeká na
schválení vedení obce (human-in-the-loop).

---

## POST /api/webhook — návrh oznámení na desku

```bash
curl -X POST https://cehovice.cz/api/webhook \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "notice",
    "title": "Výluka vody v pátek",
    "body": "V pátek 25. 9. 2026 bude v Čehovicích od 8:00 do 12:00 výluka vody."
  }'
```

---

## GET /api/webhook/status — diagnostika

```bash
curl https://cehovice.cz/api/webhook/status \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET"
```

Odpověď:

```json
{
  "ok": true,
  "endpoint": "/api/webhook",
  "auth": "X-Webhook-Secret",
  "kinds": ["report", "notice"],
  "secretConfigured": true
}
```

Hodnota tajemství se nikdy nevrací — jen boolean `secretConfigured`.

---

## Chování ochranných vrstev (pořadí)

1. **Rate limit** na SHA-256 hash IP (30/min) — platí i před ověřením tajemství
2. **Autentizace** — konstantní porovnání `X-Webhook-Secret` s env (timing-safe)
3. **Validace** — JSON objekt, povolené `kind`, neprázdný `title`, limity délek
4. **Human-in-the-Loop** — notice → schvalovací fronta, report → status „nové"
5. **Audit** — každé doručení do `webhookDeliveries` (klient jen jako SHA-256 hash IP)

Přihlašovací údaje, tajemství ani surové IP se nikdy neukládají ani nelogují.

---

## Chybová diagnostika

| Vrátí server | Příčina | Řešení |
|---|---|---|
| `401` | Špatný `X-Webhook-Secret` | Ověřte env `WEBHOOK_SECRET` na serveru |
| `429` | Překročen rate limit | Zpomalte odesílání (max 30/min), přidejte retry s exp. backoff |
| `400 bad_json` | Tělo není JSON objekt | Zkontrolujte `Content-Type: application/json` |
| `400 bad_kind` | Neznámý `kind` | Použijte jen `report` nebo `notice` |
| `400 bad_payload` | Nevalidní délky/typy | Zkraťte pole, ověřte typy |
| `503` | Tajemství není na serveru nastavené | Správce musí nastavit `WEBHOOK_SECRET` (fail-closed) |
