// app/play/page.tsx
import BikeGame from '@/components/BikeGame'

export const metadata = {
  title: 'GEARZ — Akira Bike Escape',
  description: 'Neon grid runner mini-game with project sigils and boost.',
}

export default function Play() {
  return (
    <main className="relative min-h-screen">
      {/* simple backdrop to match the site vibe */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-gearz-mountain.png')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,.35) 0%, rgba(0,0,0,.7) 55%, rgba(0,0,0,.9) 100%)',
        }}
      />
      <section className="mx-auto max-w-6xl px-6 pt-6 pb-4">
        <div className="mb-3 flex items-center justify-between text-sm text-white/80">
          <a href="/" className="underline decoration-cyan-300/60 hover:opacity-90">&larr; Back to portfolio</a>
          <span>Arrows/WASD = steer • Space = Boost • P = Pause • R = Restart</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          <BikeGame />
        </div>
      </section>
      <footer className="mx-auto max-w-6xl px-6 pb-8 pt-2 text-center text-[11px] text-white/60">
        © {new Date().getFullYear()} GEARZ — Akira Bike Escape
      </footer>
    </main>
  )
}
