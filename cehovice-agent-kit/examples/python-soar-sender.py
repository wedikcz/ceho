#!/usr/bin/env python3
"""
Produkčně připravený odesílatel bezpečnostních alertů (SOAR) s HMAC-SHA256 podpisem,
idempotencí a retry logikou pro portál obce Čehovice.
"""

import hmac
import hashlib
import json
import os
import sys
import time
import urllib.request
import urllib.error

DEFAULT_PORTAL_URL = os.getenv("PORTAL_URL", "http://localhost:3000")
ENDPOINT = f"{DEFAULT_PORTAL_URL}/api/webhook/alerts"
SOAR_SECRET = os.getenv("SOAR_WEBHOOK_SECRET", "cehovice-soar-2026-hmac-key")

def send_soar_alert(alert_payload: dict, secret: str, endpoint: str = ENDPOINT, max_retries: int = 3):
    # 1. Serializace na přesné raw bajty
    body_str = json.dumps(alert_payload, separators=(',', ':'), ensure_ascii=False)
    body_bytes = body_str.encode('utf-8')

    # 2. Výpočet HMAC-SHA256 podpisu
    mac = hmac.new(secret.encode('utf-8'), body_bytes, hashlib.sha256)
    signature_hex = mac.hexdigest()
    signature_header = f"sha256={signature_hex}"

    req = urllib.request.Request(
        endpoint,
        data=body_bytes,
        headers={
            "Content-Type": "application/json",
            "X-Signature": signature_header,
            "User-Agent": "Cehovice-SOAR-Python-Sender/1.0"
        },
        method="POST"
    )

    for attempt in range(1, max_retries + 1):
        try:
            print(f"[SOAR] Odesílám alert (pokus {attempt}/{max_retries})...")
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = resp.status
                resp_data = resp.read().decode('utf-8')
                print(f"[SOAR OK {status}] Přijato: {resp_data}")
                return json.loads(resp_data)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='ignore')
            print(f"[SOAR HTTP {e.code}] Chyba: {err_body}")
            if e.code == 409:
                print("[SOAR] Replay detekován (alert již byl v posledních 10 min přijat).")
                return {"ok": False, "reason": "replay"}
            if e.code == 429 and attempt < max_retries:
                time.sleep(2 ** attempt)
                continue
            break
        except Exception as ex:
            print(f"[SOAR EXCEPTION] {ex}")
            if attempt < max_retries:
                time.sleep(2)

    return None

if __name__ == "__main__":
    sample_alert = {
        "rule": "Terminal shell in container",
        "priority": "Critical",
        "source": "falco",
        "output": "Kritický incident: Nepovolený root shell v produkční databázi",
        "output_fields": {
            "container.id": "cehovice-k8s-db-001",
            "k8s.ns.name": "db-zone",
            "user.name": "root",
            "evt.args": "bash -c 'cat /etc/shadow'"
        }
    }
    send_soar_alert(sample_alert, SOAR_SECRET)
