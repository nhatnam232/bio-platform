import { useEffect, useRef } from 'react'

type Props = {
  effects?: string[]
  accent?: string
  cursorUrl?: string | null
}

export default function Effects({ effects = [], accent = '#a855f7', cursorUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Custom cursor
  useEffect(() => {
    if (!cursorUrl) return
    document.body.style.cursor = 'url(' + cursorUrl + '), auto'
    return () => {
      document.body.style.cursor = ''
    }
  }, [cursorUrl])

  // Canvas: tuyết rơi / particles
  useEffect(() => {
    const hasSnow = effects.includes('snow')
    const hasParticles = effects.includes('particles')
    if (!hasSnow && !hasParticles) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const count = 70
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      sx: (Math.random() - 0.5) * 0.6,
      sy: Math.random() * 1 + 0.4,
    }))

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = hasSnow ? 'rgba(255,255,255,0.85)' : accent
        ctx.globalAlpha = hasSnow ? 0.85 : 0.5
        ctx.fill()
        p.x += p.sx
        p.y += hasSnow ? p.sy : -p.sy
        if (p.y > h + 5) {
          p.y = -5
          p.x = Math.random() * w
        }
        if (p.y < -5) p.y = h + 5
        if (p.x > w) p.x = 0
        if (p.x < 0) p.x = w
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [effects, accent])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[5]" />
}
