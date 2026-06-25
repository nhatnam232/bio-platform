import { useEditor } from '../../context/EditorContext'
import { Widget, WidgetType } from '../../types'

export default function WidgetsTab() {
  const { p, update } = useEditor()
  const widgets = p.widgets ?? []
  
  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title: 'New ' + type,
      content: '',
      url: '',
    }
    update({ widgets: [...widgets, newWidget] })
  }

  const updateWidget = (id: string, patch: Partial<Widget>) => {
    update({ widgets: widgets.map(w => w.id === id ? { ...w, ...patch } : w) })
  }

  const removeWidget = (id: string) => {
    update({ widgets: widgets.filter(w => w.id !== id) })
  }

  const moveWidget = (index: number, dir: 1 | -1) => {
    if (index + dir < 0 || index + dir >= widgets.length) return
    const newWidgets = [...widgets]
    const temp = newWidgets[index]
    newWidgets[index] = newWidgets[index + dir]
    newWidgets[index + dir] = temp
    update({ widgets: newWidgets })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1.5 text-white">Widgets</h2>
        <p className="text-sm text-zinc-400">Thêm card hiển thị ảnh, video, bản đồ, ...</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['text', 'image', 'link', 'youtube', 'spotify', 'discord', 'map', 'countdown'].map(type => (
          <button key={type} onClick={() => addWidget(type as WidgetType)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium capitalize">
            + {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {widgets.map((w, i) => (
          <div key={w.id} className="border border-white/10 bg-white/[0.02] p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase text-zinc-400">{w.type} widget</span>
              <div className="flex gap-2">
                <button onClick={() => moveWidget(i, -1)} disabled={i === 0} className="text-zinc-500 hover:text-white disabled:opacity-30">↑</button>
                <button onClick={() => moveWidget(i, 1)} disabled={i === widgets.length - 1} className="text-zinc-500 hover:text-white disabled:opacity-30">↓</button>
                <button onClick={() => removeWidget(w.id)} className="text-red-500 hover:text-red-400 ml-2">Xoá</button>
              </div>
            </div>
            
            <input 
              value={w.title ?? ''} 
              onChange={e => updateWidget(w.id, { title: e.target.value })}
              placeholder="Tiêu đề widget" 
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-white outline-none"
            />
            
            {['image', 'link', 'youtube', 'spotify', 'map'].includes(w.type) && (
              <input 
                value={w.url ?? ''} 
                onChange={e => updateWidget(w.id, { url: e.target.value })}
                placeholder="URL / Link" 
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-white outline-none"
              />
            )}
            
            {['text'].includes(w.type) && (
              <textarea 
                value={w.content ?? ''} 
                onChange={e => updateWidget(w.id, { content: e.target.value })}
                placeholder="Nội dung" 
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-white outline-none"
                rows={3}
              />
            )}
          </div>
        ))}
        {widgets.length === 0 && <div className="text-center py-8 text-sm text-zinc-500">Chưa có widget nào.</div>}
      </div>
    </div>
  )
}
