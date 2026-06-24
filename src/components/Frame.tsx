import { ReactNode } from 'react'

// Khung viền có ngoặc 4 góc — phong cách Vercel/terminal.
export default function Frame({
  children,
  className = '',
  accent = '#ffffff',
}: {
  children: ReactNode
  className?: string
  accent?: string
}) {
  const base = 'pointer-events-none absolute w-3 h-3 z-10'
  return (
    <div className={'relative border border-white/10 bg-white/[0.02] ' + className}>
      <span className={base + ' -top-px -left-px border-t border-l'} style= borderColor: accent  />
      <span className={base + ' -top-px -right-px border-t border-r'} style= borderColor: accent  />
      <span className={base + ' -bottom-px -left-px border-b border-l'} style= borderColor: accent  />
      <span className={base + ' -bottom-px -right-px border-b border-r'} style= borderColor: accent  />
      {children}
    </div>
  )
}
