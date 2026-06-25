import { useEffect, useState } from 'react'
import { useEditor } from '../../context/EditorContext'
import { useAuth } from '../../context/AuthContext'
import { Template } from '../../types'
import { listTemplates, myTemplates, publishTemplate, useTemplate, deleteTemplate } from '../../lib/templates'

export default function TemplatesTab() {
  const { user } = useAuth()
  const { p, update } = useEditor()
  const [market, setMarket] = useState<Template[]>([])
  const [mine, setMine] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'market' | 'mine'>('market')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    load()
  }, [view])

  const load = async () => {
    setLoading(true)
    try {
      if (view === 'market') setMarket(await listTemplates('popular'))
      else if (user) setMine(await myTemplates(user.id))
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const apply = async (t: Template) => {
    try {
      const res = await useTemplate(t)
      update({ theme: res.theme ?? undefined, background: res.background ?? undefined })
      alert('Đã áp dụng template!')
    } catch (e: any) { alert(e.message) }
  }

  const handlePublish = async () => {
    if (!user || !name) return
    try {
      await publishTemplate({
        ownerId: user.id,
        name,
        description: desc,
        theme: p.theme,
        background: p.background,
        isPublic: true
      })
      setName('')
      setDesc('')
      alert('Đã đăng template lên chợ!')
      if (view === 'mine') load()
    } catch (e: any) { alert(e.message) }
  }

  const handleDel = async (id: string) => {
    if (!confirm('Xoá template này?')) return
    await deleteTemplate(id)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1.5 text-white">Chợ Template</h2>
          <p className="text-sm text-zinc-400">Khám phá và chia sẻ giao diện.</p>
        </div>
        <div className="flex gap-2 bg-black/50 p-1 rounded-lg border border-white/10">
          <button onClick={() => setView('market')} className={'px-4 py-1.5 rounded-md text-sm font-medium transition ' + (view === 'market' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white')}>Chợ chung</button>
          <button onClick={() => setView('mine')} className={'px-4 py-1.5 rounded-md text-sm font-medium transition ' + (view === 'mine' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white')}>Của tôi</button>
        </div>
      </div>

      {view === 'mine' && (
        <div className="p-5 border border-dashed border-white/20 rounded-xl bg-white/[0.02]">
          <h3 className="font-semibold mb-3">Đăng giao diện hiện tại lên chợ</h3>
          <div className="flex flex-col gap-3 max-w-sm">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên template" className="bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white" />
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Mô tả ngắn" className="bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white" />
            <button onClick={handlePublish} disabled={!name} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold disabled:opacity-50">Đăng Template</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-sm text-zinc-500">Đang tải...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(view === 'market' ? market : mine).map(t => (
            <div key={t.id} className="border border-white/10 rounded-xl p-4 bg-white/[0.02] flex flex-col gap-3">
              <div className="flex-1">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-zinc-400 mt-1 line-clamp-2">{t.description || 'Không có mô tả'}</div>
                <div className="text-[10px] text-zinc-500 mt-2">Lượt tải: {t.downloads}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => apply(t)} className="flex-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition">Áp dụng</button>
                {view === 'mine' && <button onClick={() => handleDel(t.id)} className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-medium transition">Xoá</button>}
              </div>
            </div>
          ))}
          {(view === 'market' ? market : mine).length === 0 && <div className="col-span-full text-sm text-zinc-500 py-4">Chưa có template nào.</div>}
        </div>
      )}
    </div>
  )
}
