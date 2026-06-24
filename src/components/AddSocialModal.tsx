import { useState } from 'react'
import { SOCIALS, SocialDef } from '../lib/social'
import { LinkMode } from '../types'
import SocialIcon from './SocialIcon'

export default function AddSocialModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (link: { label: string; url: string; platform: string; mode: LinkMode }) => void
}) {
  const [sel, setSel] = useState<SocialDef>(SOCIALS[0])
  const [mode, setMode] = useState<LinkMode>('link')
  const [source, setSource] = useState('')
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  const submit = () => {
    const val = source.trim()
    const url = mode === 'link' ? (sel.base && !/^https?:|^mailto:/i.test(val) ? sel.base + val : val) : val
    onAdd({ label: sel.label, url, platform: sel.id, mode })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm fade-in p-4" onClick={onClose}>
      <div onClick={stop} className="relative w-full max-w-sm border border-white/15 bg-zinc-950 rounded-lg p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Add Social</h3>
          <button onClick={onClose} className="text-sm text-zinc-500 hover:text-white">Close</button>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Link Type</div>
          <div className="grid grid-cols-7 gap-2">
            {SOCIALS.map((s) => {
              const active = sel.id === s.id ? 'border-white bg-white/15 text-white' : 'border-white/10 hover:border-white/30 text-zinc-400'
              return (
                <button key={s.id} title={s.label} onClick={() => setSel(s)} className={'aspect-square flex items-center justify-center rounded-md border transition ' + active}><SocialIcon id={s.id} size={18} /></button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Social Mode</div>
          <div className="flex border border-white/10 rounded-md overflow-hidden">
            <button onClick={() => setMode('text')} className={'flex-1 py-2 text-sm font-medium transition ' + (mode === 'text' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white')}>Text</button>
            <button onClick={() => setMode('link')} className={'flex-1 py-2 text-sm font-medium transition ' + (mode === 'link' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white')}>Link</button>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Source</div>
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder={sel.base || 'nội dung'} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm focus:border-white/30 focus:outline-none placeholder:text-zinc-600" />
        </div>

        <button onClick={submit} className="w-full py-2.5 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 transition">Submit</button>
      </div>
    </div>
  )
}
