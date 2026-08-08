export async function sendRegistrationEmail({
  email,
  name,
  registrationId,
  idempotencyKey,
}: {
  email: string
  name: string
  registrationId: string
  amountCad?: number
  paymentStatus?: string
  idempotencyKey?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Email not sent.')
    return { ok: false, code: 'resend_key_missing' }
  }

  const logoUrl = 'https://raw.githubusercontent.com/Isaacshon/pfweb/main/public/IMG_6847_cropped.png'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'PassionFruits <no-reply@passionfruits.ca>',
        to: [email],
        subject: `[PassionFruits] Conference 2026 Registration Confirmed - ${registrationId}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="overflow:hidden;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;box-shadow:0 10px 25px -5px rgba(0,0,0,.05);">
              <div style="background:#9a78b4;padding:24px 16px;text-align:center;">
                <img src="${logoUrl}" alt="PassionFruits Logo" style="height:110px;max-width:100%;width:auto;display:inline-block;border:0;" />
              </div>
              <div style="height:6px;background:#fffbbd;"></div>
              <div style="padding:40px 32px;">
                <h2 style="margin:0 0 20px;color:#9a78b4;font-size:22px;font-weight:800;">Registration Confirmed</h2>
                <p style="margin:0 0 14px;color:#121c2a;font-size:15px;line-height:1.6;">Dear <strong>${name}</strong>,</p>
                <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.7;">Thank you for registering for PassionFruits Conference 2026: <strong>Judges: Conquest to Conquer</strong>. Your registration form has been received successfully.</p>
                <div style="margin:24px 0;padding:20px;border-radius:12px;background:#f8f9ff;border-left:4px solid #fffbbd;">
                  <p style="margin:0 0 10px;color:#9a78b4;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;">Registration Summary</p>
                  <p style="margin:0;color:#64748b;font-size:13px;">Registration ID</p>
                  <p style="margin:5px 0 0;color:#121c2a;font-size:18px;font-weight:800;">${registrationId}</p>
                </div>
                <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
                  <p style="margin:0 0 5px;"><strong>Need help?</strong> Contact <a href="mailto:passionfruitsministry@gmail.com" style="color:#9a78b4;text-decoration:none;font-weight:700;">passionfruitsministry@gmail.com</a>.</p>
                  <p style="margin:0;">Blessings,<br/><strong>PassionFruits Ministry Team</strong></p>
                </div>
              </div>
            </div>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send email via Resend:', errorText)
      return { ok: false, code: 'email_send_failed' }
    }

    return { ok: true }
  } catch (error) {
    console.error('Error sending email via Resend:', error)
    return { ok: false, error }
  }
}
