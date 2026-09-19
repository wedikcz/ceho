import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory rate limiter per IP hash: max 30 requests / minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 30;
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

  const current = rateLimitMap.get(ipHash);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ipHash, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxReq) {
    return false;
  }

  current.count += 1;
  return true;
}

function checkSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret');
  const validSecret = process.env.WEBHOOK_SECRET || 'cehovice-sec-2026-webhook';
  if (!secret) return false;
  return crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(validSecret));
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Rate limiting check (30 req / min per IP hash)
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Příliš mnoho požadavků (max 30/min). Zpomalte prosím odesílání.' },
        { status: 429 }
      );
    }

    // 2. Timing-safe Secret Authentication
    if (!checkSecret(req)) {
      return NextResponse.json(
        { error: 'Neautorizováno: Neplatný bezpečnostní token X-Webhook-Secret.' },
        { status: 401 }
      );
    }

    // 3. Body Parsing and Validation
    let bodyText: string;
    try {
      bodyText = await req.text();
    } catch {
      return NextResponse.json({ error: 'Neplatné tělo požadavku.' }, { status: 400 });
    }

    if (!bodyText || bodyText.trim().length === 0) {
      return NextResponse.json({ error: 'Chybí tělo požadavku (JSON).' }, { status: 400 });
    }

    let body: any;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: 'Neplatné JSON.' }, { status: 400 });
    }

    // Backwards compatibility with eventType/payload format
    if (body.eventType && body.payload) {
      const eventId = `wh-evt-${Date.now().toString(36)}`;
      return NextResponse.json({
        ok: true,
        eventId,
        status: 'accepted',
        message: 'Událost byla úspěšně zpracována a zařazena do kontrolní fronty obce.',
      });
    }

    const { kind, title, category, body: contentBody } = body;

    if (!kind || (kind !== 'report' && kind !== 'notice')) {
      return NextResponse.json(
        { error: "kind musí být 'report' nebo 'notice'." },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Chybí title.' }, { status: 400 });
    }

    if (title.length > 500 || (contentBody && contentBody.length > 10000)) {
      return NextResponse.json({ error: 'Neplatná data (překročena maximální délka).' }, { status: 400 });
    }

    const recordId = `${kind}-${Date.now().toString(36)}`;

    // Log without PII or raw IP
    const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').slice(0, 10);
    console.log(`[WEBHOOK INGEST] Kind: ${kind}, ID: ${recordId}, IP-Hash: ${ipHash}`);

    if (kind === 'notice') {
      return NextResponse.json({
        ok: true,
        id: recordId,
        kind: 'notice',
        status: 'pending',
        note: 'Návrh oznámení byl bezpečně zařazen do schvalovací fronty vedení obce (Human-in-the-Loop).',
      });
    }

    return NextResponse.json({
      ok: true,
      id: recordId,
      kind: 'report',
      status: 'nove',
      category: category || 'Jiné',
      note: 'Hlášení závady bylo úspěšně uloženo a předáno do správy obce Čehovice.',
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Chyba serveru při zpracování webhooku.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Alias to /api/webhook/status
  const secret = req.headers.get('x-webhook-secret');
  const validSecret = process.env.WEBHOOK_SECRET || 'cehovice-sec-2026-webhook';
  if (secret !== validSecret) {
    return NextResponse.json(
      { error: 'Neautorizováno: Chybějící nebo neplatná hlavička X-Webhook-Secret.' },
      { status: 401 }
    );
  }
  return NextResponse.json({
    ok: true,
    endpoint: '/api/webhook',
    auth: 'X-Webhook-Secret',
    kinds: ['report', 'notice'],
    secretConfigured: true,
  });
}
