import { NextResponse } from "next/server";

// Basic email validation regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as Record<string, unknown>).email).trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  // TODO: Integrate with your email service provider (e.g. Mailchimp, Resend, ConvertKit).
  // For now this endpoint validates the email and returns success.
  // Example Resend integration:
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });

  return NextResponse.json({ ok: true }, { status: 200 });
}
