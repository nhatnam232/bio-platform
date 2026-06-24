import { ReactNode } from 'react'

export function Label({ children }: { children: ReactNode }) {
  return <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-1.5">{children}</div>
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3">
      {title && <h3 className="text-sm font-semibold">{title}</h3>}
      {children}
    </div>
  )
}

export const inputCls =
  'w-full px-3 py-2 bg-white/5 border border-white/10 text-sm rounded-md focus:border-white/30 focus:outline-none placeholder:text-zinc-600 transition'
