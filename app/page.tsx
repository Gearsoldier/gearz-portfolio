// app/page.tsx
import Link from 'next/link'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import BikeGame from '@/components/BikeGame'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'
import MusicToggle from '@/components/MusicToggle'
import Sidekick from '@/components/Sidekick'
import ChatDock from '@/components/ChatDock'

const HERO_BG = '/bg/hero-cyber.png' // ensure this exists in /public/bg

export default function Home() {
  const year = new Date().getFullYear()

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Interactive neon grid / particles */}
      <BackgroundCanvas />

      {/* Soft poster backdrop */}
      <img
        src={HERO_BG}
        alt=""
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-[0.22]"
      />

      {/* ======================= HERO ======================= */}
      <header className="relative z-10 mx-auto mt-12 max-w-6xl px-6">
        <div className="rounded-[28px] border border-white/10 bg-black/40 p-8 shadow-[0_0_80px_rgba(0,229,255,.18)] backdrop-blur">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
            AI × Full-Stack Portfolio
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-6xl md:text-7xl">
            GEARZ — cinematic, AI-powered
            <br className="hidden sm:block" />
            full-stack builds
          </h1>

          <p className="mt-4 max-w-3xl text-white/80">
            I ship end-to-end products fast: React/Next.js fronts, Node/Python services,
            streaming backends, and LLM features — all wrapped in a polished, cyber aesthetic.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn-neon">View Projects</a>
            <Link href="/resume.pdf" className="btn-outline">Resume (PDF)</Link>
            <a href="mailto:joel.suarez0731@gmail.com" className="btn-outline">Email</a>
          </div>
        </div>
      </header>

      {/* Divider scanline */}
      <div className="pointer-events-none mx-auto mt-10 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

      {/* ======================= FEATURED PROJECTS ======================= */}
      <section id="projects" className="relative z-10 mx-auto mt-10 max-w-6xl px-6">
        <div className="rounded-[24px] border border-white/10 bg-black/35 p-6 shadow-neon backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-cyan-100">Featured Projects</h2>
            <a
              href="https://github.com/Gearsoldier"
              target="_blank"
              className="text-sm text-cyan-300 hover:underline"
            >
              All repos →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================= MINI-GAME (INLINE) ======================= */}
      <section id="play" className="relative z-10 mx-auto mt-12 max-w-6xl px-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-cyan-100">Play the Mini-Game</h2>
          <Link href="/play" className="text-sm text-cyan-300 hover:underline">
            Open full screen →
          </Link>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/35 p-4 shadow-neon backdrop-blur">
          <BikeGame height={520} />
        </div>
      </section>

      {/* ======================= DEMOS ======================= */}
      <section className="relative z-10 mx-auto mt-12 max-w-6xl px-6">
        <div className="rounded-[24px] border border-white/10 bg-black/35 p-6 shadow-neon backdrop-blur">
          <h2 className="mb-3 text-2xl font-semibold text-cyan-100">Demos</h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <a
              className="btn-outline"
              href="https://www.tiktok.com/@gear2705/video/7539746188468194573"
              target="_blank"
            >
              LeakFinder walk-through
            </a>
            <a
              className="btn-outline"
              href="https://www.tiktok.com/@gear2705/video/7535102156874009870"
              target="_blank"
            >
              Vuln Report Agent demo
            </a>
            <a
              className="btn-outline"
              href="https://www.tiktok.com/@gear2705/video/7538442226226023735"
              target="_blank"
            >
              neon-honeypot LLM demo
            </a>
          </div>
        </div>
      </section>

      {/* ======================= ABOUT / CONTACT ======================= */}
      <section className="relative z-10 mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        {/* ABOUT — upgraded for full-stack focus */}
        <div className="rounded-[24px] border border-white/10 bg-black/35 p-6 shadow-neon backdrop-blur">
          <h3 className="text-xl font-semibold text-cyan-100">About Joel (GEARZ)</h3>
          <p className="mt-3 text-white/80">
            Full-stack software engineer who builds AI-flavored products end-to-end.
            I move fast, keep code clean, and obsess over UX polish. Comfortable owning
            everything from product shape to deployment and observability.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-white/80">
            <div className="text-white/60">Frontend</div>
            <div>React, Next.js (App Router), TypeScript, Tailwind, shadcn/ui</div>

            <div className="text-white/60">Backend</div>
            <div>Node (Express/Nest), Python (FastAPI), REST/GraphQL, WebSockets</div>

            <div className="text-white/60">Data</div>
            <div>Postgres/Prisma, Redis, MongoDB, file/object storage</div>

            <div className="text-white/60">AI</div>
            <div>OpenAI, embeddings/RAG, vector DBs (pgvector/Pinecone), prompt tooling</div>

            <div className="text-white/60">DevOps</div>
            <div>Docker, GitHub Actions, Vercel, AWS (S3/CloudFront/Lambda)</div>

            <div className="text-white/60">Quality</div>
            <div>Jest/Vitest, Playwright, Sentry, basic OpenTelemetry</div>

            <div className="text-white/60">Security</div>
            <div>Auth (JWT/OAuth), secrets hygiene, basic hardening; OSINT background</div>

            <div className="text-white/60">Ways of Working</div>
            <div>Rapid prototyping → MVP → iterating with metrics & feedback</div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="rounded-[24px] border border-white/10 bg-black/35 p-6 shadow-neon backdrop-blur">
          <h3 className="text-xl font-semibold text-cyan-100">Contact</h3>
          <div className="mt-3 space-y-2 text-white/80">
            <div>
              <div className="text-white/60">Email</div>
              <a className="text-cyan-300 hover:underline" href="mailto:joel.suarez0731@gmail.com">
                joel.suarez0731@gmail.com
              </a>
            </div>
            <div>
              <div className="text-white/60">Resume</div>
              <Link className="text-cyan-300 hover:underline" href="/resume.pdf">
                /resume.pdf
              </Link>
            </div>
            <div>
              <div className="text-white/60">Links</div>
              <div className="mt-1 flex gap-3">
                <a className="btn-outline" href="https://github.com/Gearsoldier" target="_blank">GitHub</a>
                <a className="btn-outline" href="https://www.tiktok.com/@gear2705" target="_blank">TikTok</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative z-10 mx-auto my-10 max-w-6xl px-6 text-center text-xs text-white/50">
        © {year} GEARZ — Built with Next.js & Tailwind
      </footer>

      {/* Overlays (mounted once) */}
      <Sidekick />
      <MusicToggle />
      <ChatDock />
    </main>
  )
}
