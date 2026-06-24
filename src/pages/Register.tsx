import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

    // Kiểm tra username đã tồn tại chưa
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', clean)
      .maybeSingle()
    if (existing) {
      setError('Username đã có người dùng, chọn tên khác')
      setLoading(false)
      return
    }

    // Đăng ký auth
    const { data, error: signErr } = await supabase.auth.signUp({ email, password })
    if (signErr) {
      setError(signErr.message)
      setLoading(false)
      return
    }

    // Tạo row profile (cần tắt xác nhận email trong Supabase để có session ngay)
    const userId = data.user?.id
    if (userId) {
      const { error: profErr } = await supabase.from('profiles').insert({
        id: userId,
        username: clean,
        display_name: clean,
      })
      if (profErr) {
        setError('Tạo profile lỗi: ' + profErr.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <form onSubmit={handleRegister} className="w-full max-w-sm bg-gray-900 p-8 rounded-2xl flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Đăng ký</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex items-center bg-gray-800 rounded-lg px-4">
          <span className="text-gray-500 text-sm">web.com/</span>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="flex-1 py-3 px-1 bg-transparent outline-none"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Mật khẩu (≥6 ký tự)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="px-4 py-3 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
        <p className="text-sm text-gray-400 text-center">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  )
}
