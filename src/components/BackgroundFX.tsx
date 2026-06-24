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
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className={'absolute inset-0 grid-bg-fade opacity-70 ' + (variant === 'dots' ? 'dots-bg' : 'grid-bg')} />
      <div className="glow" style= width: 520, height: 520, background: accent, opacity: 0.2, top: -150, left: -120  />
      <div className="glow" style= width: 460, height: 460, background: a2, opacity: 0.16, bottom: -170, right: -120, animationDelay: '3s'  />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
    </div>
  )
}
