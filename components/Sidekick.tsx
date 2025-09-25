'use client'

import { useEffect, useRef, useState } from 'react'
import SidekickSprite from './SidekickSprite'

/**
 * Sidekick glow-up:
 * - Procedural SVG sprite with poses (idle/walk/pushups/hack)
 * - Ambient wandering in a bottom-left sandbox (never overlaps UI)
 * - Context one-liners (score milestones / idle snark)
 * - Non-blocking duel invite chip; H hides; respects “mute”
 * - Key handlers ignore INPUT/TEXTAREA/contentEditable
 */

function isTypingTarget(el: EventTarget | null) {
  if (!el || !(el as any).tagName) return false
  const n = el as HTMLElement
  return (
    n.tagName === 'INPUT' ||
    n.tagName === 'TEXTAREA' ||
    n.isContentEditable ||
    !!n.closest?.('input, textarea, [contenteditable="true"]')
  )
}

type Pose = 'idle' | 'walk' | 'pushups' | 'hack'
type Facing = 'left' | 'right'

export default function Sidekick() {
  // hydration-safe flags
  const [mounted, setMounted] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mute, setMute] = useState(false)

  // quips / UI
  const [line, setLine] = useState('Scanning the grid…')
  const [showAskChip, setShowAskChip] = useState(false)
  const [adversary, setAdversary] = useState(false)

  // pose & movement
  const [pose, setPose] = useState<Pose>('idle')
  const [facing, setFacing] = useState<Facing>('right')
  const [x, setX] = useState(36) // px from left
  const [y, setY] = useState(0)  // vertical is fixed inside sandbox; we keep y=0 and move container
  const targetRef = useRef<number>(180)
  const speedPx = 40 // wander speed
  const sandboxWidth = 280 // how far it can roam from left

  // gameplay awareness
  const scoreRef = useRef(0)
  const userActiveRef = useRef(false)
  const lastActiveRef = useRef(0)

  // invite guards
  const askedThisSession = useRef(false)
  const snoozeUntil = useRef(0)

  // timers
  const loopRef = useRef<number | null>(null)
  const behaviorUntil = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
    setHidden(localStorage.getItem('gearz_sidekick_hide') === '1')
    setMute(localStorage.getItem('gearz_sidekick_mute') === '1')
    askedThisSession.current = sessionStorage.getItem('abe_asked') === '1'
    snoozeUntil.current = Number(sessionStorage.getItem('abe_snooze_until') || '0')
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('gearz_sidekick_hide', hidden ? '1' : '0')
  }, [hidden, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('gearz_sidekick_mute', mute ? '1' : '0')
  }, [mute, mounted])

  // listen to game events
  useEffect(() => {
    const onActive = () => {
      userActiveRef.current = true
      lastActiveRef.current = Date.now()
      setTimeout(() => {
        if (Date.now() - lastActiveRef.current > 3500) userActiveRef.current = false
      }, 4000)
    }
    const onScore = (e: any) => {
      if (typeof e?.detail?.score === 'number') scoreRef.current = e.detail.score
    }
    const onAdv = (e: any) => setAdversary(!!e?.detail?.on)

    window.addEventListener('abe-user-active', onActive as any)
    window.addEventListener('abe-score', onScore as any)
    window.addEventListener('abe-adversary', onAdv as any)
    return () => {
      window.removeEventListener('abe-user-active', onActive as any)
      window.removeEventListener('abe-score', onScore as any)
      window.removeEventListener('abe-adversary', onAdv as any)
    }
  }, [])

  // keyboard shortcut: H toggles hidden (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      if (e.key.toLowerCase() === 'h') setHidden((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // behavior script
  useEffect(() => {
    if (!mounted || hidden) return

    const quips = [
      'If it glows, it ships faster.',
      'Tuning drones for “reasonable hostility”…',
      'OSINT mode: ON. Coffee: ALSO ON.',
      'Recruiter detected — deploying charisma module.',
      'I do push-ups so you don’t have to.',
      'Hacking the mainframe (it’s just a laptop).',
    ]

    const pickPose = () => {
      // 60% idle/walk, 20% pushups, 20% hack
      const r = Math.random()
      if (r < 0.4) return 'idle'
      if (r < 0.8) return 'walk'
      return Math.random() < 0.5 ? 'pushups' : 'hack'
    }

    const planNext = () => {
      const p = pickPose() as Pose
      setPose(p)
      if (p === 'walk') {
        // choose a new target inside sandbox
        const target = 24 + Math.random() * (sandboxWidth - 48)
        targetRef.current = target
        setFacing(target > x ? 'right' : 'left')
        behaviorUntil.current = performance.now() + (2000 + Math.random() * 2000)
      } else if (p === 'pushups') {
        behaviorUntil.current = performance.now() + 3600
      } else if (p === 'hack') {
        behaviorUntil.current = performance.now() + 4200
      } else {
        behaviorUntil.current = performance.now() + (1800 + Math.random() * 1800)
      }

      if (!mute) {
        setLine(quips[Math.floor(Math.random() * quips.length)])
      }
    }

    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(48, now - last) / 1000 // seconds
      last = now

      // wander
      if (pose === 'walk') {
        const target = targetRef.current
        const dir = Math.sign(target - x)
        const nx = x + dir * speedPx * dt
        const arrived = (dir > 0 && nx >= target) || (dir < 0 && nx <= target)
        setX(arrived ? target : nx)
        setFacing(dir >= 0 ? 'right' : 'left')
      }

      // advance behavior
      if (now >= behaviorUntil.current) {
        planNext()
      }

      // duel invite chip logic (non-blocking)
      const nowMs = Date.now()
      const snoozed = nowMs < snoozeUntil.current
      if (
        userActiveRef.current &&
        scoreRef.current >= 300 &&
        !askedThisSession.current &&
        !snoozed &&
        !adversary
      ) {
        setShowAskChip(true)
        askedThisSession.current = true
        sessionStorage.setItem('abe_asked', '1')
      }

      loopRef.current = requestAnimationFrame(loop)
    }

    // initialize
    behaviorUntil.current = performance.now() + 1200
    loopRef.current = requestAnimationFrame(loop)

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current)
    }
  }, [mounted, hidden, mute, pose, x, adversary])

  const startAdversary = () => {
    setShowAskChip(false)
    window.dispatchEvent(new CustomEvent('abe-adversary', { detail: { on: true } }))
    if (!mute) setLine('Okay, I’m the drones. No mercy. 😈')
  }

  const snoozeAsk = () => {
    setShowAskChip(false)
    const until = Date.now() + 2 * 60 * 1000
    snoozeUntil.current = until
    sessionStorage.setItem('abe_snooze_until', String(until))
  }

  if (!mounted) return null

  if (hidden) {
    return (
      <button
        className="fixed bottom-4 left-4 z-[55] rounded-full border border-white/10 bg-black/60 px-3 py-2 text-sm text-white/90 backdrop-blur hover:bg-black/70"
        onClick={() => setHidden(false)}
        title="Show Sidekick (H)"
      >
        Show Sidekick • H
      </button>
    )
  }

  // sandbox zone (bottom-left); we translate the sprite horizontally within this box
  return (
    <>
      {/* sprite + speech bubble */}
      <div
        className="pointer-events-none fixed bottom-24 left-4 z-[55]"
        style={{ width: sandboxWidth, height: 140 }}
      >
        <div
          className="absolute bottom-0"
          style={{ transform: `translateX(${x}px)` }}
        >
          <SidekickSprite pose={pose} facing={facing} size={64} accent="#00E5FF" />
        </div>

        {!mute && (
          <div
            className="absolute -top-2 left-2 max-w-[280px] translate-y-[-8px] rounded-2xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white/90 backdrop-blur"
            style={{ transform: `translateX(${x}px)` }}
          >
            {line}
          </div>
        )}
      </div>

      {/* controls (bottom-left) */}
      <div className="fixed bottom-4 left-4 z-[56] flex flex-wrap gap-2">
        <button
          onClick={() => setMute((v) => !v)}
          className="rounded-full border border-white/10 bg-black/60 px-3 py-2 text-sm text-white/90 backdrop-blur hover:bg-black/70"
          title="Mute sidekick lines"
        >
          {mute ? 'Sidekick: Muted' : 'Sidekick: Speaking'}
        </button>
        <button
          onClick={() => setHidden(true)}
          className="rounded-full border border-white/10 bg-black/60 px-3 py-2 text-sm text-white/90 backdrop-blur hover:bg-black/70"
          title="Hide sidekick (H)"
        >
          Hide Sidekick
        </button>
        <button
          onClick={startAdversary}
          className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100 backdrop-blur hover:bg-cyan-500/30"
          title="Start a 30s duel (you vs sidekick-controlled drones)"
        >
          Challenge me
        </button>
      </div>

      {/* duel invite chip */}
      {showAskChip && (
        <div className="fixed bottom-28 left-[92px] z-[57] flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 backdrop-blur">
          <span>Wanna duel for 30s?</span>
          <button
            onClick={startAdversary}
            className="rounded-full border border-cyan-500/40 bg-cyan-500/20 px-2 py-1 text-xs hover:bg-cyan-500/30"
          >
            Yes
          </button>
          <button
            onClick={snoozeAsk}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
          >
            Later
          </button>
        </div>
      )}
    </>
  )
}
