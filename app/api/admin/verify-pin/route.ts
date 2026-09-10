import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { pin } = await req.json()

    if (typeof pin !== "string" || pin.length < 4 || pin.length > 20) {
      return NextResponse.json({ error: "PIN tidak valid" }, { status: 400 })
    }

    const { data, error } = await auth.supabase.rpc("verify_admin_pin", { pin })

    if (error) throw error

    return NextResponse.json({ ok: data === true }, { status: data === true ? 200 : 403 })
  } catch (err) {
    console.error("verify-pin error:", err)
    return NextResponse.json({ error: "Gagal memverifikasi PIN" }, { status: 500 })
  }
}