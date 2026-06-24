import { useState } from 'react'

export default function ShareModal({ url, accent, onClose }: { url: string; accent: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }
  const qr =
    'https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=0a0a0a&color=ffffff&qzone=1&margin=0&data=' +
    encodeURIComponent(url)
  const btnStyle = { background: accent, color: '#000' }
  const stop = (e: React.MouseEvent) => e.stopPropagation()
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm fade-in p-4" onClick={onClose}>
      <div onClick={stop} className="relative w-full max-w-xs border border-white/15 bg-zinc-950 p-6 flex flex-col items-center gap-4">
        <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-mono">share profile</div>
        <img src={qr} alt="QR" width={200} height={200} className="border border-white/10" />
        <div className="w-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-zinc-300 break-all text-center">{url}</div>
        <button onClick={copy} className="w-full py-2 text-sm font-medium transition" style={btnStyle}>{copied ? '✓ Đã copy' : 'Copy link'}</button>
        <button onClick={onClose} className="text-xs text-zinc-500 hover:text-white">Đóng</button>
      </div>
    </div>
  )
}
