export async function sendRegistrationEmail({
  email,
  name,
  registrationId,
  amountCad,
  checkoutUrl,
}: {
  email: string
  name: string
  registrationId: string
  amountCad: number
  checkoutUrl: string
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
        subject: `[PassionFruits] Conference 2026 Registration Confirmation - ${registrationId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6D28D9; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.05em; text-transform: uppercase;">PassionFruits</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; color: #94a3b8; text-transform: uppercase;">Conference 2026</p>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0;">Registration Received!</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Thank you for registering for the PassionFruits Conference 2026: <strong>Judges: Conquest to Conquer</strong>.</p>
            
            <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Registration Details</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; font-weight: 600;">Registration ID</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6D28D9; font-weight: 800; text-align: right;">${registrationId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; font-weight: 600;">Registration Fee</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 800; text-align: right;">${amountCad} CAD</td>
                </tr>
              </table>
            </div>

            ${checkoutUrl ? `
            <div style="margin: 35px 0; text-align: center;">
              <a href="${checkoutUrl}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 9999px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                Proceed to Payment
              </a>
              <p style="font-size: 12px; color: #64748b; margin-top: 15px; font-weight: 600;">Please click the button above to secure your registration via Square.</p>
            </div>
            ` : ''}

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
