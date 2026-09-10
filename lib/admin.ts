import { createClient } from '@/lib/supabase-server'
import type { User } from '@supabase/supabase-js'

export type AdminRole = 'super_admin' | 'editor'

export type AdminRecord = {
  role: AdminRole
  is_active: boolean
}

export async function getAdminContext(): Promise<{
  user: User | null
  admin: AdminRecord | null
  isAdmin: boolean
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, admin: null, isAdmin: false }
  }

  const { data } = await supabase
    .from('admin_users')
    .select('role, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  const admin = (data as AdminRecord | null) ?? null
  return { user, admin, isAdmin: Boolean(admin) }
}
