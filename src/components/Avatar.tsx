export default function Avatar({
  src,
  alt,
  decorationUrl,
  hue = 0,
  size = 96,
  accent = '#ffffff',
}: {
  src?: string | null
  alt?: string
  decorationUrl?: string
  hue?: number
  size?: number
  accent?: string
}) {
  const wrap = { width: size, height: size }
  const imgStyle = { borderColor: accent, boxShadow: '0 0 30px ' + accent + '55' }
  const decoStyle = { filter: hue ? 'hue-rotate(' + hue + 'deg)' : undefined }
  if (!src) return null
  return (
    <div className="relative" style={wrap}>
      <img src={src} alt={alt} className="w-full h-full rounded-full object-cover border-2" style={imgStyle} />
      {decorationUrl && (
        <img src={decorationUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-[1.35]" style={decoStyle} />
      )}
    </div>
  )
}
