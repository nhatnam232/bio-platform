import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BackgroundFX from '../components/BackgroundFX'
import Frame from '../components/Frame'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/dashboard')
  }

  const field = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm focus:border-white/30 focus:outline-none placeholder:text-zinc-600 transition'

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-6">
      <BackgroundFX accent="#ffffff" />
      <Frame accent="#ffffff" className="relative z-10 w-full max-w-sm p-8 fade-up">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">welcome back</div>
            <h1 className="text-2xl font-bold mt-1">Đăng nhập</h1>
          </div>
          {error && <p className="text-red-400 text-sm border border-red-500/30 bg-red-500/10 px-3 py-2">{error}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={field} />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required className={field} />
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black font-medium hover:bg-zinc-200 disabled:opacity-50 transition">{loading ? '...' : 'Đăng nhập'}</button>
          <p className="text-sm text-zinc-500 text-center">Chưa có tài khoản? <Link to="/register" className="text-white hover:underline">Đăng ký</Link></p>
        </form>
      </Frame>
    </div>
  )
}
