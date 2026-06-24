import { useEditor } from '../../context/EditorContext'
import { Theme } from '../../types'
import { Card, Label, inputCls } from '../ui/Field'
import Toggle from '../ui/Toggle'

export default function CoupleTab() {
  const { p, setCouple } = useEditor()
  const theme: Theme = p.theme ?? {}
  const couple = theme.couple ?? {}
  const days = couple.startTime ? Math.max(0, Math.floor((Date.now() - new Date(couple.startTime).getTime()) / 86400000)) : 0

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Bio Couple">
        <Toggle label="Bật Bio Couple" checked={!!couple.enabled} onChange={(v) => setCouple({ enabled: v })} />
        <div><Label>Start Time</Label><input type="date" className={inputCls} value={couple.startTime ?? ''} onChange={(e) => setCouple({ startTime: e.target.value })} /></div>
        <div><Label>Partner UserName</Label><input className={inputCls} value={couple.partner ?? ''} onChange={(e) => setCouple({ partner: e.target.value })} placeholder="tên người ấy" /></div>
        <div><Label>Love Message</Label><input className={inputCls} value={couple.message ?? ''} onChange={(e) => setCouple({ message: e.target.value })} placeholder="Yêu nhau $[day] ngày" /></div>
        <div><Label>Heart Icon</Label><input className={inputCls} value={couple.heartIcon ?? ''} onChange={(e) => setCouple({ heartIcon: e.target.value })} placeholder="❤️" /></div>
        <p className="text-[11px] text-zinc-600">Dùng $[day] để hiện số ngày yêu.</p>
      </Card>
      <Card title="Preview">
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="flex items-center gap-4">
            <span className="font-medium">{p.display_name || p.username}</span>
            <span className="text-2xl">{couple.heartIcon || '❤️'}</span>
            <span className="font-medium">{couple.partner || 'Partner'}</span>
          </div>
          {couple.message && <p className="text-xs text-zinc-400">{couple.message.replace('$[day]', String(days))}</p>}
        </div>
      </Card>
    </div>
  )
}
