import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BackgroundFX from '../components/BackgroundFX'
import Frame from '../components/Frame'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const clean = username.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      setError('Username 3-20 ký tự, chỉ chữ thường, số và dấu _')
      setLoading(false)
      return
    }
    const { data: existing } = await supabase.from('profiles').select('username').eq('username', clean).maybeSingle()
    if (existing) {
      setError('Username đã có người dùng, chọn tên khác')
      setLoading(false)
      return
    }
    const { data, error: signErr } = await supabase.auth.signUp({ email, password })
    if (signErr) {
      setError(signErr.message)
      setLoading(false)
      return
    }
    const userId = data.user?.id
    if (userId) {
      const { error: profErr } = await supabase.from('profiles').insert({ id: userId, username: clean, display_name: clean })
      if (profErr) {
        setError('Tạo profile lỗi: ' + profErr.message)
        setLoading(false)
        return
      }
    }
    setLoading(false)
    navigate('/dashboard')
  }

  const field = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-md text-[15px] focus:border-white/30 focus:outline-none placeholder:text-zinc-600 transition'

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-6">
      <BackgroundFX accent="#ffffff" />
      <Frame accent="#ffffff" className="relative z-10 w-full max-w-sm p-8 fade-up rounded-xl">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">create account</div>
            <h1 className="text-3xl font-bold mt-1">Đăng ký</h1>
          </div>
          {error && <p className="text-red-400 text-sm border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2">{error}</p>}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-md px-3">
            <span className="text-zinc-500 text-sm font-medium">web.com/</span>
            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="flex-1 py-2.5 px-1 bg-transparent outline-none text-[15px]" />
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={field} />
          <input type="password" placeholder="Mật khẩu (≥6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={field} />
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 disabled:opacity-50 transition">{loading ? '...' : 'Tạo tài khoản'}</button>
          <p className="text-sm text-zinc-500 text-center">Đã có tài khoản? <Link to="/login" className="text-white font-medium hover:underline">Đăng nhập</Link></p>
        </form>
      </Frame>
    </div>
  )
}
