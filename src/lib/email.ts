export async function sendRegistrationEmail({
  email,
  name,
  registrationId,
  amountCad,
}: {
  email: string
  name: string
  registrationId: string
  amountCad: number
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Email not sent.')
    return { ok: false, code: 'resend_key_missing' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'PassionFruits <no-reply@passionfruits.ca>',
        to: [email],
        subject: `[PassionFruits] Conference 2026 Registration & Payment Confirmed - ${registrationId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6D28D9; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.05em; text-transform: uppercase;">PassionFruits</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; color: #94a3b8; text-transform: uppercase;">Conference 2026</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; margin-bottom: 15px;">
                <span style="font-size: 32px; color: #059669; line-height: 64px; font-weight: bold;">✓</span>
              </div>
              <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0;">Registration & Payment Confirmed!</h2>
              <p style="font-size: 14px; color: #10b981; font-weight: 700; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 0.05em;">결제 및 등록이 완료되었습니다</p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Your payment has been successfully processed and your registration for the PassionFruits Conference 2026: <strong>Judges: Conquest to Conquer</strong> is now officially confirmed.</p>
            
            <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Confirmation Details</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; font-weight: 600;">Registration ID</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6D28D9; font-weight: 800; text-align: right;">${registrationId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; font-weight: 600;">Amount Paid</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 800; text-align: right;">${amountCad} CAD</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; font-weight: 600;">Payment Status</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #059669; font-weight: 800; text-align: right;">PAID (결제 완료)</td>
                </tr>
              </table>
            </div>

            <div style="margin: 25px 0; padding: 20px; background-color: #faf5ff; border-radius: 16px; border: 1px solid #f3e8ff; text-align: center;">
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #6D28D9; line-height: 1.5;">
                PassionFruits 앱을 다운로드하셔서 컨퍼런스 세부 일정과 최신 소식을 간편하게 확인해보세요!
              </p>
              <a href="https://www.passionfruits.ca/app/download?install=1" style="display: inline-block; background-color: #6D28D9; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-top: 12px; letter-spacing: 0.05em; box-shadow: 0 4px 6px -1px rgba(109, 40, 217, 0.2);">
                Download App
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 5px 0;"><strong>Need help?</strong> Contact us at <a href="mailto:passionfruitsministry@gmail.com" style="color: #6D28D9; text-decoration: none; font-weight: 700;">passionfruitsministry@gmail.com</a></p>
              <p style="margin: 0;">Blessings,<br/><strong>PassionFruits Ministry Team</strong></p>
            </div>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send email via Resend:', errorText)
      return { ok: false, error: errorText }
    }

    return { ok: true }
  } catch (error) {
    console.error('Error sending email via Resend:', error)
    return { ok: false, error }
  }
}
