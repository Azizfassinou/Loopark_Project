import { Resend } from 'resend';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const FROM_EMAIL = 'Loopark <contact@loopark.fr>';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendVerificationEmail(
  to: string,
  name: string | null | undefined,
  token: string
) {
  // Skip sending in dev if API key is missing or is a placeholder
  if (!RESEND_API_KEY || RESEND_API_KEY.startsWith('re_VOTRE')) {
    const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
    console.log('\n📧 [DEV] Email verification skipped (no API key)');
    console.log(`   → Verification URL: ${verifyUrl}\n`);
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  const displayName = name ?? 'là';

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Confirmez votre adresse email — Loopark',
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:32px 40px 24px;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.5px;">Loopark</span>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h1 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#0a0a0a;">Confirmez votre email</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
            Bonjour ${displayName},<br><br>
            Merci de vous être inscrit sur <strong>Loopark</strong>. Pour activer votre compte, confirmez votre adresse email.
          </p>
          <a href="${verifyUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:6px;">
            Confirmer mon email
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.6;">
            Ce lien expire dans <strong>24 heures</strong>.<br>
            <a href="${verifyUrl}" style="color:#16a34a;word-break:break-all;">${verifyUrl}</a>
          </p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Loopark</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
  });

  if (error) {
    // Log the verify URL to console so dev can use it manually
    console.warn('\n⚠️  [Resend] Email send failed:', error.message);
    console.log(`📧 [DEV] Use this URL to verify manually:\n   ${verifyUrl}\n`);
    // Don't throw — account creation already succeeded
  }
}
