import { useEditor } from '../../context/EditorContext'
import { Theme } from '../../types'
import { Card, Label, inputCls } from '../ui/Field'
import Avatar from '../Avatar'
import { DECORATIONS } from '../../lib/decorations'

export default function DecorationTab() {
  const { p, setTheme, upload, uploading } = useEditor()
  const theme: Theme = p.theme ?? {}
  const deco = theme.avatarDecoration ?? {}
  const setDeco = (patch: Record<string, unknown>) => setTheme({ avatarDecoration: { ...deco, ...patch } })
  const upBtn = 'px-3 py-2 border border-white/15 hover:border-white/40 rounded-md text-xs cursor-pointer whitespace-nowrap transition'

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Avatar Decoration">
        <div className="flex justify-center py-4">
          <Avatar src={p.avatar_url} decorationUrl={deco.url} hue={deco.hue ?? 0} accent={theme.accent || '#ffffff'} size={120} />
        </div>
        <div>
          <Label>Decoration URL (PNG trong suốt)</Label>
          <div className="flex gap-2 items-center">
            <input className={inputCls} value={deco.url ?? ''} onChange={(e) => setDeco({ url: e.target.value })} placeholder="https://.../frame.png" />
            <label className={upBtn}>{uploading === 'deco' ? '...' : 'Tải lên'}<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0], 'deco', (u) => setDeco({ url: u }))} /></label>
          </div>
        </div>
        <div>
          <Label>Hue Rotation ({deco.hue ?? 0}°)</Label>
          <input type="range" min={0} max={360} value={deco.hue ?? 0} onChange={(e) => setDeco({ hue: Number(e.target.value) })} className="w-full" />
        </div>
        <button onClick={() => setTheme({ avatarDecoration: {} })} className="text-xs text-red-400 hover:text-red-300 self-start">Tắt Avatar Decoration</button>
      </Card>
      <Card title="Khung động — kho Discord">
        <p className="text-xs text-zinc-500">Khung động (APNG) lấy trực tiếp từ kho Discord. Bấm để áp dụng ngay.</p>
        <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {DECORATIONS.map((d) => {
            const active = deco.url === d.url
            return (
              <button key={d.id} onClick={() => setDeco({ url: d.url })} title={d.label} className={'relative aspect-square rounded-lg border p-1 transition ' + (active ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30')}>
                <img src={d.url} loading="lazy" alt={d.label} className="w-full h-full object-contain" />
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
