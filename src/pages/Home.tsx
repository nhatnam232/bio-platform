import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const blob1 = { width: '360px', height: '360px', background: '#a855f7', top: '-60px', left: '-60px' }
  const blob2 = { width: '300px', height: '300px', background: '#3b82f6', bottom: '-50px', right: '-50px', animationDelay: '5s' }

  return (
    <div className="relative min-h-screen overflow-hidden animated-bg text-white flex flex-col items-center justify-center gap-8 p-6">
      <div className="blob" style={blob1} />
      <div className="blob" style={blob2} />

      <div className="relative z-10 flex flex-col items-center gap-8 fade-up">
        <h1 className="text-6xl font-extrabold text-center tracking-tight">
          Bio<span className="text-purple-400">Platform</span>
        </h1>
        <p className="text-gray-300 text-center max-w-md text-lg">
          Tạo trang bio cá nhân của riêng bạn — links, nhạc, hiệu ứng. Như guns.lol nhưng là của bạn.
        </p>
        <div className="flex gap-4">
          {user ? (
            <Link to="/dashboard" className="px-7 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition hover:-translate-y-0.5">
              Vào Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="px-7 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition hover:-translate-y-0.5">
                Đăng ký
              </Link>
              <Link to="/login" className="glass px-7 py-3 rounded-xl font-medium transition hover:-translate-y-0.5 hover:bg-white/15">
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
