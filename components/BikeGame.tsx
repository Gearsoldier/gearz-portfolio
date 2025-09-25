'use client'

import { useEffect, useRef } from 'react'

type Props = { height?: number }

/** Don’t capture keys while typing in inputs/areas/contentEditable */
function isTypingTarget(el: EventTarget | null) {
  if (!el || !(el as any).tagName) return false
  const node = el as HTMLElement
  const tag = node.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    node.isContentEditable ||
    !!node.closest?.('input, textarea, [contenteditable="true"]')
  )
}

export default function BikeGame({ height = 520 }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!

    let W = canvas.parentElement ? canvas.parentElement.clientWidth : 900
    let H = height
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      W = canvas.parentElement ? canvas.parentElement.clientWidth : W
      H = height
      canvas.width = Math.floor(W * DPR)
      canvas.height = Math.floor(H * DPR)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // ---------- GAME STATE (use seconds for timing, px/s for speeds) ----------
    const keys = { left: false, right: false, up: false, down: false, boost: false }
    const userActive = () => window.dispatchEvent(new CustomEvent('abe-user-active'))

    const player = {
      x: W * 0.25,
      y: H * 0.5,
      r: 16,
      vx: 0, // px/s
      vy: 0, // px/s
      maxSpeed: 300, // px/s
      maxSpeedBoost: 480, // px/s
      accel: 650, // px/s^2
      frictionPerSec: 0.18, // velocity decay per second
      boosting: false,
      boost: 0.45, // 0..1
      boostRegenPerSec: 0.10,
      boostDrainPerSec: 0.28,
      shield: 0, // seconds remaining
      shieldCD: 0, // seconds remaining
    }

    type Drone = { x: number; y: number; r: number; vx: number; vy: number; alive: boolean }
    const drones: Drone[] = []
    let spawnTimer = 0 // seconds to next spawn
    let score = 0
    let best = 0
    let lastScoreEmit = 0 // ms

    // Sidekick adversary mode
    let adversary = false
    let adversaryUntil = 0 // ms timestamp

    function setAdversary(on: boolean, durMs = 30000) {
      adversary = on
      adversaryUntil = on ? performance.now() + durMs : 0
      window.dispatchEvent(new CustomEvent('abe-adversary', { detail: { on } }))
    }
    const onAdv = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setAdversary(!!detail?.on)
    }
    window.addEventListener('abe-adversary', onAdv as any)

    // ---------- INPUT ----------
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keys.left = true
          e.preventDefault()
          userActive()
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.right = true
          e.preventDefault()
          userActive()
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          keys.up = true
          e.preventDefault()
          userActive()
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.down = true
          e.preventDefault()
          userActive()
          break
        case ' ':
          keys.boost = true
          e.preventDefault()
          userActive()
          break
        case 'b':
        case 'B':
          // Shield 1.5s, 6s cooldown
          if (player.shield <= 0 && player.shieldCD <= 0) {
            player.shield = 1.5
            player.shieldCD = 6
          }
          userActive()
          break
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keys.left = false
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.right = false
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          keys.up = false
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.down = false
          break
        case ' ':
          keys.boost = false
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // ---------- HELPERS ----------
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const dist2 = (ax: number, ay: number, bx: number, by: number) => {
      const dx = ax - bx,
        dy = ay - by
      return dx * dx + dy * dy
    }

    function spawnDrone() {
      const side = Math.random() < 0.5 ? 'right' : 'bottom'
      const r = rand(10, 18)
      let x = W + r + rand(0, 120)
      let y = rand(30, H - 30)
      if (side === 'bottom') {
        x = rand(W * 0.45, W + 100)
        y = H + r + rand(0, 80)
      }
      const vx = -rand(120, 220) // px/s
      const vy = side === 'bottom' ? -rand(40, 110) : rand(-70, 70)
      drones.push({ x, y, r, vx, vy, alive: true })
    }

    function reset() {
      player.x = W * 0.25
      player.y = H * 0.5
      player.vx = 0
      player.vy = 0
      player.boost = 0.45
      player.boosting = false
      player.shield = 0
      player.shieldCD = 0
      drones.splice(0, drones.length)
      spawnTimer = 0.4
      score = 0
    }
    reset()

    // ---------- UPDATE/DRAW ----------
    function update(dtMs: number) {
      const dt = dtMs / 1000 // seconds
      if (adversary && performance.now() > adversaryUntil) setAdversary(false)

      // Input → accel
      const a = player.accel * (player.boosting ? 1.4 : 1)
      if (keys.left) player.vx -= a * dt
      if (keys.right) player.vx += a * dt
      if (keys.up) player.vy -= a * dt
      if (keys.down) player.vy += a * dt

      // Boost bar
      player.boosting = keys.boost && player.boost > 0.05
      if (player.boosting) {
        player.boost = clamp(player.boost - player.boostDrainPerSec * dt, 0, 1)
      } else {
        player.boost = clamp(player.boost + player.boostRegenPerSec * dt, 0, 1)
      }

      // Friction & speed cap
      const drag = Math.pow(1 - player.frictionPerSec, dt) // per-second decay
      player.vx *= drag
      player.vy *= drag

      const max = player.boosting ? player.maxSpeedBoost : player.maxSpeed
      const sp = Math.hypot(player.vx, player.vy)
      if (sp > max) {
        player.vx = (player.vx / sp) * max
        player.vy = (player.vy / sp) * max
      }

      // Move
      player.x = clamp(player.x + player.vx * dt, 16, W - 16)
      player.y = clamp(player.y + player.vy * dt, 16, H - 16)

      // Timers
      if (player.shield > 0) player.shield = Math.max(0, player.shield - dt)
      if (player.shieldCD > 0) player.shieldCD = Math.max(0, player.shieldCD - dt)

      // Spawns
      spawnTimer -= dt
      const base = adversary ? 0.45 : 0.7
      if (spawnTimer <= 0) {
        spawnDrone()
        spawnTimer = base + rand(-0.15, 0.15)
      }

      // Drones
      for (const d of drones) {
        if (!d.alive) continue
        if (adversary) {
          const dx = player.x - d.x,
            dy = player.y - d.y
          const n = Math.hypot(dx, dy) || 1
          // steer toward player
          const chase = 60 // px/s^2
          d.vx += (dx / n) * chase * dt
          d.vy += (dy / n) * chase * dt
          // cap speed
          const s = Math.hypot(d.vx, d.vy)
          const sMax = 260
          if (s > sMax) {
            d.vx = (d.vx / s) * sMax
            d.vy = (d.vy / s) * sMax
          }
        }
        d.x += d.vx * dt
        d.y += d.vy * dt
        if (d.x < -60 || d.y < -60 || d.y > H + 60) d.alive = false
      }

      // Collisions
      for (const d of drones) {
        if (!d.alive) continue
        const rr = player.r + d.r - (player.boosting ? 4 : 0)
        if (dist2(player.x, player.y, d.x, d.y) <= rr * rr) {
          if (player.shield > 0) {
            d.alive = false
            score += 25
          } else {
            best = Math.max(best, Math.floor(score))
            reset()
            break
          }
        }
      }

      // Score progression
      score += (player.boosting ? 16 : 10) * dt

      // Emit score at most every ~200ms
      const now = performance.now()
      if (now - lastScoreEmit > 200) {
        lastScoreEmit = now
        window.dispatchEvent(new CustomEvent('abe-score', { detail: { score: Math.floor(score) } }))
      }
    }

    function drawGrid() {
      ctx.fillStyle = '#0a0d12'
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(125,249,255,0.12)'
      ctx.lineWidth = 1
      const horizon = H * 0.35
      const spacing = 38

      for (let y = horizon; y < H; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      const vpX = W / 2
      const vpY = horizon - 220
      for (let x = -W; x <= W * 2; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(vpX, vpY)
        ctx.lineTo(x, H)
        ctx.stroke()
      }

      const g = ctx.createRadialGradient(vpX, horizon, 0, vpX, horizon, 420)
      g.addColorStop(0, 'rgba(0,229,255,0.10)')
      g.addColorStop(1, 'rgba(0,229,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(vpX, horizon, 420, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawBike() {
      const angle = Math.atan2(player.vy, player.vx)
      ctx.save()
      ctx.translate(player.x, player.y)
      ctx.rotate(angle)

      // body
      ctx.fillStyle = player.boosting ? '#ff6a00' : '#7df9ff'
      ctx.shadowColor = ctx.fillStyle
      ctx.shadowBlur = player.boosting ? 24 : 12
      ctx.beginPath()
      ctx.moveTo(18, 0)
      ctx.lineTo(-12, -8)
      ctx.lineTo(-6, 0)
      ctx.lineTo(-12, 8)
      ctx.closePath()
      ctx.fill()

      // trail
      const grad = ctx.createLinearGradient(-46, 0, 18, 0)
      grad.addColorStop(0, 'rgba(0,229,255,0.0)')
      grad.addColorStop(1, 'rgba(0,229,255,0.35)')
      ctx.fillStyle = grad
      ctx.fillRect(-46, -2, 64, 4)

      // shield
      if (player.shield > 0) {
        ctx.strokeStyle = 'rgba(125,249,255,0.85)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(0, 0, player.r + 6, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
      ctx.shadowBlur = 0
    }

    function drawDrones() {
      ctx.lineWidth = 2
      for (const d of drones) {
        if (!d.alive) continue
        ctx.save()
        ctx.translate(d.x, d.y)
        ctx.strokeStyle = adversary ? 'rgba(255,106,0,0.9)' : 'rgba(125,249,255,0.9)'
        ctx.fillStyle = adversary ? 'rgba(255,106,0,0.25)' : 'rgba(125,249,255,0.25)'
        ctx.beginPath()
        ctx.arc(0, 0, d.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }
    }

    function drawHUD() {
      ctx.fillStyle = 'white'
      ctx.font = '600 14px ui-monospace, Menlo, Consolas, monospace'
      ctx.fillText(`Score ${Math.floor(score)}`, 14, 20)
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fillText(`Best  ${best}`, 14, 38)

      // boost bar
      const x = 14,
        y = H - 20,
        w = 160,
        h = 8
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(x, y, w, h)
      ctx.fillStyle = '#00e5ff'
      ctx.fillRect(x, y, w * player.boost, h)
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.strokeRect(x, y, w, h)

      // shield hint/CD
      ctx.fillStyle = player.shield > 0 ? '#7df9ff' : 'rgba(255,255,255,0.65)'
      ctx.fillText(
        player.shield > 0
          ? 'Shield ACTIVE'
          : player.shieldCD > 0
          ? `Shield CD: ${player.shieldCD.toFixed(1)}s`
          : 'Press B: Shield 1.5s',
        x,
        y - 12
      )

      if (adversary) {
        ctx.fillStyle = '#ff6a00'
        ctx.fillText('Adversary: ON', W - 140, 20)
      }
    }

    let last = performance.now()
    function loop(now: number) {
      const dtMs = Math.min(64, now - last) // clamp big deltas
      last = now

      update(dtMs)
      drawGrid()
      drawDrones()
      drawBike()
      drawHUD()

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('abe-adversary', onAdv as any)
    }
  }, [height])

  return <canvas ref={ref} className="block w-full rounded-xl bg-black/40" />
}
