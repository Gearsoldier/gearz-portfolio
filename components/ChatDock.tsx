'use client'

import { useEffect, useRef, useState } from 'react'
import { answer, type QAResponse } from '@/lib/qa'

type Msg = { role: 'user' | 'bot'; text: string }
const STORAGE_KEY = 'gearz_chat_history_v1'

export default function ChatDock() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Msg[]
        setMsgs(parsed.slice(-40))
      } catch {
        setMsgs([
          {
            role: 'bot',
            text:
              "I'm **Tachi** — your neon ops guide. Ask about projects, skills, resume… or say “Start duel” and I’ll possess the enemy drones for 30s. 😉",
          },
        ])
      }
    } else {
      setMsgs([
        {
          role: 'bot',
          text:
            "I'm **Tachi** — your neon ops guide. Ask about projects, skills, resume… or say “Start duel” and I’ll possess the enemy drones for 30s. 😉",
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-60)))
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [msgs, mounted])

  const quick = (label: string) => run(label)

  const run = async (q: string) => {
    if (busyRef.current) return
    busyRef.current = true
    setMsgs((m) => [...m, { role: 'user', text: q }])

    await new Promise((r) => setTimeout(r, 220 + Math.random() * 200))

    const res: QAResponse = answer(q)
    setMsgs((m) => [...m, { role: 'bot', text: res.text }])

    if (res.action) {
      const a = res.action
      if (a.type === 'open') {
        if (a.newTab) window.open(a.href, '_blank')
        else window.location.assign(a.href)
      } else if (a.type === 'scroll') {
        const el =
          document.querySelector(a.selector) ||
          document.getElementById(a.selector.replace('#', ''))
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (a.type === 'event') {
        window.dispatchEvent(new CustomEvent(a.name, { detail: a.detail }))
      }
    }

    if (res.followups?.length) {
      setMsgs((m) => [
        ...m,
        {
          role: 'bot',
          text:
            'Try: ' +
            res.followups
              .slice(0, 4)
              .map((f) => `“${f}”`)
              .join(' · '),
        },
      ])
    }

    busyRef.current = false
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    setInput('')
    run(q)
  }

  if (!mounted) {
    return (
      <button
        className="fixed bottom-24 right-4 z-[65] h-12 w-12 rounded-full border border-white/10 bg-black/60 text-white/90 backdrop-blur"
        aria-label="Open chat"
      />
    )
  }

  return (
    <>
      {/* bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-[66] flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xl text-cyan-200 shadow-lg backdrop-blur hover:bg-cyan-400/15"
        aria-label="Open Tachi chat"
        title="Chat with Tachi"
      >
        🤖
      </button>

      {/* panel */}
      {open && (
        <div className="fixed bottom-40 right-4 z-[66] w-[340px] max-w-[95vw] overflow-hidden rounded-2xl border border-white/10 bg-[#0b141c]/95 shadow-2xl backdrop-blur">
          {/* header */}
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/20 text-lg">🤖</div>
              <div>
                <div className="text-sm font-semibold text-cyan-100">Tachi</div>
                <div className="text-[11px] text-white/60">NEON OPS assistant</div>
              </div>
            </div>
            <button
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          {/* messages */}
          <div ref={listRef} className="max-h-[45vh] overflow-y-auto px-3 py-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`mb-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl border px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                      : 'border-white/10 bg-white/5 text-white/90'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* quick chips */}
          <div className="flex flex-wrap gap-2 border-t border-white/10 px-3 py-2">
            <Chip onClick={() => quick('Show projects')}>Show projects</Chip>
            <Chip onClick={() => quick('Open resume')}>Open resume</Chip>
            <Chip onClick={() => quick('Start duel')}>Start duel</Chip>
            <Chip onClick={() => quick('Email Joel')}>Email Joel</Chip>
          </div>

          {/* input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // stop the game and global listeners from eating Space/Arrows
                e.stopPropagation()
              }}
              placeholder="Ask about projects, skills, resume…"
              className="h-10 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white/90 outline-none placeholder:text-white/40"
            />
            <button
              className="h-10 rounded-xl border border-cyan-400/30 bg-cyan-400/20 px-3 text-sm text-cyan-100 hover:bg-cyan-400/25"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Chip({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
      type="button"
    >
      {children}
    </button>
  )
}
