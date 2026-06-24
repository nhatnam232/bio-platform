// Nền đồng bộ: lưới mờ + 2 quầng sáng theo màu nhấn + phủ tối nhẹ.
export default function BackgroundFX({
  accent = '#ffffff',
  accent2,
  variant = 'grid',
}: {
  accent?: string
  accent2?: string
  variant?: 'grid' | 'dots'
}) {
  const a2 = accent2 || accent
  const glow1 = { width: 520, height: 520, background: accent, opacity: 0.22, top: -150, left: -120 }
  const glow2 = { width: 460, height: 460, background: a2, opacity: 0.18, bottom: -170, right: -120, top: 'auto', animationDelay: '3s' }
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className={'absolute inset-0 grid-bg-fade opacity-70 ' + (variant === 'dots' ? 'dots-bg' : 'grid-bg')} />
      <div className="glow" style={glow1} />
      <div className="glow" style={glow2} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
    </div>
  )
}
