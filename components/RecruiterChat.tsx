'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FAQ } from '@/data/faq'
import { projects } from '@/data/projects' // your existing file

type Card = {
  slug: string
  title: string
  blurb: string
  github: string
  tiktok: string
  cover: string
  stack: string[]
}

const fuse = (query: string) => {
  const q = query.trim().toLowerCase()
  if (!q) return FAQ
  return FAQ.filter(x =>
    (x.q + ' ' + x.a + ' ' + (x.tags ?? []).join(' ')).toLowerCase().includes(q)
  )
}

export default function RecruiterChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [items, setItems] = useState(FAQ.slice(0, 4))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => setItems(fuse(input).slice(0, 8)), [input])

  const matchingProjects: Card[] = useMemo(() => {
    const q = input.trim().toLowerCase()
    if (!q) return projects.slice(0, 3) as any
    return (projects as any as Card[]).filter(p =>
      (p.title + ' ' + p.blurb).toLowerCase().includes(q)
    ).slice(0, 3)
  }, [input])

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="GEARZ Concierge"
        className="fixed bottom-5 right-5 z-40 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-sm text-cyan-100 shadow-[0_0_40px_rgba(0,229,255,0.25)] backdrop-blur-md hover:border-cyan-300/40"
      >
        {open ? 'Close' : 'GEARZ Concierge'}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,16,23,.92)] shadow-[0_0_60px_rgba(0,229,255,.18)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm text-cyan-200">Recruiter Concierge</div>
            <div className="text-[10px] text-white/40">Press ⌘/Ctrl + K</div>
          </div>

          <div className="space-y-3 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {['TL;DR', 'Skills', 'Top projects', 'Resume', 'GitHub', 'TikTok demos', 'Email', 'Availability'].map(t => (
                <button
                  key={t}
                  onClick={() => setInput(t)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:border-cyan-300/40"
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask: skills, resume, GitHub, TL;DR…"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-cyan-300/40"
            />

            {/* FAQ results */}
            <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
              {items.map((x, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[13px] font-semibold text-cyan-200">{x.q}</div>
                  <div className="whitespace-pre-wrap text-[13px] text-white/80">
                    {x.link ? (
                      <a href={x.link} className="underline decoration-cyan-400/50 hover:text-white">{x.a}</a>
                    ) : x.a}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="p-3 text-sm text-white/60">Nothing yet—try “skills”, “GitHub”, or “resume”.</div>
              )}
            </div>

            {/* Project mini-cards */}
            <div className="space-y-2 border-t border-white/10 pt-3">
              <div className="text-xs uppercase tracking-wide text-white/50">Projects</div>
              {matchingProjects.map(p => (
                <div key={p.slug} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
                  <img src={p.cover} alt={p.title} className="h-12 w-20 rounded-md object-cover" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white/90">{p.title}</div>
                    <div className="line-clamp-2 text-xs text-white/60">{p.blurb}</div>
                    <div className="mt-1 flex gap-2">
                      <a href={p.github} className="rounded border border-white/10 px-2 py-1 text-[11px] text-cyan-200 hover:border-cyan-300/40">GitHub</a>
                      <a href={p.tiktok} className="rounded border border-white/10 px-2 py-1 text-[11px] text-pink-200 hover:border-cyan-300/40">TikTok</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <a href="mailto:joel.suarez0731@gmail.com" className="rounded-lg border border-white/10 bg-cyan-400/15 px-3 py-2 text-sm text-cyan-100 hover:border-cyan-300/40">
                Send role →
              </a>
              <a href="/resume.pdf" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80 hover:border-cyan-300/40">
                Resume (PDF)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
