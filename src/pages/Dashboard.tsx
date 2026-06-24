import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Profile, Theme } from '../types'
import { uploadAsset } from '../lib/storage'
import { EditorCtx, Editor } from '../context/EditorContext'
import BioCard from '../components/BioCard'
import ShareModal from '../components/ShareModal'
import CustomizeTab from '../components/dashboard/CustomizeTab'
import ColorTab from '../components/dashboard/ColorTab'
import LinksTab from '../components/dashboard/LinksTab'
import DecorationTab from '../components/dashboard/DecorationTab'
import CoupleTab from '../components/dashboard/CoupleTab'
import TemplatesTab from '../components/dashboard/TemplatesTab'

const TABS = [
  { id: 'customize', label: 'Customize', icon: '✎' },
  { id: 'color', label: 'Color', icon: '◑' },
  { id: 'link', label: 'Link', icon: '⛓' },
  { id: 'decoration', label: 'Decoration', icon: '✦' },
  { id: 'couple', label: 'Couple', icon: '❤' },
  { id: 'templates', label: 'Templates', icon: '▦' },
]

const previewScale = { transform: 'scale(0.92)', transformOrigin: 'top center', width: '100%' }

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'customize'
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
    return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500 text-sm">loading profile…</div>
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
      discord_id: p.discord_id,
      links: p.links,
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
      <div className="min-h-screen bg-black text-white">
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="text-sm font-semibold">▲ bio<span className="text-zinc-500">/dashboard</span></div>
          <div className="flex items-center gap-2">
            <Link to={'/' + p.username} target="_blank" className="px-3 py-1.5 border border-white/15 hover:border-white/40 rounded-md text-sm transition">Xem trang ↗</Link>
            <button onClick={() => setShare(true)} className="px-3 py-1.5 border border-white/15 hover:border-white/40 rounded-md text-sm transition">Share</button>
            <button onClick={signOut} className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition">Đăng xuất</button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6 grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-2.5">
              <span className="text-sm text-zinc-500">web.com/</span>
              <span className="text-sm flex-1 font-medium">{p.username}</span>
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={p.is_public} onChange={(e) => editor.update({ is_public: e.target.checked })} /> Công khai
              </label>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition ' + (tab === t.id ? 'bg-white text-black' : 'border border-white/15 text-zinc-400 hover:text-white hover:border-white/40')}><span>{t.icon}</span>{t.label}</button>
              ))}
            </div>

            <div key={tab} className="tab-in">
              {tab === 'customize' && <CustomizeTab />}
              {tab === 'color' && <ColorTab />}
              {tab === 'link' && <LinksTab />}
              {tab === 'decoration' && <DecorationTab />}
              {tab === 'couple' && <CoupleTab />}
              {tab === 'templates' && <TemplatesTab />}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Live preview</div>
                <Link to={'/' + p.username} target="_blank" className="text-[11px] text-zinc-400 hover:text-white transition">Mở trang thật ↗</Link>
              </div>
              <div className="border border-white/10 rounded-xl bg-black overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="p-6 flex justify-center min-h-[420px]">
                  <div style={previewScale}>
                    <BioCard profile={p} preview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-white text-black font-medium pl-5 pr-6 py-3.5 shadow-lg shadow-black/40 fab-pop hover:scale-105 active:scale-95 transition disabled:opacity-60">
          <span className={saving ? 'spin inline-block' : 'inline-block'}>{saving ? '◌' : '💾'}</span>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        {status && <div className="fixed bottom-20 right-6 z-40 text-sm bg-zinc-900 border border-white/15 rounded-lg px-4 py-2 fade-up">{status}</div>}

        {share && <ShareModal url={profileUrl} accent={p.theme?.accent || '#ffffff'} onClose={() => setShare(false)} />}
      </div>
    </EditorCtx.Provider>
  )
}
