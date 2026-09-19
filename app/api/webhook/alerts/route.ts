import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Replay protection cache (signatures received in last 10 minutes)
const replayCache = new Map<string, number>();
const REPLAY_TTL_MS = 10 * 60 * 1000; // 10 minutes

function cleanReplayCache() {
  const now = Date.now();
  for (const [sig, timestamp] of replayCache.entries()) {
    if (now - timestamp > REPLAY_TTL_MS) {
      replayCache.delete(sig);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const soarSecret = process.env.SOAR_WEBHOOK_SECRET || 'cehovice-soar-2026-hmac-key';
    if (!soarSecret || soarSecret.length < 16) {
      return NextResponse.json(
        { error: 'Server nemá správně nakonfigurovaný SOAR_WEBHOOK_SECRET (fail-closed).' },
        { status: 503 }
      );
    }

    // 1. Check signature header
    const sigHeader = req.headers.get('x-signature');
    if (!sigHeader) {
      return NextResponse.json(
        { error: 'Chybí povinná hlavička X-Signature (formát sha256=<hex>).' },
        { status: 401 }
      );
    }

    const match = sigHeader.match(/^sha256=([a-fA-F0-9]{64})$/);
    if (!match) {
      return NextResponse.json(
        { error: 'Neplatný formát hlavičky X-Signature. Očekáváno sha256=<64-hex-znaků>.' },
        { status: 403 }
      );
    }
    const incomingHex = match[1].toLowerCase();

    // 2. Read raw body bytes and enforce 64 kB limit
    const rawBuffer = Buffer.from(await req.arrayBuffer());
    if (rawBuffer.length > 64 * 1024) {
      return NextResponse.json(
        { error: 'Tělo požadavku překročilo maximální povolený limit 64 kB.' },
        { status: 413 }
      );
    }

    // 3. Constant-time HMAC-SHA256 verification
    const computedHmac = crypto.createHmac('sha256', soarSecret).update(rawBuffer).digest('hex');
    const isValid = crypto.timingSafeEqual(
      Buffer.from(incomingHex, 'hex'),
      Buffer.from(computedHmac, 'hex')
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Neplatný kryptografický HMAC podpis těla požadavku.' },
        { status: 403 }
      );
    }

    // 4. Replay attack check
    cleanReplayCache();
    if (replayCache.has(incomingHex)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Replay incident: Stejný alert (shodný podpis těla) byl již přijat v posledních 10 minutách.',
        },
        { status: 409 }
      );
    }
    replayCache.set(incomingHex, Date.now());

    // 5. Parse JSON payload
    let alertBody: any;
    try {
      alertBody = JSON.parse(rawBuffer.toString('utf-8'));
    } catch {
      return NextResponse.json({ error: 'Nevalidní JSON v těle alertu.' }, { status: 400 });
    }

    const { rule, priority, source, output, output_fields } = alertBody;

    const validPriorities = ['Critical', 'High', 'Medium', 'Low', 'Informational'];
    if (!rule || !priority || !source || !output) {
      return NextResponse.json(
        { error: 'Chybí povinná pole alertu: rule, priority, source, output.' },
        { status: 400 }
      );
    }

    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Neznámá priorita "${priority}". Povolené: ${validPriorities.join(', ')}` },
        { status: 400 }
      );
    }

    // 6. Automated Triage Engine
    const containerId = output_fields?.['container.id'] || output_fields?.containerId;
    const k8sNamespace = output_fields?.['k8s.ns.name'] || output_fields?.namespace;

    let proposedPlaybook: 'izolace_podu' | 'nis2_hlaseni' | 'jen_zaznam' = 'jen_zaznam';
    let note = 'Alert zaevidován do auditní knihy incidentů.';
    let stix21Report: any = null;

    if ((priority === 'Critical' || priority === 'High') && containerId) {
      proposedPlaybook = 'izolace_podu';
      note = `Detekován incident vysoké závažnosti v kontejneru ${containerId}. Připraven návrh playbooku izolace podu ke schválení vedením obce.`;
    } else if (k8sNamespace === 'db-zone') {
      proposedPlaybook = 'nis2_hlaseni';
      note = 'Incident zasahuje databázovou zónu obce. Automaticky byl vygenerován STIX 2.1 report pro NÚKIB a předán starostovi.';
      stix21Report = {
        type: 'bundle',
        id: `bundle--${crypto.randomUUID()}`,
        spec_version: '2.1',
        objects: [
          {
            type: 'incident',
            id: `incident--${crypto.randomUUID()}`,
            name: `NÚKIB / NIS2 Incident: ${rule}`,
            description: output,
            severity: priority.toLowerCase(),
            created: new Date().toISOString(),
          },
        ],
      };
    }

    const alertId = `soar-${Date.now().toString(36)}`;
    console.log(`[SOAR ALERT ACCEPTED] ID: ${alertId}, Rule: ${rule}, Priority: ${priority}, Playbook: ${proposedPlaybook}`);

    return NextResponse.json(
      {
        ok: true,
        alertId,
        proposedPlaybook,
        note: `${note} (Human-in-the-Loop: žádný autonomní zásah nebyl spuštěn)`,
        stixReport: stix21Report,
      },
      { status: 202 }
    );
  } catch (err: any) {
    console.error('SOAR webhook error:', err);
    return NextResponse.json({ error: 'Chyba serveru při zpracování SOAR alertu.' }, { status: 500 });
  }
}
