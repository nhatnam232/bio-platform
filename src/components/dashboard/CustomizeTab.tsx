import { useState } from 'react'
import { useEditor } from '../../context/EditorContext'
import { Theme } from '../../types'
import Toggle from '../ui/Toggle'
import { Card, Label, inputCls } from '../ui/Field'
import { FONTS, BG_EFFECTS, NAME_EFFECTS } from '../../lib/effects'

export default function CustomizeTab() {
  const { p, update, setTheme, setBg, upload, uploading } = useEditor()
  const theme: Theme = p.theme ?? {}
  const [descPreview, setDescPreview] = useState(false)
  const upBtn = 'px-3 py-2 border border-white/15 hover:border-white/40 rounded-md text-xs cursor-pointer whitespace-nowrap transition'

  const uploadRow = (label: string, value: string, folder: string, accept: string, onUrl: (u: string) => void) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        <input className={inputCls} value={value} onChange={(e) => onUrl(e.target.value)} placeholder={label + ' URL'} />
        <label className={upBtn}>{uploading === folder ? '...' : 'Tải lên'}<input type="file" accept={accept} className="hidden" onChange={(e) => upload(e.target.files?.[0], folder, onUrl)} /></label>
      </div>
    </div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Assets">
        {uploadRow('Avatar', p.avatar_url ?? '', 'avatar', 'image/*', (u) => update({ avatar_url: u }))}
        <div>
          <Label>Wallpaper Mode</Label>
          <div className="flex gap-2 text-xs">
            <button onClick={() => setTheme({ wallpaperMode: 'wallpaper' })} className={'px-3 py-1.5 rounded-md border transition ' + ((theme.wallpaperMode || 'wallpaper') === 'wallpaper' ? 'bg-white text-black' : 'border-white/15')}>Wallpaper</button>
            <button onClick={() => setTheme({ wallpaperMode: 'banner' })} className={'px-3 py-1.5 rounded-md border transition ' + (theme.wallpaperMode === 'banner' ? 'bg-white text-black' : 'border-white/15')}>Banner</button>
          </div>
        </div>
        {uploadRow('Wallpaper / Video', p.background?.url ?? '', 'bg', 'image/*,video/*', (u) => setBg({ url: u, type: /\.(mp4|webm)$/i.test(u) ? 'video' : 'image' }))}
        {uploadRow('Audio', p.music_url ?? '', 'music', 'audio/*', (u) => update({ music_url: u }))}
        {uploadRow('Cursor', p.cursor_url ?? '', 'cursor', 'image/*', (u) => update({ cursor_url: u }))}
      </Card>

      <Card title="Information">
        <div><Label>Display Name</Label><input className={inputCls} value={p.display_name ?? ''} onChange={(e) => update({ display_name: e.target.value })} placeholder="Tên hiển thị" /></div>
        <div><Label>Location</Label><input className={inputCls} value={theme.location ?? ''} onChange={(e) => setTheme({ location: e.target.value })} placeholder="Vietnam" /></div>
        <div><Label>Page Enter Text</Label><input className={inputCls} value={theme.enterText ?? ''} onChange={(e) => setTheme({ enterText: e.target.value })} placeholder="click to enter" /></div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Description</Label>
            <button onClick={() => setDescPreview((v) => !v)} className="text-[11px] text-zinc-400 hover:text-white">{descPreview ? 'Edit' : 'Preview'}</button>
          </div>
          {descPreview ? (
            <div className="text-sm text-zinc-300 border border-white/10 rounded-md px-3 py-2 min-h-[72px] whitespace-pre-line">{p.bio || '...'}</div>
          ) : (
            <textarea className={inputCls} rows={3} value={p.bio ?? ''} onChange={(e) => update({ bio: e.target.value })} placeholder="Bio. Hỗ trợ [text](url)" />
          )}
          <p className="text-[11px] text-zinc-600 mt-1">Mẹo: [Discord](https://discord.gg/abc) để chèn link.</p>
        </div>
        <div><Label>Discord ID</Label><input className={inputCls} value={p.discord_id ?? ''} onChange={(e) => update({ discord_id: e.target.value })} placeholder="Discord ID" /></div>
        <div><Label>Badges</Label><input className={inputCls} value={(p.badges ?? []).join(', ')} onChange={(e) => update({ badges: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} placeholder="vip, dev" /></div>
      </Card>

      <Card title="Layout">
        <div><Label>Font Style</Label>
          <select className={inputCls} value={theme.font ?? FONTS[0].id} onChange={(e) => setTheme({ font: e.target.value })}>
            {FONTS.map((f) => <option key={f.id} value={f.id} className="bg-zinc-900">{f.label}</option>)}
          </select>
        </div>
        <div><Label>Background Effect</Label>
          <select className={inputCls} value={theme.backgroundEffect ?? ''} onChange={(e) => setTheme({ backgroundEffect: e.target.value, effects: e.target.value ? [e.target.value] : [] })}>
            {BG_EFFECTS.map((f) => <option key={f.id} value={f.id} className="bg-zinc-900">{f.label}</option>)}
          </select>
        </div>
        <div><Label>Name Effect</Label>
          <select className={inputCls} value={theme.nameEffect ?? ''} onChange={(e) => setTheme({ nameEffect: e.target.value })}>
            {NAME_EFFECTS.map((f) => <option key={f.id} value={f.id} className="bg-zinc-900">{f.label}</option>)}
          </select>
        </div>
        <div><Label>Card Layout</Label>
          <div className="flex gap-2">
            {['card', 'wide', 'minimal'].map((l) => (
              <button key={l} onClick={() => setTheme({ layout: l })} className={'px-3 py-1.5 rounded-md text-xs capitalize transition ' + ((theme.layout || 'card') === l ? 'bg-white text-black' : 'border border-white/15')}>{l}</button>
            ))}
          </div>
        </div>
        <Toggle label="Mono font" checked={!!theme.monospace} onChange={(v) => setTheme({ monospace: v })} />
      </Card>

      <Card title="Discord, Glow & Other">
        <Toggle label="Discord Presence" checked={theme.discordPresence !== false} onChange={(v) => setTheme({ discordPresence: v })} />
        <Toggle label="Glow tên" checked={!!theme.glowName} onChange={(v) => setTheme({ glowName: v })} />
        <Toggle label="Glow icon" checked={!!theme.glowIcon} onChange={(v) => setTheme({ glowIcon: v })} />
        <div className="h-px bg-white/10 my-1" />
        <Toggle label="Like System" checked={!!theme.likeSystem} onChange={(v) => setTheme({ likeSystem: v })} />
        <Toggle label="Icon Single Color" checked={!!theme.iconSingleColor} onChange={(v) => setTheme({ iconSingleColor: v })} />
        <Toggle label="Animation Title" checked={!!theme.animationTitle} onChange={(v) => setTheme({ animationTitle: v })} />
        <Toggle label="Volume Control" checked={theme.volumeControl !== false} onChange={(v) => setTheme({ volumeControl: v })} />
        <Toggle label="Hiện thống kê" checked={theme.showStats !== false} onChange={(v) => setTheme({ showStats: v })} />
      </Card>
    </div>
  )
}
