import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Profile, ProfileLink, Theme } from '../types'
import { uploadAsset } from '../lib/storage'
import { PRESETS, Preset } from '../lib/presets'
import BioCard from '../components/BioCard'
import ShareModal from '../components/ShareModal'

const FONTS = [
  { label: 'Inter (sans)', value: "'Inter', system-ui, sans-serif" },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'System', value: 'system-ui, sans-serif' },
]

const EFFECT_OPTS = [
  { id: 'particles', label: '✦ Particles' },
  { id: 'snow', label: '❄ Snow' },
  { id: 'rain', label: '╱ Rain' },
  { id: 'stars', label: '★ Stars' },
  { id: 'fireflies', label: '∴ Fireflies' },
  { id: 'matrix', label: '⌗ Matrix' },
]

const LAYOUTS = [
  { id: 'card', label: 'Card' },
  { id: 'wide', label: 'Wide' },
  { id: 'minimal', label: 'Minimal' },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
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
    return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500 font-mono text-sm">loading profile…</div>
  }

  const p = profile
  const theme: Theme = p.theme ?? {}

  const update = (patch: Partial<Profile>) => setProfile({ ...p, ...patch })
  const setTheme = (patch: Record<string, unknown>) => update({ theme: { ...(p.theme ?? {}), ...patch } as Profile['theme'] })
  const setBg = (patch: Record<string, unknown>) => update({ background: { ...(p.background ?? {}), ...patch } as Profile['background'] })

  const toggleEffect = (name: string) => {
    const cur = theme.effects ?? []
    const next = cur.includes(name) ? cur.filter((e) => e !== name) : [...cur, name]
    setTheme({ effects: next })
  }

  const applyPreset = (pr: Preset) => {
    update({ theme: { ...(p.theme ?? {}), accent: pr.accent, accent2: pr.accent2, textColor: pr.textColor, monospace: pr.monospace, effects: pr.effects, preset: pr.id } })
  }

  const updateLink = (i: number, patch: Partial<ProfileLink>) => {
    const links = [...(p.links ?? [])]
    links[i] = { ...links[i], ...patch }
    update({ links })
  }
  const addLink = () => update({ links: [...(p.links ?? []), { label: '', url: '' }] })
  const removeLink = (i: number) => {
    const links = [...(p.links ?? [])]
    links.splice(i, 1)
    update({ links })
  }
  const moveLink = (i: number, dir: -1 | 1) => {
    const links = [...(p.links ?? [])]
    const j = i + dir
    if (j < 0 || j >= links.length) return
    const tmp = links[i]
    links[i] = links[j]
    links[j] = tmp
    update({ links })
  }

  const setBadges = (s: string) => update({ badges: s.split(',').map((x) => x.trim()).filter(Boolean) })

  const handleUpload = async (file: File | undefined, folder: string, onDone: (url: string) => void) => {
    if (!file) return
    setUploading(folder)
    setStatus('')
    try {
      const url = await uploadAsset(p.id, file, folder)
      onDone(url)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown'
      setStatus('Upload lỗi: ' + msg)
    } finally {
      setUploading('')
    }
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

  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(profileUrl); setStatus('Đã copy link ✅') } catch { /* ignore */ }
  }

  const field = 'w-full px-3 py-2 bg-white/5 border border-white/10 text-sm focus:border-white/30 focus:outline-none placeholder:text-zinc-600 transition'
  const card = 'border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3'
  const label = 'font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500'
  const upBtn = 'px-3 py-2 border border-white/15 hover:border-white/40 text-xs cursor-pointer whitespace-nowrap transition'
  const previewScale = { transform: 'scale(0.92)', transformOrigin: 'top center', width: '100%' }

  const effects = theme.effects ?? []
  const accent = theme.accent || '#ffffff'
  const accent2 = theme.accent2 || '#666666'

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="font-mono text-sm">▲ bio<span className="text-zinc-500">/dashboard</span></div>
        <div className="flex items-center gap-2">
          <Link to={'/' + p.username} target="_blank" className="px-3 py-1.5 border border-white/15 hover:border-white/40 text-sm transition">Xem trang ↗</Link>
          <button onClick={signOut} className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition">Đăng xuất</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="font-mono text-sm text-zinc-500">web.com/</span>
            <span className="font-mono text-sm flex-1">{p.username}</span>
            <button onClick={copyUrl} className="text-xs border border-white/15 hover:border-white/40 px-2 py-1 transition">copy</button>
            <button onClick={() => setShare(true)} className="text-xs border border-white/15 hover:border-white/40 px-2 py-1 transition">QR</button>
          </div>

          <div className={card}>
            <h2 className={label}>Thông tin</h2>
            <input className={field} value={p.display_name ?? ''} onChange={(e) => update({ display_name: e.target.value })} placeholder="Tên hiển thị" />
            <textarea className={field} rows={3} value={p.bio ?? ''} onChange={(e) => update({ bio: e.target.value })} placeholder="Bio" />
            <input className={field} value={p.discord_id ?? ''} onChange={(e) => update({ discord_id: e.target.value })} placeholder="Discord ID (presence)" />
            <input className={field} value={(p.badges ?? []).join(', ')} onChange={(e) => setBadges(e.target.value)} placeholder="Badges, ngăn cách dấu phẩy" />
          </div>

          <div className={card}>
            <h2 className={label}>Giao diện</h2>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((pr) => {
                const dot = { background: pr.accent }
                const activeCls = theme.preset === pr.id ? 'border-white' : 'border-white/15 hover:border-white/40'
                return (
                  <button key={pr.id} onClick={() => applyPreset(pr)} className={'flex items-center gap-2 px-3 py-1.5 border text-xs transition ' + activeCls}>
                    <span className="w-3 h-3 inline-block" style={dot} />
                    {pr.name}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-400">Màu chính
                <input type="color" value={accent} onChange={(e) => setTheme({ accent: e.target.value })} className="w-9 h-8 bg-transparent cursor-pointer" />
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-400">Màu phụ
                <input type="color" value={accent2} onChange={(e) => setTheme({ accent2: e.target.value })} className="w-9 h-8 bg-transparent cursor-pointer" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!theme.monospace} onChange={(e) => setTheme({ monospace: e.target.checked })} /> Mono font
              </label>
            </div>
            <select className={field} value={theme.font ?? FONTS[0].value} onChange={(e) => setTheme({ font: e.target.value })}>
              {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <div className="flex gap-2">
              {LAYOUTS.map((l) => {
                const activeCls = (theme.layout || 'card') === l.id ? 'bg-white text-black' : 'border border-white/15 hover:border-white/40'
                return <button key={l.id} onClick={() => setTheme({ layout: l.id })} className={'px-3 py-1.5 text-xs transition ' + activeCls}>{l.label}</button>
              })}
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!theme.nameTyping} onChange={(e) => setTheme({ nameTyping: e.target.checked })} /> Hiệu ứng gõ tên</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={theme.showStats !== false} onChange={(e) => setTheme({ showStats: e.target.checked })} /> Hiện thống kê</label>
            </div>
          </div>

          <div className={card}>
            <h2 className={label}>Hiệu ứng động</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EFFECT_OPTS.map((ef) => {
                const on = effects.includes(ef.id)
                const cls = on ? 'bg-white text-black' : 'border border-white/15 hover:border-white/40'
                return <button key={ef.id} onClick={() => toggleEffect(ef.id)} className={'px-3 py-2 text-xs transition ' + cls}>{ef.label}</button>
              })}
            </div>
          </div>

          <div className={card}>
            <h2 className={label}>Nền trang</h2>
            <div className="flex gap-2">
              {['default', 'image', 'video'].map((t) => {
                const cur = p.background?.type ?? 'default'
                const cls = cur === t ? 'bg-white text-black' : 'border border-white/15 hover:border-white/40'
                return <button key={t} onClick={() => setBg({ type: t === 'default' ? undefined : t })} className={'px-3 py-1.5 text-xs transition ' + cls}>{t === 'default' ? 'Grid' : t === 'image' ? 'Ảnh' : 'Video'}</button>
              })}
            </div>
            {p.background?.type && (
              <div className="flex gap-2 items-center">
                <input className={field} value={p.background?.url ?? ''} onChange={(e) => setBg({ url: e.target.value })} placeholder="URL ảnh/video" />
                <label className={upBtn}>{uploading === 'bg' ? '...' : 'Tải lên'}<input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'bg', (url) => setBg({ url }))} /></label>
              </div>
            )}
            {p.background?.type && (
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-400">Blur
                  <input type="range" min={0} max={20} value={p.background?.blur ?? 0} onChange={(e) => setBg({ blur: Number(e.target.value) })} />
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400">Tối
                  <input type="range" min={0} max={1} step={0.05} value={p.background?.opacity ?? 0.5} onChange={(e) => setBg({ opacity: Number(e.target.value) })} />
                </label>
              </div>
            )}
          </div>

          <div className={card}>
            <h2 className={label}>Ảnh & Nhạc</h2>
            <div className="flex gap-2 items-center">
              <input className={field} value={p.avatar_url ?? ''} onChange={(e) => update({ avatar_url: e.target.value })} placeholder="Avatar URL" />
              <label className={upBtn}>{uploading === 'avatar' ? '...' : 'Tải lên'}<input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'avatar', (url) => update({ avatar_url: url }))} /></label>
            </div>
            <div className="flex gap-2 items-center">
              <input className={field} value={p.music_url ?? ''} onChange={(e) => update({ music_url: e.target.value })} placeholder="Nhạc nền URL (mp3)" />
              <label className={upBtn}>{uploading === 'music' ? '...' : 'Tải lên'}<input type="file" accept="audio/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'music', (url) => update({ music_url: url }))} /></label>
            </div>
            <div className="flex gap-2 items-center">
              <input className={field} value={p.cursor_url ?? ''} onChange={(e) => update({ cursor_url: e.target.value })} placeholder="Con trỏ URL (ảnh nhỏ)" />
              <label className={upBtn}>{uploading === 'cursor' ? '...' : 'Tải lên'}<input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'cursor', (url) => update({ cursor_url: url }))} /></label>
            </div>
          </div>

          <div className={card}>
            <div className="flex items-center justify-between">
              <h2 className={label}>Links</h2>
              <button onClick={addLink} className="text-xs border border-white/15 hover:border-white/40 px-2 py-1 transition">+ Thêm</button>
            </div>
            {(p.links ?? []).map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="flex flex-col">
                  <button onClick={() => moveLink(i, -1)} className="text-zinc-500 hover:text-white text-xs leading-none">▲</button>
                  <button onClick={() => moveLink(i, 1)} className="text-zinc-500 hover:text-white text-xs leading-none">▼</button>
                </div>
                <input className={field + ' w-16'} value={link.icon ?? ''} onChange={(e) => updateLink(i, { icon: e.target.value })} placeholder="🔗" />
                <input className={field} value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Nhãn" />
                <input className={field} value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://..." />
                <button onClick={() => removeLink(i)} className="px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">×</button>
              </div>
            ))}
          </div>

          <div className={card}>
            <h2 className={label}>Hiển thị</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={p.is_public} onChange={(e) => update({ is_public: e.target.checked })} />
              Trang công khai (tắt để ẩn khỏi người xem)
            </label>
          </div>

          <div className="flex items-center gap-3 sticky bottom-4">
            <button onClick={save} disabled={saving} className="px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 disabled:opacity-50 transition">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
            {status && <span className="text-sm text-zinc-400">{status}</span>}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            <div className={label + ' mb-3'}>Live preview</div>
            <div className="border border-white/10 bg-black overflow-hidden p-6 flex justify-center min-h-[420px]">
              <div style={previewScale}>
                <BioCard profile={p} preview />
              </div>
            </div>
            <p className="text-[11px] text-zinc-600 font-mono mt-2">* hiệu ứng động & nhạc chỉ hiện ở trang thật</p>
          </div>
        </div>
      </div>

      {share && <ShareModal url={profileUrl} accent={accent} onClose={() => setShare(false)} />}
    </div>
  )
}
