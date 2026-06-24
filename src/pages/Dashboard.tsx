import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  { id: 'customize', label: 'Customize' },
  { id: 'color', label: 'Color' },
  { id: 'link', label: 'Link' },
  { id: 'decoration', label: 'Decoration' },
  { id: 'couple', label: 'Couple' },
  { id: 'templates', label: 'Templates' },
]

const previewScale = { transform: 'scale(0.92)', transformOrigin: 'top center', width: '100%' }

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tab, setTab] = useState('customize')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState('')
  const [share, setShare] = useState(false)

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
            <div className="flex items-center gap-2 border border-white/10 rounded-md px-4 py-3">
              <span className="text-sm text-zinc-500">web.com/</span>
              <span className="text-sm flex-1 font-medium">{p.username}</span>
            </div>

            <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={'px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition ' + (tab === t.id ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-white')}>{t.label}</button>
              ))}
            </div>

            {tab === 'customize' && <CustomizeTab />}
            {tab === 'color' && <ColorTab />}
            {tab === 'link' && <LinksTab />}
            {tab === 'decoration' && <DecorationTab />}
            {tab === 'couple' && <CoupleTab />}
            {tab === 'templates' && <TemplatesTab />}

            <label className="flex items-center gap-2 text-sm border border-white/10 rounded-md px-4 py-3">
              <input type="checkbox" checked={p.is_public} onChange={(e) => editor.update({ is_public: e.target.checked })} /> Trang công khai
            </label>

            <div className="flex items-center gap-3 sticky bottom-4">
              <button onClick={save} disabled={saving} className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200 disabled:opacity-50 transition">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              {status && <span className="text-sm text-zinc-400">{status}</span>}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">Live preview</div>
              <div className="border border-white/10 rounded-lg bg-black overflow-hidden p-6 flex justify-center min-h-[420px]">
                <div style={previewScale}>
                  <BioCard profile={p} preview />
                </div>
              </div>
            </div>
          </div>
        </div>

        {share && <ShareModal url={profileUrl} accent={p.theme?.accent || '#ffffff'} onClose={() => setShare(false)} />}
      </div>
    </EditorCtx.Provider>
  )
}
