#!/usr/bin/env bash
# Odeslání hlášení závady přes REST webhook
# Použití: ./curl-webhook.sh [URL_PORTALU]

PORTAL_URL="${1:-http://localhost:3000}"
WEBHOOK_SECRET="${WEBHOOK_SECRET:-cehovice-sec-2026-webhook}"

echo ">> Odesílám hlášení závady na ${PORTAL_URL}/api/webhook..."

curl -i -X POST "${PORTAL_URL}/api/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: ${WEBHOOK_SECRET}" \
  -d '{
    "kind": "report",
    "title": "Rozbité veřejné osvětlení před domem čp. 45",
    "category": "veřejné osvětlení",
    "body": "Lampa bliká a v noci nesvítí. Nebezpečí pro chodce."
  }'

echo -e "\n\n>> Testuji stav webhooku..."
curl -i -X GET "${PORTAL_URL}/api/webhook/status" \
  -H "X-Webhook-Secret: ${WEBHOOK_SECRET}"

echo -e "\nHotovo."
