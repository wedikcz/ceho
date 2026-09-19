# 03 — MCP Server (Model Context Protocol)

Portál provozuje vlastní MCP server. Přes něj mohou AI agenti (Claude Desktop,
Cursor, Copilot Chat, LangChain, vlastní agenti) číst data obce a hlásit závady.

## Připojení

```
URL:      https://cehovice.cz/api/mcp
Protokol: MCP Streamable HTTP (mcp-lite / JSON-RPC 2.0)
Auth:     Authorization: Bearer <MCP_AUTH_TOKEN>
```

Bez platného tokenu: `401 unauthorized` s hlavičkou `WWW-Authenticate`.
Fail-closed: bez nastaveného `MCP_AUTH_TOKEN` na serveru je endpoint zcela zamčený.

---

## Dostupné nástroje (8)

| Nástroj | Typ | Popis | Parametry |
|---|---|---|---|
| `uredni_deska` | read-only | Nejnovější dokumenty z úřední desky (novinky, vyhlášky) | `limit` (1–50, výchozí 20) |
| `kalendar_akci` | read-only | Nadcházející akce obce (kulturní i úřední, max 20) | — |
| `stav_zavad` | read-only | Přehled hlášení závad (kontakty anonymizované) | — |
| `rozpoctove_projekty` | read-only | Projekty participativního rozpočtu s počty hlasů | — |
| `config_obce` | read-only | Základní údaje a kontakty (starosta, úřední hodiny, DS) | — |
| `health_portalu` | read-only | Stav samoléčebních subsystémů + fronta Titan orchestrace | — |
| `znalosti_anicky` | read-only | Odpověď z lokální znalostní báze Aničky | `question` (min 2 znaky) |
| `hlasit_zavadu` | **write** | Vytvoří hlášení závady (jako formulář na webu) | `category`, `description` (5–2000), `location` (2–500), `contactName?`, `contactPhone?` |

---

## Ukázka: tools/list

```bash
curl -X POST https://cehovice.cz/api/mcp \
  -H "Authorization: Bearer $MCP_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Ukázka: tools/call — čtení úřední desky

```bash
curl -X POST https://cehovice.cz/api/mcp \
  -H "Authorization: Bearer $MCP_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call",
       "params":{"name":"uredni_deska","arguments":{"limit":5}}}'
```

## Ukázka: tools/call — hlášení závady

```bash
curl -X POST https://cehovice.cz/api/mcp \
  -H "Authorization: Bearer $MCP_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call",
       "params":{"name":"hlasit_zavadu","arguments":{
         "category":"silnice",
         "description":"Výtlak před domem čp. 45, nebezpečí pro cyklisty",
         "location":"Čehovice, hlavní silnice u čp. 45"
       }}}'
```

---

## Claude Desktop (config v examples/claude-desktop-config.json)

```json
{
  "mcpServers": {
    "cehovice-portal": {
      "type": "http",
      "url": "https://cehovice.cz/api/mcp",
      "headers": {
        "Authorization": "Bearer <MCP_AUTH_TOKEN>"
      }
    }
  }
}
```

Soubor se ukládá do:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

## Python (mcp klientská knihovna)

```python
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    async with streamablehttp_client(
        "https://cehovice.cz/api/mcp",
        headers={"Authorization": "Bearer <MCP_AUTH_TOKEN>"},
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print([t.name for t in tools.tools])
            result = await session.call_tool("uredni_deska", {"limit": 5})
            print(result.content[0].text)
```

Hotový univerzální klient je v `examples/python-agent-client.py`.

---

## Chování a limity

- Každý nástroj má explicitní audience (`builder` = tokenový přístup); chybějící
  politika = zamčeno. Vypnuté nástroje se nezobrazí ani v `tools/list`.
- `hlasit_zavadu` je jediný write nástroj — vytváří hlášení se statusem „nové",
  žádnou publikaci. Kontakty jsou volitelné a anonymizovatelné.
- Všechny odpovědi jsou JSON text (`content:[{type:"text", text:JSON}]`).
- Nesprávné argumenty → chyba validace zod (popisuje, které pole je špatně).
