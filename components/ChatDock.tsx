'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ask, greeting, type QAResult } from '@/lib/qa';

type Msg = { role: 'assistant' | 'user'; text: string };

export default function ChatDock() {
  const [open, setOpen] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', text: greeting().text }]);
  const [suggestions, setSuggestions] = useState<string[]>(greeting().followups);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSend = async (raw: string) => {
    const question = raw.trim();
    if (!question || sending) return;

    setSending(true);
    setMsgs((m) => [...m, { role: 'user', text: question }]);

    try {
      const res: QAResult = await ask(question);
      setMsgs((m) => [...m, { role: 'assistant', text: res.text }]);
      setSuggestions(Array.isArray(res.followups) ? res.followups : []);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          text:
            "Hit a hiccup on my end. Try again—or ask about stack, MVPs, auth, testing, CI/CD, or the mini-game.",
        },
      ]);
      setSuggestions(["What’s your stack?", "How do you ship MVPs?", "How do you handle auth?"]);
    } finally {
      setSending(false);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend(input);
    }
  };

  return (
    <div
      ref={dockRef}
      className="fixed right-4 bottom-24 z-[55] w-[380px] max-w-[90vw] rounded-2xl border border-white/10 bg-black/70 text-white/90 backdrop-blur shadow-lg"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="text-sm font-semibold">Recruiter Chat</div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md px-2 py-1 text-xs border border-white/10 hover:bg-white/5"
          aria-pressed={open ? 'true' : 'false'}
        >
          {open ? 'Hide' : 'Open'}
        </button>
      </div>

      {open && (
        <>
          <div className="max-h-[320px] overflow-y-auto space-y-3 p-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                  m.role === 'assistant' ? 'bg-white/5' : 'bg-cyan-500/10 border border-cyan-400/20'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => void handleSend(s)}
                  className="text-[12px] rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-end gap-2 p-3 pt-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about stack, projects, MVPs, auth, testing, CI/CD, or the mini-game…"
              rows={2}
              className="flex-1 resize-none rounded-lg bg-black/40 border border-white/10 p-2 text-sm outline-none focus:ring-1 focus:ring-cyan-400/40"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-lg px-3 py-2 text-sm border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
