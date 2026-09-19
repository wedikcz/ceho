#!/usr/bin/env bash
# Odeslání kryptograficky podepsaného SOAR bezpečnostního alertu (HMAC-SHA256)
# Použití: ./curl-soar.sh [URL_PORTALU]

PORTAL_URL="${1:-http://localhost:3000}"
SOAR_WEBHOOK_SECRET="${SOAR_WEBHOOK_SECRET:-cehovice-soar-2026-hmac-key}"

# Přesné JSON tělo
BODY='{"rule":"Terminal shell in container","priority":"Critical","source":"falco","output":"Spuštěn nepovolený interaktivní shell v db-zone podu","output_fields":{"container.id":"k8s-pod-ceho-db-98b7f","k8s.ns.name":"db-zone","user.name":"root","evt.args":"bash -i"}}'

# Výpočet HMAC-SHA256 hex podpisu z přesného těla
if command -v openssl >/dev/null 2>&1; then
  SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SOAR_WEBHOOK_SECRET" -hex | awk '{print $NF}')
else
  SIG=$(node -e "const c = require('crypto'); console.log(c.createHmac('sha256', process.env.SOAR_WEBHOOK_SECRET).update(process.argv[1]).digest('hex'))" "$BODY")
fi

echo ">> Vypočtený podpis HMAC-SHA256: sha256=$SIG"
echo ">> Odesílám SOAR alert na ${PORTAL_URL}/api/webhook/alerts..."

curl -i -X POST "${PORTAL_URL}/api/webhook/alerts" \
  -H "Content-Type: application/json" \
  -H "X-Signature: sha256=$SIG" \
  -d "$BODY"

echo -e "\nHotovo."
