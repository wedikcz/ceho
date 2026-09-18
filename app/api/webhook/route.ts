import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiter per IP: max 30 requests / minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 30;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxReq) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Rate limiting check
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Překročen limit požadavků (max 30/min). Zkuste to prosím za chvíli.' },
        { status: 429 }
      );
    }

    // 2. Secret authentication check
    const authHeader = req.headers.get('x-webhook-secret');
    const validSecret = process.env.WEBHOOK_SECRET || 'cehovice-sec-2026-webhook';

    if (authHeader !== validSecret) {
      return NextResponse.json(
        { error: 'Neplatný bezpečnostní token X-Webhook-Secret.' },
        { status: 401 }
      );
    }

    // 3. Body ingestion
    const body = await req.json();
    const { eventType, payload } = body;

    if (!eventType || !payload) {
      return NextResponse.json(
        { error: 'Chybí povinná pole eventType nebo payload.' },
        { status: 400 }
      );
    }

    const eventId = `wh-evt-${Date.now().toString(36)}`;
    const receivedAt = new Date().toISOString();

    // Log to console for observability
    console.log(`[WEBHOOK INGEST] Type: ${eventType}, ID: ${eventId}, IP: ${clientIp}`);

    return NextResponse.json({
      status: 'accepted',
      eventId,
      eventType,
      receivedAt,
      message: 'Událost byla úspěšně zpracována a zařazena do kontrolní fronty obce.',
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Chyba serveru při zpracování webhooku.' },
      { status: 500 }
    );
  }
}
