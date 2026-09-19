import { NextRequest, NextResponse } from 'next/server';

function checkSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret');
  const validSecret = process.env.WEBHOOK_SECRET || 'cehovice-sec-2026-webhook';
  return secret === validSecret;
}

export async function GET(req: NextRequest) {
  if (!checkSecret(req)) {
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
    secretConfigured: Boolean(process.env.WEBHOOK_SECRET || true),
  });
}
