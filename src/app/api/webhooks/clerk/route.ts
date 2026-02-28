import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/emails/welcome";

interface ClerkUserCreatedEvent {
  type: "user.created" | "user.updated";
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET not set" },
      { status: 500 }
    );
  }

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const body = await req.text();
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let event: ClerkUserCreatedEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  );
  const email = primaryEmail?.email_address ?? "";
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

  if (type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email,
        name,
        avatarUrl: data.image_url,
      },
    });

    try {
      await sendWelcomeEmail(email, name ?? "");
    } catch (emailErr) {
      console.error("[clerk-webhook] Welcome email failed:", emailErr);
    }
  } else if (type === "user.updated") {
    await prisma.user.updateMany({
      where: { clerkId: data.id },
      data: { email, name, avatarUrl: data.image_url },
    });
  }

  return NextResponse.json({ received: true });
}
