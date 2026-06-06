import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Rate limiting: simple in-memory store (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max 3 submissions per window
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

function buildEmailHtml(data: {
  name: string;
  email: string;
  whatsapp?: string;
  subject?: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pesan Baru dari Portfolio</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#00FF88,#0099FF);padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="width:48px;height:48px;background:rgba(10,10,15,0.3);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#fff;vertical-align:middle;margin-right:12px;line-height:48px;text-align:center;">DR</div>
                    <span style="font-size:20px;font-weight:700;color:#0A0A0F;vertical-align:middle;">Daffa Rizky Portfolio</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <h1 style="margin:0;font-size:28px;font-weight:800;color:#0A0A0F;line-height:1.2;">
                      📬 Pesan Baru Masuk!
                    </h1>
                    <p style="margin:8px 0 0;color:rgba(10,10,15,0.7);font-size:14px;">
                      Ada seseorang yang menghubungi kamu melalui website portfolio.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              
              <!-- Info Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:11px;color:#00FF88;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Nama</p>
                          <p style="margin:0;font-size:16px;color:#fff;font-weight:600;">${data.name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:11px;color:#0099FF;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email</p>
                          <a href="mailto:${data.email}" style="margin:0;font-size:16px;color:#0099FF;font-weight:600;text-decoration:none;">${data.email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${
                  data.whatsapp
                    ? `<tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:11px;color:#25D366;font-weight:700;text-transform:uppercase;letter-spacing:1px;">WhatsApp</p>
                          <a href="https://wa.me/${data.whatsapp.replace(/\D/g, "")}" style="margin:0;font-size:16px;color:#25D366;font-weight:600;text-decoration:none;">${data.whatsapp}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                    : ""
                }
                ${
                  data.subject
                    ? `<tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:11px;color:#F59E0B;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Subjek</p>
                          <p style="margin:0;font-size:16px;color:#fff;font-weight:600;">${data.subject}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                    : ""
                }
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:11px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Pesan</p>
                    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-left:3px solid #00FF88;border-radius:12px;padding:20px 24px;">
                      <p style="margin:0;font-size:15px;color:#D1D5DB;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}" style="display:inline-block;background:linear-gradient(135deg,#00FF88,#0099FF);color:#0A0A0F;font-weight:700;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;margin-right:12px;">
                      Balas Email
                    </a>
                    ${
                      data.whatsapp
                        ? `<a href="https://wa.me/${data.whatsapp.replace(/\D/g, "")}?text=Halo%20${encodeURIComponent(data.name)},%20terima%20kasih%20sudah%20menghubungi%20saya!" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none;">
                        Balas WhatsApp
                      </a>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:#6B7280;text-align:center;">
                Email ini dikirim otomatis dari website portfolio Daffa Rizky.<br/>
                <a href="https://daffa-portfolio.vercel.app" style="color:#0099FF;text-decoration:none;">daffa-portfolio.vercel.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam 10 menit." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, whatsapp, subject, message, honeypot } = body;

    // Honeypot check (bot trap)
    if (honeypot) {
      return NextResponse.json({ success: true }); // silently ignore bots
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan harus diisi." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Pesan terlalu pendek (minimal 10 karakter)." },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("messages").insert([
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        is_read: false,
        status: 'new',
      },
    ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Don't fail the whole request if DB save fails — still try to send email
    }

    // 2. Send email via Resend (if API key is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "daffarizky@gmail.com";

    if (resendApiKey && resendApiKey !== "placeholder") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [adminEmail],
          replyTo: email.trim(),
          subject: `📬 Pesan Baru: ${subject || "Dari " + name} — Portfolio`,
          html: buildEmailHtml({ name, email, whatsapp, subject, message }),
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Don't fail — message is already saved to DB
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil dikirim!",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}
