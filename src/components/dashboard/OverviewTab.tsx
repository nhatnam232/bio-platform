import { useAuth } from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { EditorCtx } from '../../context/EditorContext'
import { getMyViewsByDay, DailyViews } from '../../lib/stats'

// Shared focus-visible ring (token: color.focus.ring = brand)
const ovRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ov-bg'

export default function OverviewTab() {
  const { user } = useAuth()
  const { p } = useContext(EditorCtx)!
  const [chartData, setChartData] = useState<DailyViews[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState('')

  async function loadStats() {
    if (!user) return
    setLoadingStats(true)
    setStatsError('')
    try {
      const data = await getMyViewsByDay(7)
      setChartData(data)
    } catch (err) {
      console.error('Failed to load views:', err)
      setStatsError('Không tải được dữ liệu lượt xem.')
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const maxCount = Math.max(...chartData.map((c) => c.count), 1)

  return (
    <div className="flex flex-col gap-6">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold mb-1 text-ov-fg tracking-tight">Overview</h2>
        <p className="text-sm text-ov-fg-2">Tổng quan về tài khoản của bạn.</p>
      </div>

      {/* Stat cards (cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="border border-ov-border rounded-2xl p-5 bg-ov-raised hover:bg-ov-muted transition duration-200">
          <div className="flex items-center gap-2 text-sm text-ov-fg-2 mb-2">
            <span aria-hidden="true">👁</span> Lượt xem trang tổng cộng
          </div>
          <div className="text-3xl font-bold text-ov-fg tracking-tight">{p.view_count || 0}</div>
        </div>
        <div className="border border-ov-border rounded-2xl p-5 bg-ov-raised hover:bg-ov-muted transition duration-200">
          <div className="flex items-center gap-2 text-sm text-ov-fg-2 mb-2">
            <span aria-hidden="true">✉️</span> Email đăng ký
          </div>
          <div className="text-sm font-medium text-ov-fg truncate mt-1" title={user?.email || ''}>{user?.email || 'Đang tải...'}</div>
        </div>
      </div>

      {/* Views chart card */}
      <div className="border border-ov-border rounded-2xl p-6 bg-ov-strong shadow-ov-1">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-ov-fg flex items-center gap-2">
            <span aria-hidden="true">📊</span> Thống kê lượt xem (7 ngày qua)
          </h3>
          {statsError && (
            <button
              onClick={loadStats}
              className={'text-xs font-medium text-ov-fg-2 hover:text-ov-fg px-2.5 py-1 rounded-lg border border-ov-border hover:bg-ov-muted transition ' + ovRing}
            >
              Thử lại
            </button>
          )}
        </div>

        {loadingStats ? (
          <div className="h-40 flex items-center justify-center text-sm text-ov-fg-3" role="status" aria-live="polite">
            Đang tải biểu đồ...
          </div>
        ) : statsError ? (
          <div className="h-40 flex items-center justify-center text-sm text-ov-fg-3" role="alert">
            ⚠️ {statsError}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-ov-fg-3">Chưa có dữ liệu lượt xem nào.</div>
        ) : (
          <ul className="flex items-end gap-2 h-40 pt-4" aria-label="Lượt xem theo ngày">
            {chartData.map((d, i) => {
              const heightPct = Math.max((d.count / maxCount) * 100, 4)
              const dayLabel = d.day.split('-').slice(1).join('/')
              return (
                <li
                  key={i}
                  tabIndex={0}
                  aria-label={`${dayLabel}: ${d.count} lượt xem`}
                  className={'flex-1 flex flex-col items-center gap-2 group relative rounded ' + ovRing}
                >
                  <div className="absolute -top-8 bg-ov-bg border border-ov-border text-ov-fg text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none">
                    {d.count} view
                  </div>
                  <div
                    className="w-full bg-ov-fg-2/40 rounded-t-sm transition group-hover:bg-ov-fg-2/70 group-focus-within:bg-ov-fg-2/70"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <div className="text-[10px] text-ov-fg-3 whitespace-nowrap overflow-hidden w-full text-center">{dayLabel}</div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
