import { useEditor } from '../../context/EditorContext'
import { Theme } from '../../types'
import { Card, Label } from '../ui/Field'

export default function ColorTab() {
  const { p, setTheme, setColors } = useEditor()
  const theme: Theme = p.theme ?? {}
  const colors = theme.colors ?? {}

  const swatch = (label: string, key: string, def: string) => {
    const val = (colors as Record<string, string | undefined>)[key] || def
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-300">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{val}</span>
          <input type="color" value={val} onChange={(e) => setColors({ [key]: e.target.value })} className="w-8 h-8 bg-transparent cursor-pointer rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Màu sắc">
        {swatch('Description', 'description', '#d4d4d8')}
        {swatch('Display Name', 'displayName', '#ffffff')}
        {swatch('Card', 'card', '#000000')}
        {swatch('Icon', 'icon', '#ffffff')}
        {swatch('Audio Control', 'audioControl', '#ffffff')}
        {swatch('Background', 'background', '#000000')}
        {swatch('Background Effect', 'backgroundEffect', '#ffffff')}
      </Card>
      <Card title="Accent & Card">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Màu chính</span>
          <input type="color" value={theme.accent || '#ffffff'} onChange={(e) => setTheme({ accent: e.target.value })} className="w-8 h-8 bg-transparent cursor-pointer rounded" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Màu phụ</span>
          <input type="color" value={theme.accent2 || '#666666'} onChange={(e) => setTheme({ accent2: e.target.value })} className="w-8 h-8 bg-transparent cursor-pointer rounded" />
        </div>
        <div>
          <Label>Card Opacity ({Math.round((theme.cardOpacity ?? 0.4) * 100)}%)</Label>
          <input type="range" min={0} max={1} step={0.05} value={theme.cardOpacity ?? 0.4} onChange={(e) => setTheme({ cardOpacity: Number(e.target.value) })} className="w-full" />
        </div>
        <div>
          <Label>Card Blur ({theme.cardBlur ?? 0}px)</Label>
          <input type="range" min={0} max={30} value={theme.cardBlur ?? 0} onChange={(e) => setTheme({ cardBlur: Number(e.target.value) })} className="w-full" />
        </div>
      </Card>
    </div>
  )
}
