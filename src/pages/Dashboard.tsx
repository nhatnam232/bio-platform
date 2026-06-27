import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Profile, Theme } from '../types'
import { uploadAsset } from '../lib/storage'
import { EditorCtx, Editor } from '../context/EditorContext'
import ShareModal from '../components/ShareModal'
import OverviewTab from '../components/dashboard/OverviewTab'
import CustomizeTab from '../components/dashboard/CustomizeTab'
import ColorTab from '../components/dashboard/ColorTab'
import LinksTab from '../components/dashboard/LinksTab'
import WidgetsTab from '../components/dashboard/WidgetsTab'
import DecorationTab from '../components/dashboard/DecorationTab'
import CoupleTab from '../components/dashboard/CoupleTab'
import TemplatesTab from '../components/dashboard/TemplatesTab'
import SecurityTab from '../components/dashboard/SecurityTab'

const ring =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-zy-bg'

const ACCOUNT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'badge', label: 'Badge' },
  { id: 'setting', label: 'Setting' },
]
const CUSTOM_TABS = [
  { id: 'customize', label: 'Customize' },
  { id: 'color', label: 'Color' },
  { id: 'link', label: 'Link' },
  { id: 'widgets', label: 'Widgets' },
  { id: 'decoration', label: 'Decoration' },
  { id: 'couple', label: 'Couple' },
  { id: 'templates', label: 'Templates' },
]
const accountIds = ACCOUNT_TABS.map((t) => t.id)
const customIds = CUSTOM_TABS.map((t) => t.id)

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}

function SideItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ' + ring + ' ' + (active ? 'bg-zy-elevated text-zy-fg' : 'text-zy-fg-2 hover:bg-zy-elevated/60 hover:text-zy-fg')}
    >
      {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-brand" />}
      <span className={'text-base ' + (active ? 'text-brand' : 'text-zy-fg-3')} aria-hidden="true">{icon}</span>
      {label}
    </button>
  )
}

function SideGroup({ label, icon, open, onToggle, children }: { label: string; icon: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zy-fg-2 hover:bg-zy-elevated/60 hover:text-zy-fg transition ' + ring}
      >
        <span className="text-base text-zy-fg-3" aria-hidden="true">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        <span className={'text-[10px] text-zy-fg-3 transition-transform ' + (open ? 'rotate-180' : '')} aria-hidden="true">▾</span>
      </button>
      {open && <div className="mt-1 ml-5 flex flex-col gap-0.5 border-l border-zy-border pl-3">{children}</div>}
    </div>
  )
}

function SideSub({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={'w-full text-left px-3 py-2 rounded-md text-sm transition ' + ring + ' ' + (active ? 'text-brand font-medium' : 'text-zy-fg-3 hover:text-zy-fg')}
    >
      {label}
    </button>
  )
}

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-zy-border bg-zy-card rounded-2xl p-12 text-center">
      <div className="text-3xl mb-3" aria-hidden="true">🚧</div>
      <h3 className="text-base font-semibold text-zy-fg mb-1">{title}</h3>
      <p className="text-sm text-zy-fg-3">{desc}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState('')
  const [share, setShare] = useState(false)
  const [openAcc, setOpenAcc] = useState(true)
  const [openCust, setOpenCust] = useState(customIds.includes(tab))

  const setTab = (id: string) => { setParams({ tab: id }); setStatus('') }

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data as Profile))
  }, [user])

  useEffect(() => {
    if (customIds.includes(tab)) setOpenCust(true)
    if (accountIds.includes(tab)) setOpenAcc(true)
  }, [tab])

  const profileUrl = useMemo(() => (profile ? window.location.origin + '/' + profile.username : ''), [profile])

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-zy-bg text-zy-fg-3 text-sm">loading profile…</div>
  }
  const p = profile
  const uid = String(hash(p.id || '') % 100000).padStart(5, '0')

  const editor: Editor = {
    p,
    uploading,
    update: (patch) => setProfile({ ...p, ...patch }),
    setTheme: (patch) => setProfile({ ...p, theme: { ...(p.theme ?? {}), ...patch } as Theme }),
    setColors: (patch) => setProfile({ ...p, theme: { ...(p.theme ?? {}), colors: { ...(((p.theme ?? {}) as Theme).colors ?? {}), ...patch } } as Theme }),
    setBg: (patch) => setProfile({ ...p, background: { ...(p.background ?? {}), ...patch } as Profile['background'] }),
    setCouple: (patch) => setProfile({ ...p, theme: { ...(p.theme ?? {}), couple: { ...(((p.theme ?? {}) as Theme).couple ?? {}), ...patch } } as Theme }),
    upload: async (file, folder, onDone) => {
      if (!file) return
      setUploading(folder)
      setStatus('')
      try {
        const url = await uploadAsset(p.id, file, folder)
        onDone(url)
      } catch (e) {
        setStatus('Upload lỗi: ' + (e instanceof Error ? e.message : 'unknown'))
      } finally {
        setUploading('')
      }
    },
  }

  const save = async () => {
    setSaving(true)
    setStatus('')
    const { error } = await supabase.from('profiles').update({
      display_name: p.display_name,
      bio: p.bio,
      avatar_url: p.avatar_url,
      music_url: p.music_url,
      cursor_url: p.cursor_url,
      phone: p.phone,
      discord_id: p.discord_id,
      links: p.links,
      widgets: p.widgets,
      theme: p.theme,
      background: p.background,
      badges: p.badges,
      is_public: p.is_public,
    }).eq('id', p.id)
    setSaving(false)
    setStatus(error ? 'Lỗi: ' + error.message : 'Đã lưu ✅')
  }

  const section = customIds.includes(tab) ? 'Customization' : tab === 'premium' ? 'Premium' : 'Account'
  const sectionTabs = customIds.includes(tab) ? CUSTOM_TABS : tab === 'premium' ? [] : ACCOUNT_TABS

  const renderTab = () => {
    switch (tab) {
      case 'overview': return <OverviewTab />
      case 'customize': return <CustomizeTab />
      case 'color': return <ColorTab />
      case 'link': return <LinksTab />
      case 'widgets': return <WidgetsTab />
      case 'decoration': return <DecorationTab />
      case 'couple': return <CoupleTab />
      case 'templates': return <TemplatesTab />
      case 'setting': return <SecurityTab />
      case 'analytics': return <Placeholder title="Analytics" desc="Thống kê chi tiết lượt xem và tương tác sẽ hiển thị ở đây." />
      case 'badge': return <Placeholder title="Badge" desc="Quản lý huy hiệu hiển thị trên trang bio của bạn." />
      case 'premium': return <Placeholder title="Premium" desc="Nâng cấp để mở khóa các tính năng cao cấp." />
      default: return <OverviewTab />
    }
  }

  return (
    <EditorCtx.Provider value={editor}>
      <div className="min-h-screen bg-zy-bg text-zy-fg flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[290px] shrink-0 flex-col gap-4 border-r border-zy-border bg-zy-surface px-4 py-5 sticky top-0 h-screen overflow-y-auto">
          <div className="flex items-center gap-2 px-2">
            <span className="text-lg font-extrabold tracking-tight">zyo<span className="text-brand">.lol</span></span>
          </div>

          <a
            href="https://discord.gg/zyo"
            target="_blank"
            rel="noopener noreferrer"
            className={'flex items-center gap-3 rounded-xl px-3.5 py-3 bg-gradient-to-r from-[#5865F2] to-[#4752c4] text-white shadow-lg shadow-[#5865F2]/20 transition hover:brightness-110 ' + ring}
          >
            <span className="text-xl" aria-hidden="true">🎮</span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold leading-tight">Join our Discord</span>
              <span className="block text-[11px] text-white/70 truncate">discord.gg/zyo</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>

          <nav className="flex flex-col gap-1" aria-label="Dashboard">
            <SideItem active={tab === 'overview'} onClick={() => setTab('overview')} icon="📊" label="Overview" />
            <SideGroup label="Account" icon="👤" open={openAcc} onToggle={() => setOpenAcc((o) => !o)}>
              {ACCOUNT_TABS.filter((t) => t.id !== 'overview').map((t) => (
                <SideSub key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} label={t.label} />
              ))}
            </SideGroup>
            <SideGroup label="Customization" icon="🖥" open={openCust} onToggle={() => setOpenCust((o) => !o)}>
              {CUSTOM_TABS.map((t) => (
                <SideSub key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} label={t.label} />
              ))}
            </SideGroup>
            <SideItem active={tab === 'premium'} onClick={() => setTab('premium')} icon="◉" label="Premium" />
          </nav>

          <div className="mt-auto flex flex-col gap-2 pt-4">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Link to={'/' + p.username} target="_blank" className={'flex items-center justify-center gap-2 rounded-lg border border-zy-border bg-zy-card hover:bg-zy-elevated text-sm py-2.5 transition ' + ring}>
                <span aria-hidden="true">↗</span> View Profile
              </Link>
              <button onClick={() => setTab('premium')} aria-label="Premium" className={'px-3 rounded-lg border border-zy-border bg-zy-card hover:bg-zy-elevated text-sm ' + ring}>$</button>
            </div>
            <button onClick={() => setShare(true)} className={'w-full flex items-center justify-center gap-2 rounded-lg border border-zy-border bg-zy-card hover:bg-zy-elevated text-sm py-2.5 transition ' + ring}>
              <span aria-hidden="true">↗</span> Share Profile
            </button>
            <div className="flex items-center gap-3 rounded-lg border border-zy-border bg-zy-card px-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-zy-elevated overflow-hidden grid place-items-center text-xs text-zy-fg-2 shrink-0">
                {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : (p.username?.[0]?.toUpperCase() || 'U')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{p.username}</div>
                <div className="text-[11px] text-zy-fg-3">UID {uid}</div>
              </div>
              <button onClick={signOut} aria-label="Đăng xuất" className={'text-zy-fg-3 hover:text-zy-fg p-1 rounded ' + ring}>⏻</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 h-screen overflow-y-auto">
          <div className="max-w-[1120px] mx-auto px-5 sm:px-8 py-7">
            {/* Mobile section switch */}
            <div className="lg:hidden flex items-center gap-2 mb-5 overflow-x-auto pb-1">
              <button onClick={() => setTab('overview')} className={'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ' + ring + ' ' + (tab === 'overview' ? 'bg-brand text-white' : 'bg-zy-card text-zy-fg-2')}>Overview</button>
              <button onClick={() => setTab('customize')} className={'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ' + ring + ' ' + (customIds.includes(tab) ? 'bg-brand text-white' : 'bg-zy-card text-zy-fg-2')}>Customization</button>
              <button onClick={() => setTab('setting')} className={'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ' + ring + ' ' + (tab === 'setting' ? 'bg-brand text-white' : 'bg-zy-card text-zy-fg-2')}>Setting</button>
            </div>

            <h1 className="text-2xl font-bold mb-5">{section}</h1>

            {sectionTabs.length > 0 && (
              <div className="flex items-center gap-6 border-b border-zy-border mb-7 overflow-x-auto" role="tablist" aria-label={section}>
                {sectionTabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={'relative pb-3 text-sm font-medium whitespace-nowrap transition rounded-t ' + ring + ' ' + (tab === t.id ? 'text-zy-fg' : 'text-zy-fg-3 hover:text-zy-fg-2')}
                  >
                    {t.label}
                    {tab === t.id && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand rounded-full" />}
                  </button>
                ))}
              </div>
            )}

            <div key={tab} className="tab-in pb-24">{renderTab()}</div>
          </div>
        </main>

        <button
          onClick={save}
          disabled={saving}
          aria-busy={saving}
          className={'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand text-white font-semibold pl-5 pr-6 py-3.5 shadow-brand-fab fab-pop hover:scale-105 active:scale-95 transition disabled:opacity-60 disabled:hover:scale-100 ' + ring}
        >
          <span className={saving ? 'spin inline-block' : 'inline-block'}>{saving ? '◌' : '💾'}</span>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        {status && (
          <div
            role={status.includes('Lỗi') ? 'alert' : 'status'}
            aria-live={status.includes('Lỗi') ? 'assertive' : 'polite'}
            className="fixed bottom-24 right-6 z-40 text-sm font-medium bg-zy-card border border-zy-border text-zy-fg rounded-xl px-5 py-3 fade-up shadow-brand-1 flex items-center gap-2"
          >
            {status.includes('Lỗi') ? '⚠️' : '✨'} {status}
          </div>
        )}

        {share && <ShareModal url={profileUrl} accent={p.theme?.accent || '#2563eb'} onClose={() => setShare(false)} />}
      </div>
    </EditorCtx.Provider>
  )
}
