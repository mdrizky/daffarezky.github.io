import { NextResponse } from "next/server"
import { createClient } from "../../../../lib/supabase-server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("education").select("*").order("start_year", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { institution, degree_id, degree_en, start_year, end_year, description_id, description_en, is_current, logo_url } = body

    if (!institution || !start_year) {
      return NextResponse.json({ error: "institution and start_year required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("education")
      .insert([{ institution, degree_id, degree_en, start_year, end_year, description_id, description_en, is_current, logo_url }])
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { id, institution, degree_id, degree_en, start_year, end_year, description_id, description_en, is_current, logo_url } = body

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("education")
      .update({ institution, degree_id, degree_en, start_year, end_year, description_id, description_en, is_current, logo_url })
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient()

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    const { error } = await supabase.from("education").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 })
  }
}
