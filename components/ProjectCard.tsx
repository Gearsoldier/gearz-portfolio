'use client'

import Link from 'next/link'
import type { Project } from '@/data/projects'

type Props = { project: Project }

export default function ProjectCard({ project }: Props) {
  if (!project) return null
  const { title, blurb, cover, github, tiktok, stack } = project

  return (
    <article className="group rounded-2xl border border-white/10 bg-black/45 p-3 shadow-neon backdrop-blur transition-all hover:shadow-[0_0_40px_rgba(0,229,255,.18)]">
      {/* Cover */}
      <div className="relative mb-3 h-[230px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
        {/* Use <img> so missing files won’t crash SSR; provide graceful fallback */}
        <img
          src={cover || '/bg/hero-cyber.png'}
          alt={`${title} cover`}
          className="h-full w-full object-contain p-3"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/bg/hero-cyber.png'
          }}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-cyan-100">{title}</h3>

      {/* Blurb */}
      <p className="mt-2 line-clamp-3 text-sm text-white/75">{blurb}</p>

      {/* Stack chips */}
      {stack?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-200"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}

      {/* Links */}
      <div className="mt-4 flex gap-2">
        {github ? (
          <a href={github} target="_blank" rel="noreferrer" className="btn-outline">
            GitHub
          </a>
        ) : null}
        {tiktok ? (
          <a href={tiktok} target="_blank" rel="noreferrer" className="btn-outline">
            TikTok
          </a>
        ) : null}
      </div>
    </article>
  )
}
