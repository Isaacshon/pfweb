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

  // Dynamic QR Code generation for email clients (which cannot render SVG dynamically)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent('https://www.passionfruits.ca/app/download?install=1')}`
  const logoUrl = 'https://www.passionfruits.ca/IMG_6847.PNG'

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
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
              
              <!-- Premium Header Banner with Logo (Background removed, padding compacted) -->
              <div style="background-color: #ffffff; padding: 20px 16px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                <img src="${logoUrl}" alt="PassionFruits" style="height: 72px; width: auto; display: inline-block; border: none; outline: none; vertical-align: middle;" />
              </div>

              <!-- Main Content Body -->
              <div style="padding: 40px 32px;">
                
                <!-- Success Header -->
                <div style="text-align: center; margin-bottom: 35px;">
                  <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; margin-bottom: 16px; border: 1px solid #d1fae5; text-align: center;">
                    <span style="font-size: 32px; color: #10b981; line-height: 64px; font-weight: bold; font-family: system-ui, -apple-system, sans-serif;">✓</span>
                  </div>
                  <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.03em;">Registration Confirmed!</h2>
                  <p style="font-size: 13px; color: #059669; font-weight: 800; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Payment Completed</p>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-top: 0; margin-bottom: 16px;">
                  Dear <strong>${name}</strong>,
                </p>
                
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 0; margin-bottom: 28px;">
                  Your payment has been successfully processed and your registration for the PassionFruits Conference 2026: <strong>Judges: Conquest to Conquer</strong> is now officially confirmed. We are looking forward to worshipping, growing, and encountering God together with you!
                </p>
                
                <!-- Receipt details in box -->
                <div style="background-color: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 35px;">
                  <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Registration Summary</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Registration ID</td>
                      <td style="padding: 8px 0; font-size: 13px; color: #6D28D9; font-weight: 800; text-align: right;">${registrationId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Event</td>
                      <td style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right;">PassionFruits Conference 2026</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Amount Paid</td>
                      <td style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right;">${amountCad} CAD</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Payment Status</td>
                      <td style="padding: 8px 0; font-size: 13px; color: #059669; font-weight: 800; text-align: right; text-transform: uppercase;">Paid</td>
                    </tr>
                  </table>
                </div>

                <!-- Custom App Download Banner with image QR code -->
                <div style="background-color: #faf5ff; border-radius: 20px; border: 1px solid #f3e8ff; padding: 28px 24px; text-align: center; box-shadow: inset 0 2px 4px 0 rgba(109, 40, 217, 0.02);">
                  <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 800; color: #6D28D9; letter-spacing: -0.01em;">Download the PassionFruits App!</h3>
                  <p style="margin: 0 0 20px 0; font-size: 12px; line-height: 1.5; color: #7c3aed; font-weight: 600;">
                    Download the app to easily check the conference schedule, announcements, and stay updated.
                  </p>
                  
                  <!-- White box wrapper for the QR image -->
                  <div style="margin-bottom: 20px; display: inline-block; background-color: #ffffff; padding: 12px; border-radius: 16px; border: 1px solid #e9d5ff; box-shadow: 0 4px 10px rgba(109, 40, 217, 0.04);">
                    <img src="${qrCodeUrl}" alt="App Download QR Code" style="width: 120px; height: 120px; display: block; border: none;" />
                  </div>
                  
                  <div>
                    <a href="https://www.passionfruits.ca/app/download?install=1" style="display: inline-block; background-color: #6D28D9; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; box-shadow: 0 4px 14px rgba(109, 40, 217, 0.25); transition: all 0.2s;">
                      Download App
                    </a>
                  </div>
                </div>

                <!-- Modern Footer Support Info -->
                <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; line-height: 1.6;">
                  <p style="margin: 0 0 6px 0;"><strong>Need help?</strong> Feel free to contact us at <a href="mailto:passionfruitsministry@gmail.com" style="color: #6D28D9; text-decoration: none; font-weight: 700;">passionfruitsministry@gmail.com</a> and we will be happy to assist you.</p>
                  <p style="margin: 0;">Blessings,<br/><strong>PassionFruits Ministry Team</strong></p>
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
      return { ok: false, code: 'resend_key_missing' }
    }

    return { ok: true }
  } catch (error) {
    console.error('Error sending email via Resend:', error)
    return { ok: false, error }
  }
}
