import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BackgroundFX from '../components/BackgroundFX'
import Frame from '../components/Frame'

const FEATURES = [
  { t: 'Trang /username', d: 'Mỗi người một trang bio riêng, sạch và nhanh.' },
  { t: 'Tuỳ biến sâu', d: 'Màu, font, nền ảnh/video, nhạc nền, con trỏ riêng.' },
  { t: 'Hiệu ứng động', d: 'Tuyết, mưa, particles, sao, matrix, đom đóm.' },
  { t: 'Discord presence', d: 'Trạng thái real-time qua Lanyard.' },
  { t: 'Links thông minh', d: 'Sắp xếp, gắn icon, tự nhận diện nền tảng.' },
  { t: 'Thống kê lượt xem', d: 'Đếm lượt truy cập cho mỗi trang.' },
]

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="relative min-h-screen text-white">
      <BackgroundFX accent="#ffffff" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="font-mono text-sm">▲ bio<span className="text-zinc-500">/platform</span></div>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <Link to="/dashboard" className="px-4 py-1.5 bg-white text-black font-medium hover:bg-zinc-200 transition">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 text-zinc-300 hover:text-white transition">Đăng nhập</Link>
              <Link to="/register" className="px-4 py-1.5 bg-white text-black font-medium hover:bg-zinc-200 transition">Bắt đầu</Link>
            </>
          )}
        </nav>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center text-center gap-7 fade-up">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 border border-white/10 px-3 py-1">link-in-bio · self hosted</div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">Một trang bio.<br />Đúng chất <span className="text-zinc-400">của bạn.</span></h1>
        <p className="text-zinc-400 max-w-lg text-lg">Tạo trang <span className="font-mono text-white">web.com/username</span> với links, nhạc, hiệu ứng động và Discord presence. Như guns.lol, nhưng do bạn làm chủ.</p>
        <div className="flex gap-3">
          <Link to={user ? '/dashboard' : '/register'} className="px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition">{user ? 'Vào Dashboard →' : 'Tạo trang miễn phí →'}</Link>
          <a href="https://github.com/nhatnam232/bio-platform" target="_blank" rel="noreferrer" className="px-6 py-3 border border-white/15 hover:border-white/40 transition">GitHub</a>
        </div>
      </main>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-28 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <Frame key={i} accent="#ffffff" className="p-5 fade-up">
            <div className="text-sm font-mono text-zinc-500 mb-2">0{i + 1}</div>
            <div className="font-semibold mb-1">{f.t}</div>
            <div className="text-sm text-zinc-400">{f.d}</div>
          </Frame>
        ))}
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs text-zinc-500 font-mono">built with react · vite · supabase</footer>
    </div>
  )
}
