// app/play/page.tsx
'use client'
import Link from 'next/link'
import BikeGame from '@/components/BikeGame'

export default function PlayPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-cyan-100">Akira Bike Escape — Fullscreen</h1>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm hover:bg-white/10">
            ← Back to Portfolio
          </Link>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 shadow-neon backdrop-blur">
          <BikeGame height={640} />
        </div>

        <p className="mt-3 text-sm text-white/60">
          Controls: Arrow keys / WASD to move • Space to boost • B for shield • H to hide sidekick • M to toggle music
        </p>
      </div>
    </main>
  )
}
