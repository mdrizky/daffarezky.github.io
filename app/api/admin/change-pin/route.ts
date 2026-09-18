import { NextResponse } from "next/server"
export async function POST(req: Request) {
  void req
  return NextResponse.json({ error: "Admin PIN has been removed. Use Supabase Auth." }, { status: 410 })
}
