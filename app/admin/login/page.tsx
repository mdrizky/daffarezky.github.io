"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import SiteLogo from '@/components/SiteLogo'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) throw authError

      const userId = data.user?.id
      if (!userId) throw new Error('Login gagal.')

      // Check if user is registered in admin_users, or is the verified owner email
      const isOwnerEmail = data.user.email && (
        data.user.email === 'mdrizky240708@gmail.com' ||
        data.user.email === 'daffarezky99@gmail.com'
      )

      let isAuthorized = Boolean(isOwnerEmail)

      if (!isAuthorized) {
        const { data: adminRow } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle()

        isAuthorized = Boolean(adminRow)
      }

      if (!isAuthorized) {
        await supabase.auth.signOut()
        throw new Error('Akun ini terautentikasi, tetapi belum terdaftar sebagai admin di database.')
      }

      // If owner email and not yet in admin_users, attempt to record row
      if (isOwnerEmail) {
        try {
          await supabase.from('admin_users').upsert({
            user_id: userId,
            role: 'super_admin',
            is_active: true,
          }, { onConflict: 'user_id' })
        } catch {
          // Non-blocking if table RLS prevents client-side insert
        }
      }

      setIsSuccess(true)
      setTimeout(() => {
        window.location.href = '/admin'
      }, 800)
    } catch (err: unknown) {
      console.error('Login error:', err)
      setError((err instanceof Error ? err.message : null) || 'Login gagal. Periksa kembali email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground border border-border shadow-xl rounded-2xl p-8 md:p-10 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <SiteLogo size={48} showName={false} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
              Admin <span className="text-primary font-bold">Portal</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Masuk untuk mengelola portofolio dan konten website Anda.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center font-medium">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-3.5 bg-success/10 border border-success/20 rounded-xl text-success text-sm text-center font-semibold">
              ✓ Berhasil masuk! Mengalihkan ke dashboard...
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                  placeholder="admin@example.com"
                  required
                  disabled={loading || isSuccess}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                  required
                  disabled={loading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-3.5 mt-2 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && !isSuccess ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In ke Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <button
              onClick={() => router.push('/')}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
