import { resend } from "@/lib/resend";

const FROM = process.env.RESEND_FROM_EMAIL || "MysteryIdea <noreply@mysteryidea.com>";

export async function sendWelcomeEmail(to: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mysteryidea.com";
  const displayName = name || "there";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 24px;">
      <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">Welcome to MysteryIdea! 💡</h1>
      <p style="color: #a1a1aa; margin-bottom: 24px;">Hi ${displayName}, we're excited to have you on board.</p>
      <p style="margin-bottom: 16px;">MysteryIdea is a premium marketplace where creators share their best ideas — hidden behind a paywall. Buyers unlock them one at a time.</p>
      <ul style="color: #a1a1aa; margin-bottom: 24px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Browse exclusive and multi-unlock ideas from top creators</li>
        <li style="margin-bottom: 8px;">Pay once, access forever</li>
        <li style="margin-bottom: 8px;">Become a creator and monetize your own ideas</li>
      </ul>
      <a href="${appUrl}/ideas" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Browse Ideas</a>
      <p style="margin-top: 32px; color: #71717a; font-size: 12px;">MysteryIdea — Premium Idea Marketplace</p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to MysteryIdea!",
    html,
  });
}
