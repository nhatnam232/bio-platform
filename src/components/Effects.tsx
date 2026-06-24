import { useEffect, useRef } from 'react'

type Props = { effects?: string[]; accent?: string; cursorUrl?: string | null }

type Particle = { x: number; y: number; r: number; sx: number; sy: number; phase: number; speed: number; ch?: string }

const MATRIX_CHARS = 'アイウエオカキクサシスA0123456789</>'.split('')
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

export default function Effects({ effects = [], accent = '#ffffff', cursorUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!cursorUrl) return
    document.body.style.cursor = 'url(' + cursorUrl + '), auto'
    return () => { document.body.style.cursor = '' }
  }, [cursorUrl])

  useEffect(() => {
    const set = new Set(effects)
    const enabled = ['snow', 'rain', 'particles', 'stars', 'fireflies', 'matrix', 'bubbles', 'hearts'].filter((e) => set.has(e))
    const canvas = canvasRef.current
    if (!canvas || enabled.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const make = (n: number, fn: () => Particle) => Array.from({ length: n }, fn)
    const layers: Record<string, Particle[]> = {}

    if (set.has('snow')) layers.snow = make(90, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(1, 4), sx: rnd(-0.4, 0.4), sy: rnd(0.4, 1.3), phase: 0, speed: 0 }))
    if (set.has('rain')) layers.rain = make(140, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(8, 18), sx: 0, sy: rnd(8, 14), phase: 0, speed: 0 }))
    if (set.has('particles')) layers.particles = make(70, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(1, 3), sx: rnd(-0.3, 0.3), sy: rnd(0.2, 0.9), phase: 0, speed: 0 }))
    if (set.has('stars')) layers.stars = make(110, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.5, 1.8), sx: 0, sy: 0, phase: rnd(0, 6.28), speed: rnd(0.01, 0.05) }))
    if (set.has('fireflies')) layers.fireflies = make(45, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(1, 2.6), sx: rnd(-0.4, 0.4), sy: rnd(-0.4, 0.4), phase: rnd(0, 6.28), speed: rnd(0.02, 0.06) }))
    if (set.has('bubbles')) layers.bubbles = make(40, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(4, 16), sx: rnd(-0.3, 0.3), sy: rnd(0.4, 1.2), phase: rnd(0, 6.28), speed: rnd(0.01, 0.04) }))
    if (set.has('hearts')) layers.hearts = make(28, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(10, 22), sx: rnd(-0.3, 0.3), sy: rnd(0.5, 1.3), phase: rnd(0, 6.28), speed: rnd(0.01, 0.04) }))
    if (set.has('matrix')) {
      const cols = Math.max(20, Math.floor(w / 16))
      layers.matrix = make(cols, () => ({ x: 0, y: rnd(-h, 0), r: 14, sx: 0, sy: rnd(4, 9), phase: 0, speed: 0, ch: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] }))
      layers.matrix.forEach((pt, i) => { pt.x = i * 16 })
    }

    let t = 0
    let raf = 0
    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)

      if (layers.snow) for (const pt of layers.snow) {
        ctx.globalAlpha = 0.85; ctx.fillStyle = '#ffffff'
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill()
        pt.x += pt.sx + Math.sin((t + pt.y) * 0.01) * 0.3; pt.y += pt.sy
        if (pt.y > h + 5) { pt.y = -5; pt.x = rnd(0, w) }
        if (pt.x > w) pt.x = 0; if (pt.x < 0) pt.x = w
      }

      if (layers.particles) for (const pt of layers.particles) {
        ctx.globalAlpha = 0.5; ctx.fillStyle = accent
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill()
        pt.x += pt.sx; pt.y -= pt.sy
        if (pt.y < -5) { pt.y = h + 5; pt.x = rnd(0, w) }
        if (pt.x > w) pt.x = 0; if (pt.x < 0) pt.x = w
      }

      if (layers.rain) {
        ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.globalAlpha = 0.25
        for (const pt of layers.rain) {
          ctx.beginPath(); ctx.moveTo(pt.x, pt.y); ctx.lineTo(pt.x + 1, pt.y + pt.r); ctx.stroke()
          pt.y += pt.sy
          if (pt.y > h) { pt.y = -20; pt.x = rnd(0, w) }
        }
      }

      if (layers.stars) for (const pt of layers.stars) {
        ctx.globalAlpha = 0.25 + 0.65 * Math.abs(Math.sin(pt.phase + t * pt.speed))
        ctx.fillStyle = '#ffffff'
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill()
      }

      if (layers.fireflies) for (const pt of layers.fireflies) {
        ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(pt.phase + t * pt.speed))
        ctx.fillStyle = accent; ctx.shadowBlur = 8; ctx.shadowColor = accent
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
        pt.x += pt.sx; pt.y += pt.sy
        if (Math.random() < 0.02) { pt.sx = rnd(-0.4, 0.4); pt.sy = rnd(-0.4, 0.4) }
        if (pt.x > w) pt.x = 0; if (pt.x < 0) pt.x = w
        if (pt.y > h) pt.y = 0; if (pt.y < 0) pt.y = h
      }

      if (layers.bubbles) {
        ctx.strokeStyle = accent; ctx.lineWidth = 1.4
        for (const pt of layers.bubbles) {
          ctx.globalAlpha = 0.25 + 0.35 * Math.abs(Math.sin(pt.phase + t * pt.speed))
          ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.stroke()
          pt.x += pt.sx + Math.sin((t + pt.y) * 0.02) * 0.4; pt.y -= pt.sy
          if (pt.y < -25) { pt.y = h + 25; pt.x = rnd(0, w) }
        }
      }

      if (layers.hearts) for (const pt of layers.hearts) {
        ctx.globalAlpha = 0.4 + 0.4 * Math.abs(Math.sin(pt.phase + t * pt.speed))
        ctx.fillStyle = accent
        ctx.font = pt.r + 'px serif'
        ctx.fillText('❤', pt.x, pt.y)
        pt.x += pt.sx + Math.sin((t + pt.y) * 0.02) * 0.5; pt.y -= pt.sy
        if (pt.y < -25) { pt.y = h + 25; pt.x = rnd(0, w) }
      }

      if (layers.matrix) {
        ctx.globalAlpha = 0.85; ctx.fillStyle = accent; ctx.font = '14px JetBrains Mono, monospace'
        for (const pt of layers.matrix) {
          ctx.fillText(pt.ch || '0', pt.x, pt.y)
          pt.y += pt.sy
          if (Math.random() < 0.04) pt.ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
          if (pt.y > h) pt.y = rnd(-40, 0)
        }
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [effects.join(','), accent])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[6]" />
}
