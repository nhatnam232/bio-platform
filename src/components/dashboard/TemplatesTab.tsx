import { useEditor } from '../../context/EditorContext'
import { Theme } from '../../types'
import { TEMPLATES } from '../../lib/presets'

export default function TemplatesTab() {
  const { p, update } = useEditor()
  const theme: Theme = p.theme ?? {}
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
      {TEMPLATES.map((t) => {
        const dot = { background: t.swatch }
        const active = theme.template === t.id
        return (
          <button key={t.id} onClick={() => update({ theme: { ...(p.theme ?? {}), ...t.theme, template: t.id } })} className={'flex items-center gap-3 border rounded-lg p-4 text-left transition ' + (active ? 'border-white bg-white/5' : 'border-white/15 hover:border-white/40')}>
            <span className="w-8 h-8 rounded-md border border-white/20" style={dot} />
            <div>
              <div className="font-medium text-sm">{t.name}</div>
              <div className="text-[11px] text-zinc-500">{(t.theme.effects ?? []).join(', ') || 'no effect'}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
