"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'

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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      setIsSuccess(true)
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1500)
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0F] relative overflow-hidden font-body">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00FF88]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0099FF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className={`transition-all duration-700 transform ${isSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rotate-3 hover:rotate-0 transition-transform duration-500 relative rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,255,136,0.2)] bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={80} 
                  height={80} 
                  className="object-contain w-full h-full drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]"
                />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white mb-3 font-heading">
                Admin <span className="text-gradient">Access</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Login ke panel kontrol untuk mengelola portfolio Anda.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center animate-shake font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-5 pl-14 pr-6 bg-black/40 border-2 border-white/5 rounded-2xl text-white focus:outline-none focus:border-[var(--color-neon-green)]/30 transition-all duration-300"
                    placeholder="admin@example.com"
                    required
                    disabled={loading || isSuccess}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-5 pl-14 pr-14 bg-black/40 border-2 border-white/5 rounded-2xl text-white focus:outline-none focus:border-[var(--color-neon-green)]/30 transition-all duration-300"
                    placeholder="••••••••"
                    required
                    disabled={loading || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isSuccess}
                className="w-full py-6 mt-4 bg-gradient-neon text-[#0A0A0F] font-black text-lg rounded-2xl shadow-[0_20px_40px_rgba(0,255,136,0.2)] hover:shadow-[0_25px_50px_rgba(0,255,136,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
              >
                {loading && !isSuccess ? (
                  <div className="w-6 h-6 border-4 border-[#0A0A0F] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            <div className="mt-12 text-center relative z-10">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-600 text-[10px] font-black hover:text-white transition-colors flex items-center justify-center gap-3 mx-auto uppercase tracking-[0.3em]"
              >
                <span className="w-8 h-[1px] bg-white/10"></span>
                Back to Home
                <span className="w-8 h-[1px] bg-white/10"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Success State Overlay */}
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${isSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
          <div className="w-24 h-24 bg-[var(--color-neon-green)] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,136,0.5)] mb-6">
            <svg className="w-12 h-12 text-[#0A0A0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Authenticated</h2>
        </div>
      </div>
    </div>
  )
}

