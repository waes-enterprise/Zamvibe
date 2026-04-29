/**
 * ZamVibe — Email Notification System
 *
 * When EMAIL_API_KEY is set, emails are sent via Resend-compatible API.
 * When it is not set, all functions are no-ops that log to console
 * so the rest of the app works without a live key.
 */

// ─── Config ────────────────────────────────────────────────────────────
const API_KEY = process.env.EMAIL_API_KEY
const FROM = process.env.EMAIL_FROM || 'noreply@zamvibe.com'
const RESEND_API = 'https://api.resend.com/emails'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://zamvibe.vercel.app'

const isEnabled = () => Boolean(API_KEY)

// ─── Generic sender ────────────────────────────────────────────────────
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!isEnabled()) {
    console.log(`[Email – NO-OP] To: ${to} | Subject: ${subject}`)
    return
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`[Email] Failed to send to ${to}: ${res.status} – ${body}`)
    }
  } catch (err) {
    console.error(`[Email] Error sending to ${to}:`, err)
  }
}

// ─── HTML template builder ─────────────────────────────────────────────
function buildEmailHtml(content: string): string {
  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ZamVibe</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.3);">

          <!-- Header -->
          <tr>
            <td style="background-color:#ff4444;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                🎬 ZamVibe
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;text-align:center;border-top:1px solid #272727;">
              <p style="margin:0;color:#aaaaaa;font-size:13px;">
                ZamVibe &mdash; Africa&apos;s #1 Entertainment Hub
              </p>
              <p style="margin:8px 0 0;color:#666666;font-size:12px;">
                You received this email because you signed up on ZamVibe.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Star helper ───────────────────────────────────────────────────────
function stars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

// ─── Exported email functions ──────────────────────────────────────────

/** Welcome email sent after registration */
export function sendWelcomeEmail(name: string, email: string): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">Welcome to ZamVibe, ${escapeHtml(name)}!</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      Thank you for joining ZamVibe — Africa&apos;s #1 entertainment hub.
    </p>
    <p style="margin:0 0 24px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      Stay tuned for the latest in music, celebrity gossip, movies, fashion, and viral trends.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:#ff4444;border-radius:6px;">
          <a href="${APP_URL}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
            Start Exploring
          </a>
        </td>
      </tr>
    </table>
  `)

  // Fire-and-forget
  sendEmail(email, 'Welcome to ZamVibe! 🎬', html).catch(() => {})
}

/** New-message notification for the recipient of a conversation */
export function sendNewMessageNotification(
  name: string,
  email: string,
  senderName: string,
  listingTitle: string,
): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">New Message 💬</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      <strong>${escapeHtml(senderName)}</strong> started a conversation with you about:
    </p>
    <blockquote style="margin:0 0 24px;padding:12px 16px;border-left:4px solid #ff4444;background-color:#ff4444/10;border-radius:0 4px 4px 0;">
      <p style="margin:0;color:#ffffff;font-size:15px;">${escapeHtml(listingTitle)}</p>
    </blockquote>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:#ff4444;border-radius:6px;">
          <a href="${APP_URL}/inbox" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
            Open Inbox
          </a>
        </td>
      </tr>
    </table>
  `)

  sendEmail(
    email,
    `New message about "${listingTitle}"`,
    html,
  ).catch(() => {})
}

/** New-review notification for the listing owner */
export function sendNewReviewNotification(
  name: string,
  email: string,
  listingTitle: string,
  rating: number,
): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">New Review ⭐</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      Your listing just received a new review!
    </p>
    <blockquote style="margin:0 0 24px;padding:12px 16px;border-left:4px solid #ff4444;background-color:#ff4444/10;border-radius:0 4px 4px 0;">
      <p style="margin:0 0 4px;color:#ffffff;font-size:15px;font-weight:600;">${escapeHtml(listingTitle)}</p>
      <p style="margin:0;color:#ff4444;font-size:18px;">${stars(rating)}</p>
    </blockquote>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:#ff4444;border-radius:6px;">
          <a href="${APP_URL}/listings" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
            View Listing
          </a>
        </td>
      </tr>
    </table>
  `)

  sendEmail(
    email,
    `New review on "${listingTitle}"`,
    html,
  ).catch(() => {})
}

/** Listing-approved notification */
export function sendListingApprovedEmail(
  name: string,
  email: string,
  listingTitle: string,
): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">Listing Approved ✅</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      Great news, ${escapeHtml(name)}! Your listing has been approved and is now live on ZamVibe.
    </p>
    <blockquote style="margin:0 0 24px;padding:12px 16px;border-left:4px solid #ff4444;background-color:#ff4444/10;border-radius:0 4px 4px 0;">
      <p style="margin:0;color:#ffffff;font-size:15px;">${escapeHtml(listingTitle)}</p>
    </blockquote>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:#ff4444;border-radius:6px;">
          <a href="${APP_URL}/listings" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
            View My Listings
          </a>
        </td>
      </tr>
    </table>
  `)

  sendEmail(
    email,
    `Your listing "${listingTitle}" is now live!`,
    html,
  ).catch(() => {})
}

/** Password-reset email with 6-digit code */
export function sendPasswordResetEmail(
  name: string,
  email: string,
  resetCode: string,
): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">Password Reset 🔐</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      Hi ${escapeHtml(name)}, we received a request to reset your password. Use the code below to proceed.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
      <tr>
        <td style="background-color:#272727;border-radius:8px;padding:16px 32px;text-align:center;">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#ffffff;">${escapeHtml(resetCode)}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;color:#666666;font-size:13px;line-height:1.5;">
      This code expires in <strong>15 minutes</strong>. If you didn&apos;t request this, you can safely ignore this email.
    </p>
  `)

  sendEmail(
    email,
    'Your password reset code',
    html,
  ).catch(() => {})
}

/** Contact form notification email */
export function sendContactEmail(data: { name: string; email: string; subject: string; message: string }): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">New Contact Form Submission</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      You received a new message from the ZamVibe contact form.
    </p>
    <blockquote style="margin:0 0 24px;padding:16px;border-left:4px solid #ff4444;background-color:#1a1a1a;border-radius:0 8px 8px 0;">
      <p style="margin:0 0 8px;color:#ffffff;font-size:14px;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p style="margin:0 0 8px;color:#ffffff;font-size:14px;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p style="margin:0 0 8px;color:#ffffff;font-size:14px;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <p style="margin:0;color:#aaaaaa;font-size:14px;line-height:1.6;">${escapeHtml(data.message)}</p>
    </blockquote>
  `)

  sendEmail(
    process.env.ADMIN_EMAIL || 'admin@zamvibe.com',
    `ZamVibe Contact: ${data.subject}`,
    html,
  ).catch(() => {})
}

/** Newsletter confirmation email */
export function sendNewsletterConfirmation(email: string): void {
  const html = buildEmailHtml(/* html */ `
    <h2 style="margin:0 0 16px;font-size:20px;color:#ffffff;">You're Subscribed! 🎉</h2>
    <p style="margin:0 0 16px;color:#aaaaaa;font-size:15px;line-height:1.6;">
      Thanks for subscribing to the ZamVibe newsletter! You'll now receive the latest entertainment news, trending stories, and exclusive content straight to your inbox.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:#ff4444;border-radius:6px;">
          <a href="${APP_URL}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
            Explore ZamVibe
          </a>
        </td>
      </tr>
    </table>
  `)

  sendEmail(email, 'Welcome to ZamVibe Newsletter! 🎬', html).catch(() => {})
}

// ─── Helpers ───────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
