import { useAuth } from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { EditorCtx } from '../../context/EditorContext'
import { getMyViewsByDay, DailyViews } from '../../lib/stats'

export default function OverviewTab() {
  const { user } = useAuth()
  const { p } = useContext(EditorCtx)!
  const [chartData, setChartData] = useState<DailyViews[]>([])
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    async function loadStats() {
      if (!user) return
      setLoadingStats(true)
      try {
        const data = await getMyViewsByDay(7)
        setChartData(data)
      } catch (err) {
        console.error('Failed to load views:', err)
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [user])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1.5 text-white">Overview</h2>
        <p className="text-sm text-zinc-400">Tổng quan về tài khoản của bạn.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.02] hover:bg-white/[0.04] transition">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
            <span>👁</span> Lượt xem trang tổng cộng
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

      <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.01]">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Thống kê lượt xem (7 ngày qua)
        </h3>
        
        {loadingStats ? (
          <div className="h-40 flex items-center justify-center text-sm text-zinc-500">Đang tải biểu đồ...</div>
        ) : chartData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-zinc-500">Chưa có dữ liệu lượt xem nào.</div>
        ) : (
          <div className="flex items-end gap-2 h-40 pt-4">
            {chartData.map((d, i) => {
              const maxCount = Math.max(...chartData.map(c => c.count), 1)
              const heightPct = Math.max((d.count / maxCount) * 100, 4)
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 bg-black border border-white/10 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {d.count} view
                  </div>
                  <div className="w-full bg-white/20 rounded-t-sm transition group-hover:bg-white/40" style={{ height: `${heightPct}%` }}></div>
                  <div className="text-[10px] text-zinc-500 whitespace-nowrap overflow-hidden w-full text-center">
                    {d.day.split('-').slice(1).join('/')}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
