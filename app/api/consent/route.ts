import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, preferences } = body;

    // ePrivacy minimal compliance: audit consent state
    const response = NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      action: action === 'grant' ? 'granted' : 'revoked',
      preferences: preferences || { essential: true, analytics: false },
    });

    // Set privacy cookie (HTTP-only or SameSite=Lax)
    response.cookies.set('cehovice_eprivacy_consent', action === 'grant' ? 'granted' : 'denied', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Chyba zpracování souhlasu' }, { status: 400 });
  }
}
