import { ReactNode } from 'react'

export type PickerOption = { id: string; label: string; preview: ReactNode }

export default function PickerModal({
  title,
  options,
  value,
  onSelect,
  onClose,
  cols = 3,
}: {
  title: string
  options: PickerOption[]
  value?: string
  onSelect: (id: string) => void
  onClose: () => void
  cols?: number
}) {
  const stop = (e: React.MouseEvent) => e.stopPropagation()
  const gridStyle = { gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))' }
  return (
    <div onClick={onClose} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 fade-in">
      <div onClick={stop} className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-zinc-950 border border-white/15 rounded-2xl p-5 fab-pop">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/15 hover:border-white/40 transition text-sm">✕</button>
        </div>
        <div className="grid gap-3" style={gridStyle}>
          {options.map((o) => {
            const active = o.id === value
            const pick = () => { onSelect(o.id); onClose() }
            return (
              <button key={o.id} onClick={pick} className={'group rounded-xl border p-2 text-left transition ' + (active ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30')}>
                <div className="relative h-20 rounded-lg overflow-hidden bg-black flex items-center justify-center mb-2">{o.preview}</div>
                <div className="text-xs font-medium truncate px-0.5">{o.label}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
