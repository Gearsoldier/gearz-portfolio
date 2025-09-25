'use client'

import { useEffect, useRef, useState } from 'react'

export default function SiteAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('site-audio-muted') === '1'
  })

  // try playback (respecting autoplay policies)
  const tryPlay = async () => {
    const el = audioRef.current
    if (!el) return
    el.loop = true
    el.volume = 0.35
    if (!muted) {
      try {
        await el.play()
      } catch {
        // wait for a user gesture
      }
    }
  }

  useEffect(() => {
    setReady(true)
    tryPlay()

    // unlock on first user gesture if autoplay was blocked
    const unlock = () => {
      const el = audioRef.current
      if (!el) return
      if (!muted && el.paused) el.play().catch(() => {})
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)

    // hotkey M to toggle mute
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') toggleMute()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    const el = audioRef.current
    if (!el) return
    if (muted) {
      el.pause()
      localStorage.setItem('site-audio-muted', '1')
    } else {
      localStorage.setItem('site-audio-muted', '0')
      el.play().catch(() => {}) // will start after gesture if blocked
    }
  }, [muted, ready])

  const toggleMute = () => setMuted((m) => !m)

  return (
    <>
      {/* hidden audio element */}
      <audio ref={audioRef} src="/audio/theme.mp3" preload="auto" />

      {/* floating mute/unmute pill */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute music (M)' : 'Mute music (M)'}
        aria-pressed={!muted}
        className="fixed bottom-5 right-5 z-50 select-none rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition hover:border-cyan-300/40 hover:text-white"
      >
        {muted ? 'Music: Off (M)' : 'Music: On (M)'}
      </button>
    </>
  )
}
