import { resend } from "@/lib/resend";

const FROM = process.env.RESEND_FROM_EMAIL || "MysteryIdea <noreply@mysteryidea.com>";

export async function sendPurchaseConfirmationEmail(
  to: string,
  ideaTitle: string,
  amountInCents: number,
  ideaId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mysteryidea.com";
  const formattedAmount = (amountInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 24px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">🔓 You unlocked: ${ideaTitle}</h1>
      <p style="color: #a1a1aa; margin-bottom: 24px;">Your purchase was successful. Here are your details:</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #a1a1aa; border-bottom: 1px solid #27272a;">Idea</td>
          <td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #27272a;">${ideaTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #a1a1aa; border-bottom: 1px solid #27272a;">Amount Paid</td>
          <td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #27272a;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #a1a1aa;">Date</td>
          <td style="padding: 8px 0; text-align: right;">${formattedDate}</td>
        </tr>
      </table>
      <a href="${appUrl}/ideas/${ideaId}" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Your Idea</a>
      <p style="margin-top: 32px; color: #71717a; font-size: 12px;">MysteryIdea — Premium Idea Marketplace</p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `You unlocked: ${ideaTitle}`,
    html,
  });
}
