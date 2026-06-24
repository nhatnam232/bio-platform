import { Theme } from '../types'

export type Template = {
  id: string
  name: string
  swatch: string
  theme: Theme
}

// Mỗi template là một cấu hình theme hoàn chỉnh.
export const TEMPLATES: Template[] = [
  {
    id: 'vercel', name: 'Vercel', swatch: '#ffffff',
    theme: { accent: '#ffffff', accent2: '#666666', backgroundEffect: '', effects: [], nameEffect: '', colors: { displayName: '#ffffff', description: '#a1a1aa', card: '#0a0a0a', icon: '#ffffff', background: '#000000' }, cardOpacity: 0.5, cardBlur: 8 },
  },
  {
    id: 'terminal', name: 'Terminal', swatch: '#22c55e',
    theme: { accent: '#22c55e', accent2: '#15803d', backgroundEffect: 'matrix', effects: ['matrix'], nameEffect: 'glow', monospace: true, colors: { displayName: '#dcfce7', description: '#86efac', card: '#031206', icon: '#22c55e', background: '#000000' }, cardOpacity: 0.55, cardBlur: 4 },
  },
  {
    id: 'midnight', name: 'Midnight', swatch: '#60a5fa',
    theme: { accent: '#60a5fa', accent2: '#1d4ed8', backgroundEffect: 'stars', effects: ['stars'], nameEffect: 'glow', colors: { displayName: '#e2e8f0', description: '#94a3b8', card: '#0a0f1f', icon: '#60a5fa', background: '#020617' }, cardOpacity: 0.5, cardBlur: 10 },
  },
  {
    id: 'ice', name: 'Ice', swatch: '#67e8f9',
    theme: { accent: '#67e8f9', accent2: '#0891b2', backgroundEffect: 'snow', effects: ['snow'], nameEffect: 'gradient', colors: { displayName: '#ecfeff', description: '#a5f3fc', card: '#06141a', icon: '#67e8f9', background: '#001016' }, cardOpacity: 0.45, cardBlur: 12 },
  },
  {
    id: 'crimson', name: 'Crimson', swatch: '#f43f5e',
    theme: { accent: '#f43f5e', accent2: '#9f1239', backgroundEffect: 'fireflies', effects: ['fireflies'], nameEffect: 'glow', colors: { displayName: '#ffe4e6', description: '#fda4af', card: '#1a0610', icon: '#f43f5e', background: '#0a0205' }, cardOpacity: 0.5, cardBlur: 8 },
  },
  {
    id: 'amber', name: 'Amber', swatch: '#f59e0b',
    theme: { accent: '#f59e0b', accent2: '#b45309', backgroundEffect: 'rain', effects: ['rain'], nameEffect: 'shake', colors: { displayName: '#fef3c7', description: '#fcd34d', card: '#1a1303', icon: '#f59e0b', background: '#0a0700' }, cardOpacity: 0.5, cardBlur: 6 },
  },
  {
    id: 'sakura', name: 'Sakura', swatch: '#f9a8d4',
    theme: { accent: '#f9a8d4', accent2: '#db2777', backgroundEffect: 'snow', effects: ['snow'], nameEffect: 'gradient', colors: { displayName: '#fce7f3', description: '#f9a8d4', card: '#180611', icon: '#f9a8d4', background: '#0c0208' }, cardOpacity: 0.45, cardBlur: 10 },
  },
  {
    id: 'mono', name: 'Mono', swatch: '#a1a1aa',
    theme: { accent: '#a1a1aa', accent2: '#52525b', backgroundEffect: 'particles', effects: ['particles'], nameEffect: '', monospace: true, colors: { displayName: '#fafafa', description: '#a1a1aa', card: '#0a0a0a', icon: '#fafafa', background: '#000000' }, cardOpacity: 0.5, cardBlur: 6 },
  },
]
