import { useAuth } from '../../context/AuthContext'
import { useContext } from 'react'
import { EditorCtx } from '../../context/EditorContext'

export default function OverviewTab() {
  const { user } = useAuth()
  const { p } = useContext(EditorCtx)!

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1.5 text-white">Overview</h2>
        <p className="text-sm text-zinc-400">Tổng quan về tài khoản của bạn.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.02] hover:bg-white/[0.04] transition">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <span>👁</span> Lượt xem trang
          </div>
          <div className="text-4xl font-bold text-white tracking-tight">{p.view_count || 0}</div>
        </div>
        <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.02] hover:bg-white/[0.04] transition">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <span>✉️</span> Email đăng ký
          </div>
          <div className="text-base font-medium text-white truncate mt-1">{user?.email || 'Đang tải...'}</div>
        </div>
      </div>

      <div className="border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-center text-zinc-500 bg-white/[0.01]">
        <span className="text-2xl">📊</span>
        <div className="text-sm font-medium text-zinc-400">[Khu vực dành cho Backend / CL]</div>
        <div className="text-xs max-w-sm leading-relaxed">
          Backend (CL) có thể thêm biểu đồ thống kê view theo ngày, lịch sử truy cập, thiết bị ở đây.
        </div>
      </div>
    </div>
  )
}