#!/usr/bin/env bash
# Testování Model Context Protocol (MCP) serveru obce Čehovice
# Použití: ./curl-mcp.sh [URL_PORTALU]

PORTAL_URL="${1:-http://localhost:3000}"
MCP_AUTH_TOKEN="${MCP_AUTH_TOKEN:-cehovice-mcp-bearer-token-2026}"

echo ">> 1. Zjišťuji seznam MCP nástrojů (tools/list)..."
curl -s -X POST "${PORTAL_URL}/api/mcp" \
  -H "Authorization: Bearer ${MCP_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq . || cat

echo -e "\n\n>> 2. Volám nástroj uredni_deska (tools/call)..."
curl -s -X POST "${PORTAL_URL}/api/mcp" \
  -H "Authorization: Bearer ${MCP_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"uredni_deska","arguments":{"limit":5}}}' | jq . || cat

echo -e "\n\n>> 3. Volám nástroj health_portalu (tools/call)..."
curl -s -X POST "${PORTAL_URL}/api/mcp" \
  -H "Authorization: Bearer ${MCP_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"health_portalu"}}' | jq . || cat

echo -e "\n\nHotovo."
