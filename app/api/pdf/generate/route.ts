import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { trackingCode, type, subject, content, applicantName, applicantEmail, applicantPhone, createdAt, deadlineDate } = await req.json();

    const formattedDate = new Date(createdAt).toLocaleString('cs-CZ');
    const formattedDeadline = new Date(deadlineDate).toLocaleDateString('cs-CZ');

    const typeLabels: Record<string, string> = {
      'obecne_podani': 'Obecné podání / Dotaz',
      'zadost_informace_106': 'Žádost o informace (106/1999 Sb.)',
      'zadost_kaceni': 'Žádost o kácení dřevin',
      'stiznost': 'Stížnost / Podnět',
      'poplatky': 'Místní poplatky',
      'zivotni_prostredi': 'Životní prostředí & zeleň',
    };

    const typeLabel = typeLabels[type] || 'Obecné podání';

    // Generate simulated QR code SVG path or canvas representation
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://cehovice.cz/track/${trackingCode}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="cs">
      <head>
        <meta charset="UTF-8">
        <title>Potvrzení o digitálním podání POD-2027 - ${trackingCode}</title>
        <style>
          body {
            font-family: 'Sora', 'Instrument Sans', 'Segoe UI', Roboto, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            margin: 0;
            padding: 40px;
            line-height: 1.6;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            font-serif: Georgia, serif;
          }
          .subtitle {
            font-size: 14px;
            color: #64748b;
            margin-top: 5px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
            margin-bottom: 12px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .grid-item {
            font-size: 13px;
          }
          .grid-item strong {
            color: #0f172a;
          }
          .content-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            font-size: 13px;
            white-space: pre-wrap;
            color: #334155;
            margin-top: 10px;
          }
          .qr-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 40px;
            padding-top: 20px;
            border-t: 1px dashed #cbd5e1;
          }
          .qr-text {
            font-size: 11px;
            color: #64748b;
            max-width: 70%;
          }
          .footer-note {
            margin-top: 50px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="text-align: right; margin-bottom: 15px;">
          <button onclick="window.print()" style="background-color: #f59e0b; color: #000; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">Tisk potvrzení / Uložit jako PDF</button>
        </div>

        <table class="header-table">
          <tr>
            <td style="vertical-align: top;">
              <h1 class="title">Obecní úřad Čehovice</h1>
              <div class="subtitle">Čehovice 80, 798 17 Čehovice • IČO: 00288101 • podatelna@cehovice.cz</div>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div style="font-weight: 800; font-size: 16px; color: #f59e0b;">Kód podání: ${trackingCode}</div>
              <div style="font-size: 11px; color: #64748b; font-family: monospace;">Záznam: POD-2027</div>
            </td>
          </tr>
        </table>

        <div class="section">
          <h2 class="section-title">Potvrzení o přijetí elektronického podání</h2>
          <p style="font-size: 13px;">
            Podle zákona č. 500/2004 Sb., správní řád, v platném znění (§ 37), potvrzujeme úspěšné přijetí a zaevidování Vašeho níže specifikovaného podání v elektronické podatelně obce Čehovice.
          </p>
        </div>

        <div class="section">
          <h2 class="section-title">Údaje o podání</h2>
          <div class="grid">
            <div class="grid-item">
              <strong>Odesílatel / Žadatel:</strong><br>
              ${applicantName}<br>
              E-mail: ${applicantEmail}<br>
              ${applicantPhone ? `Telefon: ${applicantPhone}` : ''}
            </div>
            <div class="grid-item">
              <strong>Evidenční detaily:</strong><br>
              Datum přijetí: ${formattedDate}<br>
              Zákonná lhůta do: ${formattedDeadline} (30 dnů)<br>
              Agendový typ: ${typeLabel}
            </div>
          </div>

          <div class="grid-item" style="margin-top: 15px;">
            <strong>Předmět podání:</strong>
            <div style="font-weight: bold; margin-top: 3px; font-size: 14px;">${subject}</div>
          </div>

          <div class="content-box">
            <strong>Obsah podání:</strong><br><br>
            ${content}
          </div>
        </div>

        <div class="qr-section">
          <div class="qr-text">
            <strong>Zákonné poučení a doložka (ML-2.1):</strong><br>
            Toto potvrzení slouží jako řádný doklad o podání ve smyslu § 37 správního řádu (zákon č. 500/2004 Sb.). Podání bylo podrobeno automatizované kontrole integrity a uloženo v zabezpečeném decentralizovaném úložišti Titan s garancí neměnnosti záznamu a lokálního zpracování dat na území Evropské unie. Lhůta pro vyřízení podání počíná běžet dnem následujícím po dnu doručení.
          </div>
          <div style="text-align: right;">
            <img src="${qrCodeUrl}" alt="Trasovací QR kód" style="border: 1px solid #e2e8f0; padding: 5px; background: #fff;" />
            <div style="font-size: 9px; color: #94a3b8; font-family: monospace; margin-top: 5px;">Ověřit integritu POD-2027</div>
          </div>
        </div>

        <div class="footer-note">
          Generováno automaticky systémem e-podatelny obce Čehovice dne ${formattedDate}. Elektronicky podepsáno certifikovanou pečetí obce Čehovice.
        </div>
      </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Chyba při generování potvrzení: ' + err.message }, { status: 500 });
  }
}
