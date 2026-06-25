import { ReactNode, useState } from 'react'
import { useEditor } from '../../context/EditorContext'
import { Theme } from '../../types'
import Toggle from '../ui/Toggle'
import { Card, Label, inputCls } from '../ui/Field'
import { FONTS, BG_EFFECTS, NAME_EFFECTS, TEXT_EFFECTS, Option } from '../../lib/effects'
import PickerModal, { PickerOption } from '../ui/PickerModal'
import NameText from '../NameText'

const LAYOUTS: Option[] = [
  { id: 'card', label: 'Card' },
  { id: 'wide', label: 'Wide' },
  { id: 'minimal', label: 'Minimal' },
]

const BG_ICON: Record<string, string> = {
  snow: '❄', stars: '★', particles: '✦', rain: '|', fireflies: '✦', matrix: '0', bubbles: '◦', hearts: '❤',
}

const labelOf = (opts: Option[], id: string | undefined) => (opts.find((o) => o.id === (id || '')) || opts[0]).label

function FontPreview({ id }: { id: string }) {
  const style = { fontFamily: id }
  return <span className="text-lg" style={style}>Aa Bb 123</span>
}

function NamePreview({ id }: { id: string }) {
  return <NameText text="Name" effect={id} />
}

function BgPreview({ id }: { id: string }) {
  if (!id) return <span className="text-xs text-zinc-600">Không</span>
  const icon = BG_ICON[id] || '✦'
  const items = [0, 1, 2, 3, 4]
  return (
    <div className="absolute inset-0 overflow-hidden">
      {items.map((i) => {
        const st = { left: i * 22 + 6 + '%', animationDuration: 2 + i * 0.4 + 's', animationDelay: i * 0.3 + 's' }
        return <span key={i} className="fx-fall absolute top-0 text-white/70 text-sm" style={st}>{icon}</span>
      })}
    </div>
  )
}

function LayoutPreview({ id }: { id: string }) {
  if (id === 'wide') return (
    <div className="w-16 h-10 rounded border border-white/30 flex gap-1 p-1">
      <div className="w-4 bg-white/30 rounded-sm" />
      <div className="flex-1 flex flex-col gap-1"><div className="h-1.5 bg-white/30 rounded" /><div className="h-1.5 w-2/3 bg-white/20 rounded" /></div>
    </div>
  )
  if (id === 'minimal') return (
    <div className="w-12 h-12 rounded border border-white/30 flex flex-col items-center justify-center gap-1"><div className="h-1.5 w-6 bg-white/30 rounded" /><div className="h-1 w-4 bg-white/20 rounded" /></div>
  )
  return (
    <div className="w-12 h-14 rounded border border-white/30 flex flex-col items-center pt-1.5 gap-1"><div className="w-5 h-5 rounded-full bg-white/30" /><div className="h-1.5 w-7 bg-white/30 rounded" /><div className="h-1 w-5 bg-white/20 rounded" /></div>
  )
}

export default function CustomizeTab() {
  const { p, update, setTheme, setBg, upload, uploading } = useEditor()
  const theme: Theme = p.theme ?? {}
  const [descPreview, setDescPreview] = useState(false)
  const [picker, setPicker] = useState<string | null>(null)
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

  const settingRow = (label: string, value: string, preview: ReactNode, onClick: () => void) => (
    <button onClick={onClick} className="w-full flex items-center justify-between gap-3 border border-white/10 hover:border-white/30 rounded-lg px-3 py-2.5 transition text-left">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
        <div className="text-sm font-medium mt-0.5">{value}</div>
      </div>
      <div className="relative w-16 h-10 rounded-md overflow-hidden bg-black border border-white/10 flex items-center justify-center shrink-0">{preview}</div>
    </button>
  )

  const fontId = theme.font ?? FONTS[0].id
  const bgId = theme.backgroundEffect ?? ''
  const nameId = theme.nameEffect ?? ''
  const textId = theme.textEffect ?? ''
  const layoutId = theme.layout || 'card'

  const fontOpts: PickerOption[] = FONTS.map((f) => ({ id: f.id, label: f.label, preview: <FontPreview id={f.id} /> }))
  const bgOpts: PickerOption[] = BG_EFFECTS.map((f) => ({ id: f.id, label: f.label, preview: <BgPreview id={f.id} /> }))
  const nameOpts: PickerOption[] = NAME_EFFECTS.map((f) => ({ id: f.id, label: f.label, preview: <NamePreview id={f.id} /> }))
  const textOpts: PickerOption[] = TEXT_EFFECTS.map((f) => ({ id: f.id, label: f.label, preview: <span className={f.id ? `fx-${f.id}` : ''}>Aa</span> }))
  const layoutOpts: PickerOption[] = LAYOUTS.map((f) => ({ id: f.id, label: f.label, preview: <LayoutPreview id={f.id} /> }))

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
        {uploadRow('Wallpaper / Video', p.background?.url ?? '', 'bg', 'image/*,video/*', (u) => setBg({ url: u, type: /\\.(mp4|webm)$/i.test(u) ? 'video' : 'image' }))}
        {uploadRow('Audio', p.music_url ?? '', 'music', 'audio/*', (u) => update({ music_url: u }))}
        {uploadRow('Cursor', p.cursor_url ?? '', 'cursor', 'image/*', (u) => update({ cursor_url: u }))}
      </Card>

      <Card title="Information">
        <div><Label>Display Name</Label><input className={inputCls} value={p.display_name ?? ''} onChange={(e) => update({ display_name: e.target.value })} placeholder="Tên hiển thị" /></div>
        <div><Label>Location</Label><input className={inputCls} value={theme.location ?? ''} onChange={(e) => setTheme({ location: e.target.value })} placeholder="Vietnam" /></div>
        <div><Label>Phone</Label><input className={inputCls} value={p.phone ?? ''} onChange={(e) => update({ phone: e.target.value })} placeholder="+84 123 456..." /></div>
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
        {settingRow('Font', labelOf(FONTS, fontId), <FontPreview id={fontId} />, () => setPicker('font'))}
        {settingRow('Background Effect', labelOf(BG_EFFECTS, bgId), <BgPreview id={bgId} />, () => setPicker('bg'))}
        {settingRow('Name Effect', labelOf(NAME_EFFECTS, nameId), <NamePreview id={nameId} />, () => setPicker('name'))}
        {settingRow('Text Effect', labelOf(TEXT_EFFECTS, textId), <span className={textId ? `fx-${textId}` : ''}>Aa</span>, () => setPicker('text'))}
        {settingRow('Card Layout', labelOf(LAYOUTS, layoutId), <LayoutPreview id={layoutId} />, () => setPicker('layout'))}
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

      {picker === 'font' && <PickerModal title="Chọn Font" options={fontOpts} value={fontId} onSelect={(id) => setTheme({ font: id })} onClose={() => setPicker(null)} />}
      {picker === 'bg' && <PickerModal title="Hiệu ứng nền" options={bgOpts} value={bgId} onSelect={(id) => setTheme({ backgroundEffect: id, effects: id ? [id] : [] })} onClose={() => setPicker(null)} />}
      {picker === 'name' && <PickerModal title="Hiệu ứng tên" options={nameOpts} value={nameId} onSelect={(id) => setTheme({ nameEffect: id })} onClose={() => setPicker(null)} />}
      {picker === 'text' && <PickerModal title="Hiệu ứng chữ" options={textOpts} value={textId} onSelect={(id) => setTheme({ textEffect: id })} onClose={() => setPicker(null)} />}
      {picker === 'layout' && <PickerModal title="Bố cục thẻ" options={layoutOpts} value={layoutId} onSelect={(id) => setTheme({ layout: id })} onClose={() => setPicker(null)} cols={3} />}
    </div>
  )
}
