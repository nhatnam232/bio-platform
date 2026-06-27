import { useContext, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EditorCtx } from '../../context/EditorContext'

const ring =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-zy-bg'

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}

const PRESETS = [
  { name: 'Midnight', desc: 'Clean black profile with soft white controls.', sw: ['#0b0b0f', '#e5e7eb'], accent: '#e5e7eb' },
  { name: 'Glacier', desc: 'Cold blue details with a darker card base.', sw: ['#0b1220', '#38bdf8'], accent: '#38bdf8' },
  { name: 'Ember', desc: 'Warm red accent for bold audio and icon color.', sw: ['#1a0f0f', '#ef4444'], accent: '#ef4444' },
  { name: 'Mint', desc: 'Soft green accent with calm neutral text.', sw: ['#0c1512', '#34d399'], accent: '#34d399' },
  { name: 'Violet', desc: 'Muted purple accent with clear soft text.', sw: ['#140f1f', '#a78bfa'], accent: '#a78bfa' },
  { name: 'Sunset', desc: 'Peach highlight against a deep neutral base.', sw: ['#1a1310', '#fb923c'], accent: '#fb923c' },
  { name: 'Steel', desc: 'Cool gray profile with bright blue controls.', sw: ['#101317', '#94a3b8'], accent: '#94a3b8' },
  { name: 'Candy', desc: 'Pink accent with a clean midnight background.', sw: ['#160f14', '#ec4899'], accent: '#ec4899' },
]

export default function OverviewTab() {
  const ctx = useContext(EditorCtx)!
  const { p } = ctx
  const [, setParams] = useSearchParams()
  const setTab = (id: string) => setParams({ tab: id })

  const uid = useMemo(() => String(hash(p.id || '') % 100000).padStart(5, '0'), [p.id])
  const linksCount = p.links?.length || 0

  const topStats: { label: string; sub: string; icon: string; onAction?: () => void; aria?: string }[] = [
    { label: 'Username', sub: p.username, icon: '✎', onAction: () => setTab('setting'), aria: 'Edit username' },
    { label: 'Alias', sub: '0 aliases used', icon: '👥' },
    { label: 'UID', sub: uid, icon: '#' },
    { label: 'Total Like', sub: '0', icon: '❤' },
    { label: 'Profile Views', sub: String(p.view_count || 0), icon: '👁' },
  ]

  const items = [
    { label: 'Upload an avatar', icon: '👤', done: !!p.avatar_url },
    { label: 'Add a background', icon: '🖼', done: !!(p.background && p.background.url) },
    { label: 'Add a description', icon: '✍', done: !!p.bio },
    { label: 'Add socials', icon: '🔗', done: linksCount > 0 },
    { label: 'Link Discord account', icon: '🎮', done: !!p.discord_id },
    { label: 'Link Google account', icon: 'G', done: false },
    { label: 'Reach 10 profile views', icon: '👁', done: (p.view_count || 0) >= 10 },
  ]
  const pct = Math.round((items.filter((i) => i.done).length / items.length) * 100)

  const managerBtns = [
    { label: 'Change Username', icon: '✎', go: 'setting' },
    { label: 'Manage Aliases', icon: '👥', go: 'setting' },
    { label: 'Changes Layout', icon: '▦', go: 'customize' },
    { label: 'Settings', icon: '⚙', go: 'setting' },
  ]

  const analytics = [
    { label: 'Profile Views', value: p.view_count || 0, sub: 'All time views', icon: '👁' },
    { label: 'Total Likes', value: 0, sub: 'Bio likes received', icon: '❤' },
    { label: 'Aliases', value: 0, sub: '0 slots available', icon: '👥' },
    { label: 'Social Links', value: linksCount, sub: 'Visible on profile', icon: '🔗' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Top stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {topStats.map((s, i) => (
          <div key={i} className="border border-zy-border bg-zy-card rounded-xl p-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-bold text-zy-fg truncate">{s.label}</div>
              <div className="text-xs text-zy-fg-3 truncate mt-0.5">{s.sub}</div>
            </div>
            {s.onAction ? (
              <button onClick={s.onAction} aria-label={s.aria} className={'w-9 h-9 shrink-0 grid place-items-center rounded-lg border border-zy-border bg-zy-elevated text-zy-fg-2 hover:text-zy-fg transition ' + ring}>{s.icon}</button>
            ) : (
              <span className="w-9 h-9 shrink-0 grid place-items-center rounded-lg border border-zy-border bg-zy-elevated text-zy-fg-2" aria-hidden="true">{s.icon}</span>
            )}
          </div>
        ))}
      </div>

      {/* Account Statistics */}
      <div>
        <h2 className="text-lg font-bold text-zy-fg mb-4">Account Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          {/* Profile Completion */}
          <div className="border border-zy-border bg-zy-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-zy-fg">Profile Completion</h3>
                <p className="text-xs text-zy-fg-3 mt-0.5">A few small steps make your profile feel more complete.</p>
              </div>
              <span className="text-xs text-zy-fg-2 shrink-0">{pct}% completed</span>
            </div>
            <div className="h-2 rounded-full bg-zy-elevated overflow-hidden my-4" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion">
              <div className="h-full bg-brand rounded-full transition-all" style= width: pct + '%'  />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {items.map((it, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-zy-border bg-zy-elevated px-3.5 py-3">
                  <span className="w-7 h-7 grid place-items-center rounded-md border border-zy-border bg-zy-card text-zy-fg-2 text-xs shrink-0" aria-hidden="true">{it.icon}</span>
                  <span className={'flex-1 text-sm ' + (it.done ? 'text-zy-fg' : 'text-zy-fg-2')}>{it.label}</span>
                  <span className={'w-5 h-5 shrink-0 grid place-items-center rounded-full text-[11px] ' + (it.done ? 'bg-brand text-white' : 'border border-zy-border text-transparent')} aria-label={it.done ? 'Done' : 'Not done'}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Manager */}
          <div className="border border-zy-border bg-zy-card rounded-2xl p-5 flex flex-col gap-2">
            <div className="mb-1">
              <h3 className="text-sm font-semibold text-zy-fg">Account Manager</h3>
              <p className="text-xs text-zy-fg-3 mt-0.5">Changes your username, layout,...</p>
            </div>
            {managerBtns.map((b, i) => (
              <button key={i} onClick={() => setTab(b.go)} className={'w-full flex items-center justify-center gap-2 rounded-lg border border-zy-border bg-zy-elevated hover:bg-zy-card text-sm font-medium text-zy-fg py-2.5 transition ' + ring}>
                <span aria-hidden="true">{b.icon}</span> {b.label}
              </button>
            ))}
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-zy-fg">Connections</h4>
              <p className="text-xs text-zy-fg-3 mt-0.5 mb-2">Connect your accounts to zyo.lol</p>
              <button onClick={() => setTab('customize')} className={'w-full flex items-center justify-between gap-2 rounded-lg border border-zy-border bg-zy-elevated hover:bg-zy-card text-sm font-medium py-2.5 px-3 transition mb-2 ' + ring}>
                <span className="flex items-center gap-2"><span aria-hidden="true">🎮</span> {p.discord_id ? 'Discord Connected' : 'Connect Discord'}</span>
                <span className="text-zy-fg-3" aria-hidden="true">⚙</span>
              </button>
              <button disabled className="w-full flex items-center gap-2 rounded-lg border border-zy-border bg-zy-elevated/50 text-sm font-medium py-2.5 px-3 text-zy-fg-2 opacity-70 cursor-not-allowed">
                <span aria-hidden="true">🔍</span> Connect Google
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Analytics */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-zy-fg">Account Analytics</h2>
          <button onClick={() => setTab('analytics')} className={'text-xs font-medium text-zy-fg-2 bg-zy-card border border-zy-border rounded-lg px-3 py-1.5 hover:bg-zy-elevated transition ' + ring}>View More</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {analytics.map((s, i) => (
            <div key={i} className="border border-zy-border bg-zy-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zy-fg">{s.label}</span>
                <span className="text-zy-fg-3" aria-hidden="true">{s.icon}</span>
              </div>
              <div className="text-3xl font-bold text-zy-fg tracking-tight">{s.value}</div>
              <div className="text-xs text-zy-fg-3 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Presets */}
      <div>
        <h2 className="text-lg font-bold text-zy-fg mb-4">Theme Presets</h2>
        <div className="border border-zy-border bg-zy-card rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zy-fg">Quick Themes</h3>
              <p className="text-xs text-zy-fg-3 mt-0.5">Apply a balanced color set to your current bio layout.</p>
            </div>
            <span className="text-[11px] text-zy-fg-3 bg-zy-elevated border border-zy-border rounded-full px-2.5 py-1 shrink-0">{PRESETS.length} presets</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {PRESETS.map((pre) => {
              const active = p.theme?.preset === pre.name
              return (
                <button
                  key={pre.name}
                  onClick={() => { ctx.setTheme({ accent: pre.accent, preset: pre.name }); ctx.setColors({ background: pre.sw[0] }) }}
                  className={'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ' + ring + ' ' + (active ? 'border-brand bg-zy-elevated' : 'border-zy-border bg-zy-elevated/60 hover:bg-zy-elevated')}
                >
                  <span className="flex -space-x-1 shrink-0" aria-hidden="true">
                    <span className="w-5 h-5 rounded-full border border-black/40" style= background: pre.sw[0]  />
                    <span className="w-5 h-5 rounded-full border border-black/40" style= background: pre.sw[1]  />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-zy-fg">{pre.name}</span>
                    <span className="block text-xs text-zy-fg-3 truncate">{pre.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-zy-fg-3 mt-3">Bấm để áp dụng, rồi nhấn “Lưu thay đổi” để lưu.</p>
        </div>
      </div>
    </div>
  )
}
