'use client'
import { useEffect, useRef } from 'react'

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = w * DPR
    canvas.height = h * DPR
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(DPR, DPR)

    const particles: { x:number; y:number; vx:number; vy:number; r:number }[] = []
    const COUNT = Math.min(180, Math.floor((w * h) / 18000))
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
      })
    }

    const mouse = { x: w / 2, y: h / 2 }
    const parallax = { x: 0, y: 0 }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      const cx = w / 2
      const cy = h / 2
      parallax.x = (mouse.x - cx) / cx
      parallax.y = (mouse.y - cy) / cy
    }

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * DPR
      canvas.height = h * DPR
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)

    function loop() {
      ctx.clearRect(0, 0, w, h)

      // transparent grid (no solid fill)
      ctx.save()
      ctx.translate(parallax.x * 8, parallax.y * 8)
      drawGrid(ctx, w, h)
      ctx.restore()

      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220)
      grad.addColorStop(0, 'rgba(0,229,255,0.18)')
      grad.addColorStop(1, 'rgba(0,229,255,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2)
      ctx.fill()

      for (const p of particles) {
        p.x += p.vx + parallax.x * 0.15
        p.y += p.vy + parallax.y * 0.15
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        for (const q of particles) {
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < 130 * 130) {
            const a = 1 - d2 / (130 * 130)
            ctx.strokeStyle = `rgba(125,249,255,${a * 0.22})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        ctx.fillStyle = 'rgba(125,249,255,0.9)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
      ctx.strokeStyle = 'rgba(125,249,255,0.12)'
      ctx.lineWidth = 1
      const horizon = h * 0.35
      const spacing = 38

      for (let y = horizon; y < h; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      const vpX = w / 2
      const vpY = horizon - 220
      for (let x = -w; x <= w * 2; x += spacing) {
        ctx.beginPath(); ctx.moveTo(vpX, vpY); ctx.lineTo(x, h); ctx.stroke()
      }

      const g = ctx.createRadialGradient(vpX, horizon, 0, vpX, horizon, 420)
      g.addColorStop(0, 'rgba(0,229,255,0.10)')
      g.addColorStop(1, 'rgba(0,229,255,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(vpX, horizon, 420, 0, Math.PI * 2); ctx.fill()
    }

    loop()
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 block"
      aria-hidden
    />
  )
}
