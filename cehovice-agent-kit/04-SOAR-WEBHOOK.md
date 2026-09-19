# 04 — SOAR Webhook: bezpečnostní alerty (HMAC)

Endpoint pro přijímání podepsaných bezpečnostních alertů z infrastruktury
(Falco, Warden, IDS/IPS, EDR, monitoring). Port logiky z FastAPI webhooku
(`ceho-webhook.py`) s moderním zabezpečením.

## Endpoint

```
POST https://cehovice.cz/api/webhook/alerts
```

## Autentizace: HMAC-SHA256

1. Vezměte **přesné tělo požadavku** (raw bytes, jak jdou na drát).
2. Spočtěte `HMAC_SHA256(key=SOAR_WEBHOOK_SECRET, message=body)` → hex.
3. Pošlete v hlavičce: `X-Signature: sha256=<hex>`

**Kritické:** Podpis se počítá z přesného řetězce, který odešlete. Pokud
přeserializujete JSON po podpisu (změna mezer/pořadí klíčů), podpis neplatí.

Server ověřuje podpis v konstantním čase (timing-safe) a klíč čte z env
`SOAR_WEBHOOK_SECRET` (min 16 znaků). Bez klíče je endpoint fail-closed (503).

---

## Tělo alertu

```json
{
  "rule": "Terminal shell in container",
  "priority": "Critical",
  "source": "falco",
  "output": "Shell spuštěn v produkčním kontejneru (user=root)",
  "output_fields": {
    "container.id": "a1b2c3d4e5f6",
    "k8s.ns.name": "db-zone",
    "user.name": "root",
    "evt.args": "bash -c whoami"
  }
}
```

| Pole | Povinné | Popis |
|---|---|---|
| `rule` | ✅ | Název pravidla, které alert spustilo |
| `priority` | ✅ | `Critical` \| `High` \| `Medium` \| `Low` \| `Informational` |
| `source` | ✅ | Odkud alert přišel (falco, warden, ids…) |
| `output` | ✅ | Lidsky čitelný popis incidentu |
| `output_fields` | volitelné | Strukturovaná pole (aliasy jako v .py: `container.id`, `k8s.ns.name`, `user.name`, `evt.args`) |

Limit velikosti těla: **64 kB** (větší → 413).

---

## Co se stane s alertem (triage engine)

| Podmínka | Návrhovaný playbook |
|---|---|
| priority Critical/High **a** známý `container.id` | `izolace_podu` |
| `k8s.ns.name == "db-zone"` | `nis2_hlaseni` (vygeneruje se STIX 2.1 report pro NÚKIB) |
| jinak | `jen_zaznam` |

**Důležité:** Izolace podu se NIKDY neprovede
autonomně. Každý alert je návrh, který musí vedení obce schválit v admin panelu
(`/admin` → SOAR). Vše jde do audit logu (`soar:alert_prijat/schvalen/zamitnut`).

---

## Odpovědi

| Status | Význam |
|---|---|
| `202` | `{ok:true, alertId:"…", proposedPlaybook:"…", note:"…"}` — přijato k posouzení |
| `401` | Chybí hlavička `X-Signature` |
| `403` | Neplatný podpis |
| `409` | Replay — stejný alert (stejný podpis těla) už byl přijat v posledních 10 min |
| `413` | Tělo větší než 64 kB |
| `400` | Nevalidní JSON, neznámá priorita, překročené délky polí |
| `503` | Server nemá nastavený `SOAR_WEBHOOK_SECRET` (fail-closed) |

---

## Ukázka (curl)

Skript v `examples/curl-soar.sh`; zde jádro:

```bash
BODY='{"rule":"Terminal shell in container","priority":"Critical","source":"falco","output":"test","output_fields":{"container.id":"abc123","k8s.ns.name":"db-zone"}}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SOAR_WEBHOOK_SECRET" -hex | awk '{print $NF}')
curl -X POST https://cehovice.cz/api/webhook/alerts \
  -H "Content-Type: application/json" \
  -H "X-Signature: sha256=$SIG" \
  -d "$BODY"
```

Produkční odesílatel s retry a idempotencí: `examples/python-soar-sender.py`.

---

## Testovací matice (ověřeno na produkci)

| Scénář | Očekáváno | Výsledek |
|---|---|---|
| Platný podepsaný alert | 202 + alertId | ✅ |
| Stejný alert znovu (do 10 min) | 409 replay | ✅ |
| Špatný podpis | 403 | ✅ |
| Chybějící podpis | 401 | ✅ |
| Neznámá priorita | 400 | ✅ |
| Tělo > 64 kB | 413 | ✅ |

## NIS2 / NÚKIB

Při alertu z namespace `db-zone` server automaticky vygeneruje **STIX 2.1
report** (indikátory + incident), který se ukládá spolu s alertem a je k
dispozici vedení pro případné hlášení NÚKIBovi dle zákona o kybernetické
bezpečnosti. Report se nikdy neposílá sám — jen je připravený k posouzení.
