export type Preset = {
  id: string
  name: string
  accent: string
  accent2: string
  textColor: string
  effects: string[]
  monospace?: boolean
}

// Bảng màu trung tính / kỹ thuật — tránh tông tím "AI".
export const PRESETS: Preset[] = [
  { id: 'vercel', name: 'Vercel', accent: '#ffffff', accent2: '#666666', textColor: '#ffffff', effects: [], monospace: true },
  { id: 'terminal', name: 'Terminal', accent: '#22c55e', accent2: '#15803d', textColor: '#dcfce7', effects: ['matrix'], monospace: true },
  { id: 'mono', name: 'Mono', accent: '#a1a1aa', accent2: '#52525b', textColor: '#fafafa', effects: ['particles'], monospace: true },
  { id: 'midnight', name: 'Midnight', accent: '#60a5fa', accent2: '#1d4ed8', textColor: '#e2e8f0', effects: ['stars'] },
  { id: 'ice', name: 'Ice', accent: '#67e8f9', accent2: '#0891b2', textColor: '#ecfeff', effects: ['snow'] },
  { id: 'crimson', name: 'Crimson', accent: '#f43f5e', accent2: '#9f1239', textColor: '#ffe4e6', effects: ['fireflies'] },
  { id: 'amber', name: 'Amber', accent: '#f59e0b', accent2: '#b45309', textColor: '#fef3c7', effects: ['rain'] },
  { id: 'emerald', name: 'Emerald', accent: '#34d399', accent2: '#047857', textColor: '#d1fae5', effects: ['fireflies'] },
]
