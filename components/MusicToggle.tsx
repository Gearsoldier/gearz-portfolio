'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * MusicToggle (bottom-right)
 * - Hydration-safe (stable SSR label)
 * - Single hidden <audio id="gearz-bgm"> element
 * - Keyboard shortcut: M (ignored while typing)
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(true) // stable SSR default
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    let el = document.getElementById('gearz-bgm') as HTMLAudioElement | null
    if (!el) {
      el = document.createElement('audio')
      el.id = 'gearz-bgm'
      el.src = '/audio/sci-fi-moodtimeflow-194382.mp3' // ensure file exists
      el.loop = true
      el.preload = 'auto'
      el.style.display = 'none'
      document.body.appendChild(el)
    }
    audioRef.current = el

    const saved = localStorage.getItem('gearz_music_muted')
    const initialMuted = saved === '1'
    setMuted(initialMuted)

    const tryPlay = async () => {
      if (!audioRef.current) return
      audioRef.current.muted = initialMuted
      if (!initialMuted) {
        try {
          await audioRef.current.play()
        } catch {
          const kick = () => {
            audioRef.current?.play().catch(() => {})
            window.removeEventListener('pointerdown', kick)
            window.removeEventListener('keydown', kick)
          }
          window.addEventListener('pointerdown', kick, { once: true })
          window.addEventListener('keydown', kick, { once: true })
        }
      }
    }
    tryPlay()
  }, [])

  useEffect(() => {
    if (!mounted || !audioRef.current) return
    localStorage.setItem('gearz_music_muted', muted ? '1' : '0')
    audioRef.current.muted = muted
    if (muted) audioRef.current.pause()
    else audioRef.current.play().catch(() => {})
  }, [muted, mounted])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable ||
          t.closest?.('input, textarea, [contenteditable="true"]'))
      )
        return
      if (e.key.toLowerCase() === 'm') setMuted((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const label = !mounted ? 'Music' : muted ? 'Music: Off (M)' : 'Music: On (M)'
  const ariaPressed = mounted ? (muted ? 'true' : 'false') : undefined

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <button
        suppressHydrationWarning
        aria-pressed={ariaPressed}
        onClick={() => setMuted((v) => !v)}
        className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/90 backdrop-blur hover:bg-black/70"
        aria-label="Toggle background music"
        title="Toggle background music (M)"
      >
        {label}
      </button>
    </div>
  )
}
