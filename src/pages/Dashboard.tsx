import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Profile, ProfileLink } from '../types'
import { uploadAsset } from '../lib/storage'

const FONTS = [
  { label: 'Mặc định', value: 'system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Mono', value: 'Courier New, monospace' },
  { label: 'Trebuchet', value: 'Trebuchet MS, sans-serif' },
]

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data as Profile))
  }, [user])

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Đang tải profile...
      </div>
    )
  }

  const update = (patch: Partial<Profile>) => setProfile({ ...profile, ...patch })

  const setTheme = (patch: Record<string, unknown>) =>
    update({ theme: { ...(profile.theme ?? {}), ...patch } as Profile['theme'] })

  const setBg = (patch: Record<string, unknown>) =>
    update({ background: { ...(profile.background ?? {}), ...patch } as Profile['background'] })

  const toggleEffect = (name: string) => {
    const cur = profile.theme?.effects ?? []
    const next = cur.includes(name) ? cur.filter((e) => e !== name) : [...cur, name]
    setTheme({ effects: next })
  }

  const updateLink = (i: number, patch: Partial<ProfileLink>) => {
    const links = [...(profile.links ?? [])]
    links[i] = { ...links[i], ...patch }
    update({ links })
  }
  const addLink = () => update({ links: [...(profile.links ?? []), { label: '', url: '' }] })
  const removeLink = (i: number) => {
    const links = [...(profile.links ?? [])]
    links.splice(i, 1)
    update({ links })
  }

  const handleUpload = async (
    file: File | undefined,
    folder: string,
    onDone: (url: string) => void,
  ) => {
    if (!file) return
    setUploading(folder)
    setStatus('')
    try {
      const url = await uploadAsset(profile.id, file, folder)
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
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        music_url: profile.music_url,
        cursor_url: profile.cursor_url,
        discord_id: profile.discord_id,
        links: profile.links,
        theme: profile.theme,
        background: profile.background,
      })
      .eq('id', profile.id)
    setSaving(false)
    setStatus(error ? 'Lỗi: ' + error.message : 'Đã lưu ✅')
  }

  const field =
    'w-full px-4 py-2 rounded-lg bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500'
  const section = 'flex flex-col gap-3 bg-gray-900 rounded-2xl p-5'
  const effects = profile.theme?.effects ?? []

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            <Link
              to={'/' + profile.username}
              target="_blank"
              className="text-purple-400 hover:underline text-sm self-center"
            >
              Xem trang ↗
            </Link>
            <button
              onClick={signOut}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Link của bạn: <span className="text-white">web.com/{profile.username}</span>
        </div>

        {/* THÔNG TIN */}
        <div className={section}>
          <h2 className="font-semibold text-gray-300">Thông tin</h2>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Tên hiển thị</span>
            <input className={field} value={profile.display_name ?? ''} onChange={(e) => update({ display_name: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Bio</span>
            <textarea className={field} rows={3} value={profile.bio ?? ''} onChange={(e) => update({ bio: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Discord ID (cho presence)</span>
            <input className={field} value={profile.discord_id ?? ''} onChange={(e) => update({ discord_id: e.target.value })} placeholder="123456789012345678" />
          </label>
        </div>

        {/* MEDIA */}
        <div className={section}>
          <h2 className="font-semibold text-gray-300">Ảnh & Nhạc</h2>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Avatar</span>
            <div className="flex gap-2 items-center">
              <input className={field} value={profile.avatar_url ?? ''} onChange={(e) => update({ avatar_url: e.target.value })} placeholder="Dán URL hoặc tải lên →" />
              <label className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm cursor-pointer whitespace-nowrap">
                {uploading === 'avatar' ? '...' : 'Tải lên'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'avatar', (url) => update({ avatar_url: url }))} />
              </label>
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Nhạc nền (mp3)</span>
            <div className="flex gap-2 items-center">
              <input className={field} value={profile.music_url ?? ''} onChange={(e) => update({ music_url: e.target.value })} placeholder="Dán URL hoặc tải lên →" />
              <label className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm cursor-pointer whitespace-nowrap">
                {uploading === 'music' ? '...' : 'Tải lên'}
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'music', (url) => update({ music_url: url }))} />
              </label>
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Custom cursor (ảnh nhỏ)</span>
            <div className="flex gap-2 items-center">
              <input className={field} value={profile.cursor_url ?? ''} onChange={(e) => update({ cursor_url: e.target.value })} placeholder="Dán URL hoặc tải lên →" />
              <label className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm cursor-pointer whitespace-nowrap">
                {uploading === 'cursor' ? '...' : 'Tải lên'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'cursor', (url) => update({ cursor_url: url }))} />
              </label>
            </div>
          </label>
        </div>

        {/* THEME */}
        <div className={section}>
          <h2 className="font-semibold text-gray-300">Giao diện</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Màu chủ đạo</span>
              <input type="color" value={profile.theme?.accent ?? '#a855f7'} onChange={(e) => setTheme({ accent: e.target.value })} className="w-10 h-8 rounded bg-transparent cursor-pointer" />
            </label>
            <label className="flex items-center gap-2 flex-1">
              <span className="text-sm text-gray-400">Font</span>
              <select className={field} value={profile.theme?.font ?? FONTS[0].value} onChange={(e) => setTheme({ font: e.target.value })}>
                {FONTS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={effects.includes('snow')} onChange={() => toggleEffect('snow')} />
              <span className="text-sm">❄️ Tuyết rơi</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={effects.includes('particles')} onChange={() => toggleEffect('particles')} />
              <span className="text-sm">✨ Particles</span>
            </label>
          </div>
        </div>

        {/* NềN */}
        <div className={section}>
          <h2 className="font-semibold text-gray-300">Nền trang</h2>
          <div className="flex gap-2">
            {['default', 'image', 'video'].map((t) => (
              <button
                key={t}
                onClick={() => setBg({ type: t === 'default' ? undefined : t })}
                className={
                  'px-3 py-1.5 rounded-lg text-sm ' +
                  ((profile.background?.type ?? 'default') === t ? 'bg-purple-600' : 'bg-gray-800')
                }
              >
                {t === 'default' ? 'Gradient' : t === 'image' ? 'Ảnh' : 'Video'}
              </button>
            ))}
          </div>
          {profile.background?.type && (
            <div className="flex gap-2 items-center">
              <input className={field} value={profile.background?.url ?? ''} onChange={(e) => setBg({ url: e.target.value })} placeholder="URL ảnh/video nền" />
              <label className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm cursor-pointer whitespace-nowrap">
                {uploading === 'bg' ? '...' : 'Tải lên'}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0], 'bg', (url) => setBg({ url }))} />
              </label>
            </div>
          )}
        </div>

        {/* LINKS */}
        <div className={section}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-300">Links</h2>
            <button onClick={addLink} className="text-purple-400 text-sm hover:underline">+ Thêm link</button>
          </div>
          {(profile.links ?? []).map((link, i) => (
            <div key={i} className="flex gap-2">
              <input className={field} value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Nhãn (vd: GitHub)" />
              <input className={field} value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://..." />
              <button onClick={() => removeLink(i)} className="px-3 bg-red-500/20 text-red-400 rounded-lg">×</button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 sticky bottom-4">
          <button onClick={save} disabled={saving} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium disabled:opacity-50 shadow-lg">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          {status && <span className="text-sm text-gray-400">{status}</span>}
        </div>
      </div>
    </div>
  )
}
