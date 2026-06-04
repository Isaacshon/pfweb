export async function sendRegistrationEmail({
  email,
  name,
  registrationId,
  amountCad,
  paymentStatus = 'paid',
}: {
  email: string
  name: string
  registrationId: string
  amountCad: number
  paymentStatus?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Email not sent.')
    return { ok: false, code: 'resend_key_missing' }
  }

  const logoUrl = 'https://raw.githubusercontent.com/Isaacshon/pfweb/main/public/IMG_6847_cropped.png'
  const isPaid = paymentStatus === 'paid'
  const subjectText = isPaid ? 'Registration & Payment Confirmed' : 'Registration Received (Payment Pending)'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'PassionFruits <no-reply@passionfruits.ca>',
        to: [email],
        subject: `[PassionFruits] Conference 2026 ${subjectText} - ${registrationId}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: transparent;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              
              <!-- Premium Header Banner with Logo (Brand Purple #9a78b4) -->
              <div style="background-color: #9a78b4; padding: 24px 16px; text-align: center;">
                <img src="${logoUrl}" alt="PassionFruits Logo" style="height: 110px; max-width: 100%; width: auto; display: inline-block; border: none; outline: none; vertical-align: middle;" />
              </div>
              
              <!-- Brand Yellow Accent Line -->
              <div style="background-color: #fffbbd; height: 6px; width: 100%;"></div>

              <!-- Main Content Body -->
              <div style="padding: 40px 32px;">
                
                <!-- Content Title -->
                <h2 style="font-size: 20px; font-weight: 800; color: #9a78b4; margin-top: 0; margin-bottom: 12px; padding-bottom: 10px; letter-spacing: -0.02em;">
                  ${isPaid ? 'Registration & Payment Confirmed' : 'Registration Received'}
                </h2>
                
                <!-- Message -->
                <p style="font-size: 15px; line-height: 1.6; color: #121c2a; margin-top: 20px; margin-bottom: 16px;">Dear <strong>${name}</strong>,</p>
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 0; margin-bottom: 12px;">Thank you for registering for the PassionFruits Conference 2026: <strong>Judges: Conquest to Conquer</strong>.</p>
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 0; margin-bottom: 24px;">
                  ${isPaid 
                    ? 'Your payment has been successfully processed and your registration is now confirmed. We look forward to worshipping, growing, and encountering God together with you!' 
                    : 'Your registration form has been received. Please complete your payment to finalize your registration. We look forward to seeing you!'}
                </p>
                
                <!-- Details Receipt Table -->
                <div style="margin: 25px 0; padding: 20px; background-color: #f8f9ff; border-radius: 12px; border-left: 4px solid #fffbbd;">
                  <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; color: #9a78b4; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Registration Summary</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Registration ID</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #9a78b4; font-weight: 800; text-align: right;">${registrationId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Event</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #121c2a; font-weight: 700; text-align: right;">PassionFruits Conference 2026</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Amount</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #121c2a; font-weight: 800; text-align: right;">${amountCad} CAD</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Payment Status</td>
                      <td style="padding: 6px 0; font-size: 13px; color: #9a78b4; font-weight: 800; text-align: right; text-transform: uppercase;">
                        ${isPaid ? 'Paid' : 'Pending'}
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Download App Link & QR Code -->
                <div style="margin: 35px 0; text-align: center; background-color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-top: 4px solid #fffbbd; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <p style="font-size: 16px; font-weight: 800; color: #121c2a; margin: 0 0 15px 0;">Get the PassionFruits App</p>
                  <p style="font-size: 13px; line-height: 1.5; color: #475569; margin: 0 0 20px 0;">
                    Scan the QR code below or tap the button to easily check the conference schedule, announcements, and stay updated!
                  </p>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.passionfruits.ca/app/download?install=1" alt="App Download QR Code" style="width: 150px; height: 150px; margin-bottom: 20px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 5px;" />
                  <br />
                  <a href="https://www.passionfruits.ca/app/download?install=1" style="display: inline-block; background-color: #9a78b4; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 8px; font-size: 14px;">Download App</a>
                </div>

                <!-- Support Info -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6;">
                  <p style="margin: 0 0 5px 0;"><strong>Need help?</strong> Feel free to contact us at <a href="mailto:passionfruitsministry@gmail.com" style="color: #9a78b4; text-decoration: none; font-weight: 700;">passionfruitsministry@gmail.com</a> and we will be happy to assist you.</p>
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
