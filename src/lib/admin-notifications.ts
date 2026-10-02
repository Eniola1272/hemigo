import { sendEmail, emailLayout } from "@/lib/email";

interface NewUserParams {
  name?: string | null;
  email: string;
  provider: "Email & Password" | "Google OAuth";
}

interface NewStoreParams {
  storeName: string;
  slug: string;
  category?: string | null;
  ownerName?: string | null;
  ownerEmail: string;
}

/**
 * Send a notification to Telegram if bot credentials are configured
 */
export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.warn("[Telegram notification failed]", res.status, err);
    }
  } catch (error) {
    console.warn("[Telegram notification error]", error);
  }
}

/**
 * Notify the admin via Email and Telegram when a new user registers
 */
export async function notifyAdminNewUser({ name, email, provider }: NewUserParams) {
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "hello@hemigo.com.ng";

  const timeString = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // 1. Email notification
  const emailPromise = sendEmail({
    to: adminEmail,
    subject: `🎉 New Hemigo Signup: ${name || email}`,
    html: emailLayout({
      title: "New User Registered",
      previewText: `${name || email} just signed up on Hemigo`,
      bodyHtml: `
        <p style="font-size: 16px; font-weight: bold; color: #1e1b4b; margin-bottom: 16px;">
          🎉 A new user just joined Hemigo!
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px;">Name:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${name || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Signup Method:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #4338ca;">${provider}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Time:</td>
            <td style="padding: 8px 0; color: #0f172a;">${timeString} WAT</td>
          </tr>
        </table>
      `,
      actionButton: {
        label: "View Users in Dashboard",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://hemigo.com.ng"}/dashboard/customers`,
      },
    }),
  }).catch((err) => console.warn("[Admin email alert error]", err));

  // 2. Telegram notification
  const telegramText = `🎉 *New User Registered on Hemigo!*

👤 *Name:* ${name || "Not provided"}
📧 *Email:* \`${email}\`
🔑 *Method:* ${provider}
⏰ *Time:* ${timeString} WAT`;

  const telegramPromise = sendTelegramMessage(telegramText);

  await Promise.allSettled([emailPromise, telegramPromise]);
}

/**
 * Notify the admin via Email and Telegram when a merchant completes onboarding and creates a store
 */
export async function notifyAdminNewStore({
  storeName,
  slug,
  category,
  ownerName,
  ownerEmail,
}: NewStoreParams) {
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "hello@hemigo.com.ng";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hemigo.com.ng";
  const storeUrl = `${appUrl}/${slug}`;

  // 1. Email notification
  const emailPromise = sendEmail({
    to: adminEmail,
    subject: `🏪 New Store Created: ${storeName} (${slug})`,
    html: emailLayout({
      title: "New Store Created",
      previewText: `${storeName} is now live on Hemigo`,
      bodyHtml: `
        <p style="font-size: 16px; font-weight: bold; color: #1e1b4b; margin-bottom: 16px;">
          🏪 A merchant just launched a new store!
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px;">Store Name:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${storeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Handle:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #4338ca;">${slug}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Category:</td>
            <td style="padding: 8px 0; color: #0f172a;">${category || "Uncategorized"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Owner:</td>
            <td style="padding: 8px 0; color: #0f172a;">${ownerName || "Merchant"} (${ownerEmail})</td>
          </tr>
        </table>
      `,
      actionButton: {
        label: "Visit Storefront",
        url: storeUrl,
      },
    }),
  }).catch((err) => console.warn("[Admin store email alert error]", err));

  // 2. Telegram notification
  const telegramText = `🏪 *New Store Launched on Hemigo!*

🏷️ *Store:* ${storeName}
🔗 *Link:* ${storeUrl}
📂 *Category:* ${category || "General"}
👤 *Owner:* ${ownerName || "Merchant"} (\`${ownerEmail}\`)`;

  const telegramPromise = sendTelegramMessage(telegramText);

  await Promise.allSettled([emailPromise, telegramPromise]);
}
