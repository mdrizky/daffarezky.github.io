"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  // Auto-redirect if already logged in
  useEffect(() => {
    try {
      if (localStorage.getItem('admin_pin_auth') === 'true' && !isSuccess) {
        router.push('/admin')
      }
    } catch (e) {
      console.error(e)
    }
  }, [router, isSuccess])

  // Handle redirect after success animation
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        window.location.href = '/admin'
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  // Load attempts from localStorage on mount
  useEffect(() => {
    try {
      const savedAttempts = localStorage.getItem('admin_pin_attempts')
      const savedLockout = localStorage.getItem('admin_pin_lockout')
      if (savedAttempts) setAttempts(parseInt(savedAttempts))
      if (savedLockout) {
        const lockoutEnd = parseInt(savedLockout)
        if (lockoutEnd > Date.now()) {
          setLockoutTime(lockoutEnd)
        } else {
          localStorage.removeItem('admin_pin_lockout')
          localStorage.removeItem('admin_pin_attempts')
        }
      }
    } catch (error) {
      // Ignore localStorage errors (e.g., in private browsing)
      console.error('localStorage access error:', error)
    }
  }, [])

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        try {
          const remaining = Math.ceil((lockoutTime - Date.now()) / 1000)
          setRemainingTime(remaining)
          if (remaining <= 0) {
            clearInterval(interval)
            setLockoutTime(null)
            setAttempts(0)
            localStorage.removeItem('admin_pin_lockout')
            localStorage.removeItem('admin_pin_attempts')
          }
        } catch (error) {
          console.error('Timer error:', error)
          clearInterval(interval)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lockoutTime])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if locked out
    if (lockoutTime && lockoutTime > Date.now()) return

    setIsSubmitting(true)
    setLoading(true)
    setError('')

    const validPin = '240708'
    const enteredPin = pin.replace(/\s/g, '').trim()

    if (enteredPin === validPin) {
      setIsSuccess(true)
      try {
        localStorage.setItem('admin_pin_auth', 'true')
        localStorage.removeItem('admin_pin_attempts')
        localStorage.removeItem('admin_pin_lockout')
      } catch (error) {
        console.error('Login error:', error)
        setError('Gagal menyimpan status login.')
        setIsSuccess(false)
      }
    } else {
      // Increment attempts
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      try {
        localStorage.setItem('admin_pin_attempts', newAttempts.toString())

        // Lockout after 5 failed attempts (30 seconds)
        if (newAttempts >= 5) {
          const lockoutEnd = Date.now() + 30000
          setLockoutTime(lockoutEnd)
          localStorage.setItem('admin_pin_lockout', lockoutEnd.toString())
          setError('Terlalu banyak percobaan salah. Tunggu 30 detik sebelum mencoba lagi.')
        } else {
          setError(`PIN salah. Percobaan tersisa: ${5 - newAttempts}`)
        }
      } catch (error) {
        console.error('localStorage error:', error)
        setError('PIN salah.')
      }
      setPin('')
    }
    
    setLoading(false)
    setIsSubmitting(false)
  }

  const isLocked = Boolean(lockoutTime && lockoutTime > Date.now())

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
                Masukkan kode akses untuk masuk ke panel kontrol.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center animate-shake font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-10 relative z-10" autoComplete="off">
              <div className="space-y-6">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] text-center">
                  Security Code
                </label>
                <div className="relative group">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoComplete="new-password"
                    className={`w-full py-8 bg-black/40 border-2 border-white/5 rounded-3xl text-center tracking-[0.8em] text-5xl font-black text-[var(--color-neon-green)] placeholder-white/5 focus:outline-none focus:border-[var(--color-neon-green)]/30 focus:ring-8 focus:ring-[var(--color-neon-green)]/5 transition-all duration-500 ${isSubmitting ? 'scale-95' : 'scale-100'}`}
                    placeholder="••••••"
                    maxLength={6}
                    required
                    autoFocus
                    disabled={isLocked || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((s) => !s)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-2"
                    disabled={isLocked || isSuccess}
                  >
                    {showPin ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isLocked || isSuccess}
                className="w-full py-6 bg-gradient-neon text-[#0A0A0F] font-black text-lg rounded-3xl shadow-[0_20px_40px_rgba(0,255,136,0.2)] hover:shadow-[0_25px_50px_rgba(0,255,136,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
              >
                {loading && !isSuccess ? (
                  <div className="w-6 h-6 border-4 border-[#0A0A0F] border-t-transparent rounded-full animate-spin"></div>
                ) : isLocked ? (
                  `Locked (${remainingTime}s)`
                ) : (
                  'Authorize'
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
          <h2 className="text-3xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Authorized</h2>
        </div>

        {/* Bottom Security Info */}
        <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
           <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">
               End-to-End Encrypted Session
             </p>
           </div>
        </div>
      </div>
    </div>
  )
}
