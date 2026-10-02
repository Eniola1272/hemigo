export function emailLayout({
  title,
  previewText,
  bodyHtml,
  actionButton,
}: {
  title: string;
  previewText?: string;
  bodyHtml: string;
  actionButton?: { label: string; url: string };
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #4338ca; padding: 32px 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
    .content { padding: 32px; font-size: 15px; line-height: 1.6; color: #334155; }
    .content p { margin: 0 0 16px; }
    .btn-wrapper { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background-color: #4338ca; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; }
    .footer { border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
    .footer a { color: #64748b; text-decoration: underline; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#fff;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <div class="container">
    <div class="header">
      <h1>Hemigo</h1>
    </div>
    <div class="content">
      ${bodyHtml}
      ${actionButton ? `<div class="btn-wrapper"><a href="${actionButton.url}" class="btn" target="_blank">${actionButton.label}</a></div>` : ""}
    </div>
    <div class="footer">
      <p style="margin:0 0 4px;">Sent by <strong>Hemigo</strong></p>
      <p style="margin:0;">Need help? Contact <a href="mailto:hello@hemigo.com.ng">hello@hemigo.com.ng</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.EMAIL_PROVIDER_API_KEY;
  if (!key) {
    console.info(`[Hemigo email pending key] ${subject} → ${to}`);
    return;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Hemigo <hello@hemigo.com.ng>",
        to,
        subject,
        html,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`[Hemigo email warning] Status ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.warn("[Hemigo email dispatch failed]", error);
  }
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: {
  to: string;
  name?: string | null;
  verificationUrl: string;
}) {
  const html = emailLayout({
    title: "Verify your Hemigo account",
    previewText: "Confirm your email to get started with Hemigo",
    bodyHtml: `
      <p>Hello${name ? ` ${name}` : ""},</p>
      <p>Welcome to Hemigo! Please confirm your email address to activate your store and begin managing selling windows.</p>
      <p>This verification link will expire in 24 hours.</p>
    `,
    actionButton: {
      label: "Verify Account",
      url: verificationUrl,
    },
  });

  await sendEmail({
    to,
    subject: "Verify your Hemigo account",
    html,
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const html = emailLayout({
    title: "Reset your Hemigo password",
    previewText: "Password reset request for your Hemigo account",
    bodyHtml: `
      <p>We received a request to reset the password for your Hemigo account.</p>
      <p>Click the button below to choose a new password. This link is valid for 30 minutes.</p>
      <p style="font-size:13px;color:#64748b;">If you didn't request a password reset, you can safely ignore this email.</p>
    `,
    actionButton: {
      label: "Reset Password",
      url: resetUrl,
    },
  });

  await sendEmail({
    to,
    subject: "Reset your Hemigo password",
    html,
  });
}

export async function sendOrderReceiptEmail(order: {
  customerEmail: string | null;
  orderNumber: string;
  publicToken: string;
  vendorName?: string;
}) {
  if (!order.customerEmail) return;
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/receipt/${order.publicToken}`;
  const html = emailLayout({
    title: `Payment Receipt #${order.orderNumber}`,
    previewText: `Payment confirmed for order #${order.orderNumber}`,
    bodyHtml: `
      <p>Thank you for your order!</p>
      <p>Your payment for order <strong>#${order.orderNumber}</strong> has been successfully processed.</p>
      <p>You can view your receipt and fulfillment updates at any time using the link below.</p>
    `,
    actionButton: {
      label: "View Payment Receipt",
      url,
    },
  });

  await sendEmail({
    to: order.customerEmail,
    subject: `Receipt for order #${order.orderNumber}`,
    html,
  });
}
