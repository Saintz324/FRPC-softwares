import { NextRequest, NextResponse } from 'next/server'

type PropostaPayload = {
  nome: string
  empresa: string
  email: string
  telefone?: string
  solucao: string
  utilizadores: string
  mensagem: string
}

export async function POST(req: NextRequest) {
  let body: PropostaPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL = 'it@frpc-tech.pt'

  if (!RESEND_API_KEY) {
    console.error('[proposta] RESEND_API_KEY not set — email skipped')
  }

  if (RESEND_API_KEY) {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; color: #18181b; margin: 0; padding: 0; }
  .wrap { background: #f4f4f5; padding: 40px 16px; }
  .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .header { background: #18181b; padding: 28px 32px; }
  .logo { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: #ffffff; }
  .badge { display: inline-block; margin-top: 10px; padding: 4px 12px; background: rgba(96,165,250,0.2); border-radius: 99px; font-size: 12px; font-weight: 600; color: #60a5fa; }
  .body { padding: 32px; }
  .row { display: flex; gap: 24px; margin-bottom: 20px; }
  .field { flex: 1; }
  .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; margin-bottom: 4px; }
  .value { font-size: 15px; color: #18181b; font-weight: 500; }
  .divider { border: none; border-top: 1px solid #e4e4e7; margin: 24px 0; }
  .highlight-box { background: #18181b; border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
  .highlight-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
  .highlight-value { font-size: 18px; font-weight: 700; color: #ffffff; }
  .msg-box { background: #f9f9f9; border: 1px solid #e4e4e7; border-radius: 10px; padding: 16px 20px; margin-top: 4px; font-size: 14px; color: #3f3f46; line-height: 1.6; }
  .footer { background: #f4f4f5; padding: 20px 32px; font-size: 12px; color: #a1a1aa; text-align: center; }
</style></head>
<body>
<div class="wrap">
<div class="container">
  <div class="header">
    <div class="logo">FRPC</div>
    <div class="badge">📋 Nova Proposta</div>
  </div>
  <div class="body">
    <div class="row">
      <div class="field"><div class="label">Nome</div><div class="value">${body.nome ?? '—'}</div></div>
      <div class="field"><div class="label">Empresa</div><div class="value">${body.empresa ?? '—'}</div></div>
    </div>
    <div class="row">
      <div class="field"><div class="label">Email</div><div class="value">${body.email ?? '—'}</div></div>
      <div class="field"><div class="label">Telefone</div><div class="value">${body.telefone || '—'}</div></div>
    </div>
    <hr class="divider">
    <div class="highlight-box">
      <div class="highlight-label">Solução pretendida</div>
      <div class="highlight-value">${body.solucao ?? '—'}</div>
    </div>
    <div class="row">
      <div class="field"><div class="label">Nº utilizadores</div><div class="value">${body.utilizadores ?? '—'}</div></div>
    </div>
    <div style="margin-bottom:0">
      <div class="label">Descrição da necessidade</div>
      <div class="msg-box">${(body.mensagem ?? '—').replace(/\n/g, '<br>')}</div>
    </div>
  </div>
  <div class="footer">Enviado pelo formulário de propostas FRPC · ${new Date().toISOString()}</div>
</div>
</div>
</body>
</html>`

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FRPC Propostas <noreply@frpc-tech.pt>',
          to: [TO_EMAIL],
          reply_to: body.email ? [body.email] : undefined,
          subject: `Nova proposta: ${body.nome ?? 'Desconhecido'} — ${body.solucao ?? 'solução'}`,
          html: emailHtml,
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error('[proposta] Resend error:', res.status, err)
      }
    } catch (e) {
      console.error('[proposta] Resend fetch failed:', e)
    }
  }

  return NextResponse.json({ ok: true })
}
