import { NextRequest, NextResponse } from 'next/server'

type Answers = {
  name?: string
  project_type?: string
  description?: string
  users?: string
  auth?: string
  integrations?: string
  design?: string
  deadline?: string
  contact_email?: string
  contact_phone?: string
  schedule?: string
}

type LeadPayload = {
  answers: Answers
  budget: { low: number; high: number }
  lang: 'pt' | 'en'
}

export async function POST(req: NextRequest) {
  let body: LeadPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { answers, budget, lang } = body

  //  envio email via Resend 
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL = process.env.LEAD_EMAIL ?? 'hello@frpc.dev'

  if (RESEND_API_KEY) {
    const wantsCall = answers.schedule?.toLowerCase().includes('sim') ||
      answers.schedule?.toLowerCase().includes('yes')

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; color: #18181b; margin: 0; padding: 0; }
  .wrap { background: #f4f4f5; padding: 40px 16px; }
  .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .header { background: #18181b; padding: 28px 32px; }
  .logo { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: #ffffff; }
  .badge { display: inline-block; margin-top: 10px; padding: 4px 12px; background: rgba(52,211,153,0.2); border-radius: 99px; font-size: 12px; font-weight: 600; color: #34d399; }
  .body { padding: 32px; }
  .row { display: flex; gap: 24px; margin-bottom: 20px; }
  .field { flex: 1; }
  .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; margin-bottom: 4px; }
  .value { font-size: 15px; color: #18181b; font-weight: 500; }
  .divider { border: none; border-top: 1px solid #e4e4e7; margin: 24px 0; }
  .budget-box { background: #18181b; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
  .budget-amount { font-size: 30px; font-weight: 700; color: #ffffff; letter-spacing: -0.03em; }
  .budget-label { font-size: 13px; color: rgba(255,255,255,0.45); margin-top: 4px; }
  .call-box { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 10px; padding: 14px 18px; margin-top: 20px; font-size: 14px; color: #4338ca; font-weight: 500; }
  .footer { background: #f4f4f5; padding: 20px 32px; font-size: 12px; color: #a1a1aa; text-align: center; }
</style></head>
<body>
<div class="wrap">
<div class="container">
  <div class="header">
    <div class="logo">FRPC</div>
    <div class="badge">🎯 New Lead</div>
  </div>
  <div class="body">
    <div class="row">
      <div class="field"><div class="label">Name</div><div class="value">${answers.name ?? '—'}</div></div>
      <div class="field"><div class="label">Language</div><div class="value">${lang.toUpperCase()}</div></div>
    </div>
    <div class="row">
      <div class="field"><div class="label">Email</div><div class="value">${answers.contact_email ?? '—'}</div></div>
      <div class="field"><div class="label">Phone</div><div class="value">${answers.contact_phone || '—'}</div></div>
    </div>
    <hr class="divider">
    <div class="row">
      <div class="field"><div class="label">Project Type</div><div class="value">${answers.project_type ?? '—'}</div></div>
      <div class="field"><div class="label">Deadline</div><div class="value">${answers.deadline ?? '—'}</div></div>
    </div>
    <div style="margin-bottom:20px"><div class="label">Description</div><div class="value" style="line-height:1.5">${answers.description ?? '—'}</div></div>
    <div class="row">
      <div class="field"><div class="label">Users</div><div class="value">${answers.users ?? '—'}</div></div>
      <div class="field"><div class="label">Auth</div><div class="value">${answers.auth ?? '—'}</div></div>
      <div class="field"><div class="label">Integrations</div><div class="value">${answers.integrations ?? '—'}</div></div>
    </div>
    <div style="margin-bottom:0"><div class="label">Design</div><div class="value">${answers.design ?? '—'}</div></div>

    <div class="budget-box">
      <div class="budget-amount">€${budget.low.toLocaleString()} — €${budget.high.toLocaleString()}</div>
      <div class="budget-label">Estimated budget range</div>
    </div>

    ${wantsCall ? `<div class="call-box">📞 <strong>Wants a call</strong> — schedule ASAP!</div>` : ''}
  </div>
  <div class="footer">Sent by the FRPC lead assistant · ${new Date().toISOString()}</div>
</div>
</div>
</body>
</html>`

    const subject = `New lead: ${answers.name ?? 'Unknown'} — ${answers.project_type ?? 'project'}`

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FRPC Lead Assistant <noreply@frpc.pt>',
          to: [TO_EMAIL],
          reply_to: answers.contact_email ? [answers.contact_email] : undefined,
          subject,
          html: emailHtml,
        }),
      })
    } catch {
      // Email failure is non-fatal
    }

    // Send confirmation to the lead
    if (answers.contact_email) {
      const isPt = lang === 'pt'
      const confirmHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;color:#18181b;margin:0;padding:0}
  .wrap{background:#f4f4f5;padding:40px 16px}
  .c{max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)}
  .hdr{background:#18181b;padding:28px 32px}
  .logo{font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#fff}
  .bdy{padding:32px}
  .title{font-size:22px;font-weight:700;color:#18181b;margin-bottom:12px}
  .txt{font-size:15px;color:#52525b;line-height:1.65;margin-bottom:24px}
  .budget{background:#18181b;border-radius:12px;padding:24px;text-align:center;margin:24px 0}
  .amount{font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.03em}
  .blabel{font-size:13px;color:rgba(255,255,255,.4);margin-top:4px}
  .note{font-size:14px;color:#52525b;line-height:1.6}
  .ftr{background:#f4f4f5;padding:20px 32px;font-size:12px;color:#a1a1aa;text-align:center}
</style></head>
<body><div class="wrap"><div class="c">
  <div class="hdr"><div class="logo">FRPC</div></div>
  <div class="bdy">
    <div class="title">${isPt ? `Obrigado, ${answers.name}! 🎉` : `Thank you, ${answers.name}! 🎉`}</div>
    <div class="txt">${isPt ? 'Recebemos a tua mensagem e entraremos em contacto em breve.<br><br>Aqui está um resumo da tua estimativa:' : "We've received your message and will be in touch soon.<br><br>Here's a summary of your estimate:"}</div>
    <div class="budget">
      <div class="amount">€${budget.low.toLocaleString()} — €${budget.high.toLocaleString()}</div>
      <div class="blabel">${isPt ? `Orçamento estimado · ${answers.project_type}` : `Estimated budget · ${answers.project_type}`}</div>
    </div>
    <div class="note">${wantsCall
      ? (isPt ? 'Vais receber um link de agendamento em breve. Até já! 👋' : "You'll receive a scheduling link shortly. Talk soon! 👋")
      : (isPt ? 'A nossa equipa entrará em contacto em breve. Até já! 👋' : 'Our team will reach out soon. Talk soon! 👋')
    }</div>
  </div>
  <div class="ftr">FRPC · frpc.pt</div>
</div></div></body></html>`

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'FRPC <noreply@frpc.pt>',
            to: [answers.contact_email],
            subject: lang === 'pt' ? 'Recebemos a tua mensagem! — FRPC' : 'We received your message! — FRPC',
            html: confirmHtml,
          }),
        })
      } catch {
        // Email failure is non-fatal
      }
    }
  }

  return NextResponse.json({ ok: true })
}
