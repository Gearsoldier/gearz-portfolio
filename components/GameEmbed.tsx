'use client'

import dynamic from 'next/dynamic'

// Keep the game strictly client-side
const BikeGame = dynamic(() => import('./BikeGame'), { ssr: false })

export default function GameEmbed() {
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between px-4 py-3">
        <h4 className="text-white/90">Akira Bike Escape</h4>
        <a
          href="/play"
          className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-sm text-white/80 backdrop-blur-md transition hover:border-cyan-300/40 hover:text-white"
        >
          Open full screen →
        </a>
      </div>
      <BikeGame />
    </div>
  )
}
