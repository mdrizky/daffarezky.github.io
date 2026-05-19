import { NextResponse } from "next/server"
import { createClient } from "../../../../lib/supabase-server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { name, role, company, content, avatar, rating } = body

    if (!name || !content) {
      return NextResponse.json({ error: "name and content required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert([{ name, role, company, content, avatar, rating: rating || 5 }])
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const { id, name, role, company, content, avatar, rating } = body

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("testimonials")
      .update({ name, role, company, content, avatar, rating })
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
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

    const { error } = await supabase.from("testimonials").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
