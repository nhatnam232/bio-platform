import { CSSProperties, ReactNode } from 'react'

// Khung viền có ngoặc 4 góc — phong cách Vercel/terminal.
export default function Frame({
  children,
  className = '',
  accent = '#ffffff',
  style,
}: {
  children: ReactNode
  className?: string
  accent?: string
  style?: CSSProperties
}) {
  const base = 'pointer-events-none absolute w-3 h-3 z-10'
  const c = { borderColor: accent }
  return (
    <div className={'relative border border-white/10 ' + className} style={style}>
      <span className={base + ' -top-px -left-px border-t border-l'} style={c} />
      <span className={base + ' -top-px -right-px border-t border-r'} style={c} />
      <span className={base + ' -bottom-px -left-px border-b border-l'} style={c} />
      <span className={base + ' -bottom-px -right-px border-b border-r'} style={c} />
      {children}
    </div>
  )
}
