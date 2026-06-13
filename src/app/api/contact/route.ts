import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "stargpsgeo2016@gmail.com";

// Without a verified domain, Resend only sends from this shared address.
// Swap to "Alfred <alfred@yourdomain.com>" once a domain is verified.
const FROM_EMAIL = "Alfred <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const company = String(body?.company ?? "").trim(); // honeypot: must be empty

    // Bots fill hidden fields; humans don't. Pretend success and drop it.
    if (company) {
      return Response.json({ ok: true });
    }

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are all required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return Response.json(
        { error: "That email address doesn't look right." },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return Response.json(
        { error: "Message is too long (5000 character max)." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#0f172a">
          <h2 style="margin:0 0 16px">New portfolio enquiry</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <div style="padding:16px;background:#f1f5f9;border-radius:8px;white-space:pre-wrap">${escapeHtml(
            message
          )}</div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Couldn't send the message. Please try again shortly." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, id: data?.id });
  } catch (err: unknown) {
    console.error("Contact route error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
