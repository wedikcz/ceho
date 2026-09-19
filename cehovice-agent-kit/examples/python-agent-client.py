#!/usr/bin/env python3
"""
Univerzální klient pro AI agenty podporující Model Context Protocol (MCP) i REST webhook portálu obce Čehovice.
"""

import os
import json
import urllib.request
import urllib.error

PORTAL_URL = os.getenv("PORTAL_URL", "http://localhost:3000")
MCP_TOKEN = os.getenv("MCP_AUTH_TOKEN", "cehovice-mcp-bearer-token-2026")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "cehovice-sec-2026-webhook")

class CehoviceAgentClient:
    def __init__(self, base_url: str = PORTAL_URL, mcp_token: str = MCP_TOKEN, webhook_secret: str = WEBHOOK_SECRET):
        self.base_url = base_url.rstrip('/')
        self.mcp_token = mcp_token
        self.webhook_secret = webhook_secret

    def call_mcp_tool(self, tool_name: str, arguments: dict = None) -> dict:
        url = f"{self.base_url}/api/mcp"
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments or {}
            }
        }
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.mcp_token}",
                "Accept": "application/json"
            }
        )
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))

    def list_mcp_tools(self) -> dict:
        url = f"{self.base_url}/api/mcp"
        payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.mcp_token}",
                "Accept": "application/json"
            }
        )
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))

    def submit_report(self, title: str, category: str, body: str) -> dict:
        url = f"{self.base_url}/api/webhook"
        payload = {"kind": "report", "title": title, "category": category, "body": body}
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "X-Webhook-Secret": self.webhook_secret
            }
        )
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))

if __name__ == "__main__":
    client = CehoviceAgentClient()
    print(">> Seznam MCP nástrojů:")
    tools = client.list_mcp_tools()
    print(json.dumps(tools, indent=2, ensure_ascii=False))

    print("\n>> Volám úřední desku přes MCP:")
    notices = client.call_mcp_tool("uredni_deska", {"limit": 3})
    print(json.dumps(notices, indent=2, ensure_ascii=False))
