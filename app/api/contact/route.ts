import { NextResponse } from "next/server"
import { createClient } from "../../../lib/supabase-server"

type Body = {
  name: string
  email: string
  whatsapp?: string
  subject?: string
  message: string
  honeypot?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body

    // basic honeypot
    if (body.honeypot) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // anti-spam: check if same email created a message in last 30 seconds
    const { data: recent, error: recentErr } = await supabase
      .from("messages")
      .select("id,created_at")
      .eq("email", body.email)
      .order("created_at", { ascending: false })
      .limit(1)

    if (recentErr) {
      console.warn("Failed to check recent messages:", recentErr)
    }

    if (recent && recent.length > 0) {
      const last = new Date(recent[0].created_at)
      const diff = Date.now() - last.getTime()
      if (diff < 30_000) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 })
      }
    }

    // save to supabase
    const { data, error: insertErr } = await supabase.from("contacts").insert([
      {
        name: body.name,
        email: body.email,
        whatsapp: body.whatsapp || null,
        subject: body.subject || null,
        message: body.message,
        status: "unread",
      },
    ])

    if (insertErr) {
      console.error("Failed insert contact:", insertErr)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // send email notification (if SMTP configured)
    const smtpHost = process.env.EMAIL_SMTP_HOST
    const smtpUser = process.env.EMAIL_SMTP_USER
    const smtpPass = process.env.EMAIL_SMTP_PASSWORD
    const toEmail = process.env.ADMIN_EMAIL
    const fromEmail = process.env.FROM_EMAIL || process.env.ADMIN_EMAIL

    if (smtpHost && smtpUser && smtpPass && toEmail) {
      try {
        // dynamic import nodemailer to avoid requiring it on runtime if not installed
        const nodemailer = await import("nodemailer")
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.EMAIL_SMTP_PORT || 587),
          secure: Number(process.env.EMAIL_SMTP_PORT || 587) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        const html = `
          <h2>Pesan Baru dari Portfolio</h2>
          <p><strong>Nama:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>WhatsApp:</strong> ${body.whatsapp || "-"}</p>
          <p><strong>Subjek:</strong> ${body.subject || "-"}</p>
          <hr />
          <p>${body.message.replace(/\n/g, "<br />")}</p>
        `

        await transporter.sendMail({
          from: fromEmail,
          to: toEmail,
          subject: `[Portfolio] New message from ${body.name} - ${body.subject || "Contact"}`,
          html,
        })
      } catch (err) {
        console.error("Failed sending email:", err)
      }
    } else {
      // no SMTP configured — log to console and warn in response
      console.warn("SMTP not configured. Set EMAIL_SMTP_HOST, EMAIL_SMTP_USER, EMAIL_SMTP_PASSWORD, and ADMIN_EMAIL to enable email notifications.")
    }

    return NextResponse.json({ ok: true, data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
