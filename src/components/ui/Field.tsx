import { ReactNode } from 'react'

export function Label({ children }: { children: ReactNode }) {
  return <div className="text-[11px] uppercase tracking-[0.18em] text-dash-muted mb-1.5">{children}</div>
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] rounded-md p-5 flex flex-col gap-3">
      {title && <h3 className="text-sm font-semibold">{title}</h3>}
      {children}
    </div>
  )
}

// Token-driven input: surface=sunken, border=strong, focus=brand ring (skill.md)
export const inputCls =
  'w-full px-3 py-2 bg-dash-sunken border border-white/20 text-sm rounded-xl text-dash-text placeholder:text-dash-muted transition focus:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-dash-bg disabled:opacity-60'
