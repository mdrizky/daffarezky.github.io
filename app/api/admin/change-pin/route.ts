import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"

const PIN_PATTERN = /^[0-9]{4,8}$/

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { current_pin, new_pin } = await req.json()

    if (typeof current_pin !== "string" || !PIN_PATTERN.test(new_pin)) {
      return NextResponse.json({ error: "PIN baru harus 4-8 digit angka" }, { status: 400 })
    }

    const { data, error } = await auth.supabase.rpc("change_admin_pin", {
      current_pin,
      new_pin,
    })

    if (error) throw error

    if (data === false) {
      return NextResponse.json({ error: "PIN saat ini salah" }, { status: 403 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error("change-pin error:", err)
    return NextResponse.json({ error: "Gagal mengubah PIN" }, { status: 500 })
  }
}