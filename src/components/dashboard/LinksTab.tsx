import { useState } from 'react'
import { useEditor } from '../../context/EditorContext'
import AddSocialModal from '../AddSocialModal'
import { ProfileLink } from '../../types'
import { inputCls } from '../ui/Field'

export default function LinksTab() {
  const { p, update } = useEditor()
  const links = p.links ?? []
  const [modal, setModal] = useState(false)

  const setLinks = (l: ProfileLink[]) => update({ links: l })
  const updateLink = (i: number, patch: Partial<ProfileLink>) => { const l = [...links]; l[i] = { ...l[i], ...patch }; setLinks(l) }
  const remove = (i: number) => { const l = [...links]; l.splice(i, 1); setLinks(l) }
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= links.length) return; const l = [...links]; const t = l[i]; l[i] = l[j]; l[j] = t; setLinks(l) }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      <div className="flex gap-2">
        <button onClick={() => setLinks([...links, { label: '', url: '', mode: 'link' }])} className="flex-1 py-2.5 border border-white/15 hover:border-white/40 rounded-md text-sm transition">+ Add Link</button>
        <button onClick={() => setModal(true)} className="flex-1 py-2.5 bg-white text-black rounded-md text-sm font-medium hover:bg-zinc-200 transition">+ Add Social</button>
      </div>
      {links.map((link, i) => (
        <div key={i} className="flex gap-2 items-center border border-white/10 rounded-md p-2">
          <div className="flex flex-col">
            <button onClick={() => move(i, -1)} className="text-zinc-500 hover:text-white text-xs leading-none">▲</button>
            <button onClick={() => move(i, 1)} className="text-zinc-500 hover:text-white text-xs leading-none">▼</button>
          </div>
          <input className={inputCls + ' w-14 text-center'} value={link.icon ?? ''} onChange={(e) => updateLink(i, { icon: e.target.value })} placeholder="🔗" />
          <input className={inputCls} value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Nhãn" />
          <input className={inputCls} value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://..." />
          <button onClick={() => updateLink(i, { mode: link.mode === 'text' ? 'link' : 'text' })} className="text-[10px] uppercase border border-white/15 rounded px-2 py-1 text-zinc-400 whitespace-nowrap">{link.mode === 'text' ? 'text' : 'link'}</button>
          <button onClick={() => remove(i)} className="px-3 py-2 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition">×</button>
        </div>
      ))}
      {links.length === 0 && <p className="text-sm text-zinc-600 text-center py-6">Chưa có link nào.</p>}
      {modal && <AddSocialModal onClose={() => setModal(false)} onAdd={(l) => setLinks([...links, l])} />}
    </div>
  )
}
