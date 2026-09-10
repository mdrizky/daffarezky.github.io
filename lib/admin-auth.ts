import { createClient } from "@/lib/supabase-server"
import type { SupabaseClient } from "@supabase/supabase-js"

export type AdminSession = { supabase: SupabaseClient; userId: string } | null

export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle()

  if (!adminRow) return null

  return { supabase, userId: user.id }
}