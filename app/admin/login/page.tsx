"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa'

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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
    if (lockoutTime && lockoutTime > Date.now()) {
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} detik.`)
      return
    }

    setIsSubmitting(true)
    setLoading(true)
    setError('')

    const validPin = '240708'
    console.log('Comparing:', pin, 'with:', validPin)

    if (pin.trim() === validPin) {
      // Reset attempts on success
      try {
        localStorage.removeItem('admin_pin_attempts')
        localStorage.removeItem('admin_pin_lockout')
        localStorage.setItem('admin_pin_auth', 'true')
        console.log('Login successful, auth set to true')
      } catch (error) {
        console.error('localStorage error:', error)
      }
      router.push('/admin')
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0A0A0F] via-[#0D1117] to-[#0A0A0F]">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00FF88] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#0099FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00FF88] to-[#0099FF] rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <FaShieldAlt className="text-3xl text-[#0A0A0F]" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold font-syne mb-3 bg-gradient-to-r from-[#00FF88] via-[#00CCFF] to-[#0099FF] text-transparent bg-clip-text animate-gradient">
              Admin Area
            </h1>
            <p className="text-gray-400 text-base">
              Silakan masukkan PIN untuk masuk ke panel admin.
            </p>
            {attempts > 0 && !isLocked && (
              <p className="text-yellow-400 text-xs mt-2">
                Percobaan tersisa: {5 - attempts}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                Masukkan PIN
              </label>
              <div className="relative max-w-xs mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className={`w-full pl-12 pr-12 py-5 text-center tracking-[0.6em] text-3xl sm:text-4xl font-extrabold bg-white/6 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00FF88] text-white placeholder-gray-500 transition-all duration-300 ${isSubmitting ? 'scale-95' : 'scale-100'}`}
                  placeholder="••••••"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPin((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors"
                  aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                  disabled={isLocked}
                >
                  {showPin ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full py-5 px-6 bg-gradient-to-r from-[#00FF88] to-[#0099FF] text-[#0A0A0F] font-extrabold rounded-2xl hover:opacity-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg transform ${isSubmitting ? 'scale-95' : 'hover:scale-[1.02]'}`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-[#0A0A0F] border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : isLocked ? (
                `Tunggu ${remainingTime} detik`
              ) : (
                'Masuk'
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <button 
              onClick={() => router.push('/')}
              className="text-gray-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              ← Kembali ke Beranda
            </button>
          </div>

          {/* Custom SVG Animation at Bottom */}
          <div className="absolute left-0 right-0 bottom-0 p-4 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <svg 
                className="w-full h-16" 
                viewBox="0 0 400 60" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00FF88" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00FF88" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0099FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="30" r="3" fill="#00FF88" opacity="0.5">
                  <animate attributeName="cy" values="30;25;30" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="30" r="2" fill="#00CCFF" opacity="0.4">
                  <animate attributeName="cy" values="30;35;30" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="30" r="4" fill="#00FF88" opacity="0.6">
                  <animate attributeName="cy" values="30;20;30" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="30" r="2.5" fill="#0099FF" opacity="0.5">
                  <animate attributeName="cy" values="30;38;30" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="30" r="3" fill="#00FF88" opacity="0.4">
                  <animate attributeName="cy" values="30;22;30" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="300" cy="30" r="2" fill="#00CCFF" opacity="0.5">
                  <animate attributeName="cy" values="30;35;30" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="350" cy="30" r="3.5" fill="#0099FF" opacity="0.6">
                  <animate attributeName="cy" values="30;25;30" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite" />
                </circle>
                <rect x="0" y="28" width="400" height="4" fill="url(#gradient)" opacity="0.3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-medium tracking-wide">
                  🔒 Secure Admin Portal • Daffa Rizky
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
