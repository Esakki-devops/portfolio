import { contactSchema } from "@/lib/contact-schema";

/** Reject oversized bodies before parsing. */
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // NOTE: there is no mail transport wired up yet, so a 200 here means
  // "accepted and validated", NOT "delivered". Add Resend/SES/SendGrid before
  // relying on this in production.
  console.info("[contact] submission", {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    length: parsed.data.message.length,
  });

  return Response.json({ ok: true, delivered: false });
}
