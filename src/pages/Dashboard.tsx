import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Profile, Theme } from '../types'
import { uploadAsset } from '../lib/storage'
import { EditorCtx, Editor } from '../context/EditorContext'
import BioCard from '../components/BioCard'
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

const TABS = [
  { id: 'overview', label: 'Overview', icon: '◱' },
  { id: 'customize', label: 'Customize', icon: '✎' },
  { id: 'color', label: 'Color', icon: '◑' },
  { id: 'link', label: 'Link', icon: '⛓' },
  { id: 'widgets', label: 'Widgets', icon: '🗂' },
  { id: 'decoration', label: 'Decoration', icon: '✦' },
  { id: 'couple', label: 'Couple', icon: '❤' },
  { id: 'templates', label: 'Templates', icon: '▦' },
  { id: 'security', label: 'Security', icon: '🛡' },
]

// Shared focus-visible ring (token: color.focus.ring = brand)
const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-dash-bg'

const previewScale = { transform: 'scale(0.92)', transformOrigin: 'top center', width: '100%' }
const hideScroll: CSSProperties = { scrollbarWidth: 'none', msOverflowStyle: 'none' }

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState('')
  const [share, setShare] = useState(false)

  const setTab = (id: string) => { setParams({ tab: id }); setStatus('') }

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data as Profile))
  }, [user])

  const profileUrl = useMemo(() => (profile ? window.location.origin + '/' + profile.username : ''), [profile])

  if (!profile) {
    return <div className="min-h-screen font-soft flex items-center justify-center bg-dash-bg text-dash-muted text-sm">loading profile…</div>
  }
  const p = profile

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

  return (
    <EditorCtx.Provider value={editor}>
      <div className="min-h-screen font-soft bg-dash-bg text-dash-text selection:bg-brand/30">
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dash-surface/80 backdrop-blur">
          <div className="text-sm font-bold tracking-wide flex items-center gap-2">
            <div className="w-6 h-6 bg-brand text-white flex items-center justify-center rounded-md text-xs">▲</div>
            <span>bio<span className="text-dash-muted font-medium">/dashboard</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to={'/' + p.username} target="_blank" className={'px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition font-medium hidden sm:block ' + ring}>Xem trang ↗</Link>
            <button onClick={() => setShare(true)} className={'px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition font-medium ' + ring}>Share</button>
            <button onClick={signOut} className={'px-4 py-2 text-sm text-dash-muted hover:text-dash-text transition font-medium rounded-lg ' + ring}>Đăng xuất</button>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[220px_1fr_340px] gap-8">
          
          {/* Vertical Menu Sidebar */}
          <div className="flex flex-col gap-2">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-dash-muted font-semibold px-3 hidden lg:block">Menu</div>
            <nav aria-label="Dashboard sections" className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b lg:border-b-0 border-white/10" style={hideScroll}>
              {TABS.map((t) => (
                <button 
                  key={t.id} 
                  onClick={() => setTab(t.id)} 
                  aria-current={tab === t.id ? 'page' : undefined}
                  className={'flex items-center gap-3 px-3.5 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap lg:whitespace-normal ' + ring + ' ' +
                    (tab === t.id ? 'bg-brand text-white shadow-brand-1' : 'text-dash-muted hover:bg-white/5 hover:text-dash-text')}
                >
                  <span className={'text-lg ' + (tab === t.id ? 'opacity-100' : 'opacity-70')}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Workspace Area */}
          <div className="flex flex-col gap-6 min-w-0">
            <div className="flex items-center gap-3 border border-white/10 bg-white/[0.02] rounded-xl px-5 py-3.5 backdrop-blur-sm">
              <span className="text-sm text-dash-muted hidden sm:inline">web.com/</span>
              <span className="text-sm flex-1 font-semibold truncate">{p.username}</span>
              <label className="flex items-center gap-2 text-sm text-zinc-300 hover:text-dash-text cursor-pointer shrink-0 transition font-medium">
                <input type="checkbox" checked={p.is_public} onChange={(e) => editor.update({ is_public: e.target.checked })} className={'accent-brand w-4 h-4 rounded-sm cursor-pointer ' + ring} /> 
                Công khai
              </label>
            </div>

            <div key={tab} className="tab-in border border-white/10 bg-dash-surface rounded-2xl p-6 sm:p-8 shadow-brand-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/40 to-transparent"></div>
              {tab === 'overview' && <OverviewTab />}
              {tab === 'customize' && <CustomizeTab />}
              {tab === 'color' && <ColorTab />}
              {tab === 'link' && <LinksTab />}
              {tab === 'widgets' && <WidgetsTab />}
              {tab === 'decoration' && <DecorationTab />}
              {tab === 'couple' && <CoupleTab />}
              {tab === 'templates' && <TemplatesTab />}
              {tab === 'security' && <SecurityTab />}
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-dash-muted font-semibold">Live preview</div>
                <Link to={'/' + p.username} target="_blank" className={'text-[11px] text-dash-muted hover:text-dash-text transition font-medium flex items-center gap-1 rounded ' + ring}>
                  Mở trang thật ↗
                </Link>
              </div>
              <div className="border border-white/10 rounded-[2rem] bg-dash-sunken overflow-hidden shadow-brand-1 relative">
                <div className="absolute top-4 w-full flex justify-center z-10 pointer-events-none">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
                </div>
                <div className="p-4 pt-12 flex justify-center min-h-[600px] h-[calc(100vh-200px)] overflow-y-auto" style={hideScroll}>
                  <div style={previewScale}>
                    <BioCard profile={p} preview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={save} disabled={saving} className={'fixed bottom-6 right-6 lg:right-10 z-50 flex items-center gap-2 rounded-full bg-brand text-white font-semibold pl-5 pr-6 py-3.5 shadow-brand-fab fab-pop hover:scale-105 active:scale-95 transition disabled:opacity-60 disabled:hover:scale-100 border border-transparent ' + ring} aria-busy={saving}>
          <span className={saving ? 'spin inline-block' : 'inline-block'}>{saving ? '◌' : '💾'}</span>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        {status && <div role={status.includes('Lỗi') ? 'alert' : 'status'} aria-live={status.includes('Lỗi') ? 'assertive' : 'polite'} className="fixed bottom-24 right-6 lg:right-10 z-40 text-sm font-medium bg-dash-surface border border-white/20 text-dash-text rounded-xl px-5 py-3 fade-up shadow-brand-1 flex items-center gap-2">
          {status.includes('Lỗi') ? '⚠️' : '✨'} {status}
        </div>}

        {share && <ShareModal url={profileUrl} accent={p.theme?.accent || '#ffffff'} onClose={() => setShare(false)} />}
      </div>
    </EditorCtx.Provider>
  )
}
