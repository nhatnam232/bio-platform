// Chuyển màu hex (#rrggbb) sang chuỗi rgba với độ trong suốt cho trước.
export function hexToRgba(hex: string, alpha: number): string {
  const h = (hex || '#000000').replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.substring(0, 2), 16) || 0
  const g = parseInt(full.substring(2, 4), 16) || 0
  const b = parseInt(full.substring(4, 6), 16) || 0
  const a = Math.min(1, Math.max(0, alpha))
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
}
