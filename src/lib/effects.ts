export type Option = { id: string; label: string }

export const BG_EFFECTS: Option[] = [
  { id: '', label: 'Không' },
  { id: 'particles', label: 'Particles' },
  { id: 'snow', label: 'Tuyết' },
  { id: 'rain', label: 'Mưa' },
  { id: 'stars', label: 'Sao' },
  { id: 'fireflies', label: 'Đom đóm' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'bubbles', label: 'Bong bóng' },
  { id: 'hearts', label: 'Tim bay' },
]

export const NAME_EFFECTS: Option[] = [
  { id: '', label: 'Không' },
  { id: 'glow', label: 'Glow' },
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'typing', label: 'Typing' },
  { id: 'shake', label: 'Shake' },
  { id: 'neon', label: 'Neon' },
  { id: 'glitch', label: 'Glitch' },
]

export const FONTS: Option[] = [
  { id: "'Poppins', sans-serif", label: 'Poppins' },
  { id: 'Georgia, serif', label: 'Serif' },
  { id: 'system-ui, sans-serif', label: 'System' },
]
