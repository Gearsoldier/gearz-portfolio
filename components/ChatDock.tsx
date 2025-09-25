'use client'

import { useEffect, useRef, useState } from 'react'
import { askRecruiterBot } from '@/lib/qa'

type Msg = { role: 'user' | 'assistant'; text: string }
type QAResponse = { answer: string; followups?: string[] }

export default function ChatDock() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text:
        "Hey! I'm the recruiter bot. Ask me about Joel’s stack, projects, availability, or the mini-game.",
    },
  ])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const q = input.trim()
    if (!q || busy) return
    setBusy(true)
    setInput('')

    setMessages((m) => [...m, { role: 'user', text: q }])

    try {
      const res: QAResponse = await askRecruiterBot(q)

      // Main answer
      const next: Msg[] = [{ role: 'assistant', text: res.answer }]

      // Optional followups (safe)
      const follow = (res.followups ?? []).slice(0, 4)
      if (follow.length > 0) {
        next.push({
          role: 'assistant',
          text: 'Try: ' + follow.map((f) => `“${f}”`).join(' · '),
        })
      }

      setMessages((m) => [...m, ...next])
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text:
            "Hmm, the line’s noisy. Try again, or ask about Joel’s stack, projects, availability, or resume.",
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {/* Toggle button */}
      {!open && (
        <button
          className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/90 backdrop-blur hover:bg-black/70"
          onClick={() => setOpen(true)}
          aria-expanded="false"
          aria-controls="chatdock"
        >
          Open Recruiter Chat
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          id="chatdock"
          className="flex h-[420px] w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-neon backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div className="text-sm font-medium text-cyan-100">Recruiter Chat</div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      text:
                        "Hey! I'm the recruiter bot. Ask me about Joel’s stack, projects, availability, or the mini-game.",
                    },
                  ])
                }
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                onClick={() => setOpen(false)}
                title="Close"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[80%] rounded-2xl bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100'
                    : 'mr-auto max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-white/90'
                }
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-white/10 p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              placeholder="Ask about stack, projects, availability…"
              className="w-full resize-none rounded-xl border border-white/10 bg-black/60 p-2 text-sm text-white/90 outline-none placeholder-white/40"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-white/50">Enter to send · Shift+Enter new line</div>
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 text-sm text-cyan-100 backdrop-blur hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? 'Thinking…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
