// lib/qa.ts
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'

export type QAAction =
  | { type: 'open'; href: string; newTab?: boolean }
  | { type: 'scroll'; selector: string }
  | { type: 'event'; name: string; detail?: any }

export type QAResponse = {
  text: string
  action?: QAAction
  followups?: string[]
}

const norm = (s: string) => s.toLowerCase().trim()

// simple contains helper
const has = (q: string, ...needles: string[]) =>
  needles.some((n) => norm(q).includes(norm(n)))

export function answer(q: string): QAResponse {
  const query = norm(q)

  // greetings / small talk
  if (has(query, 'hi', 'hello', 'hey', 'yo', 'sup')) {
    return {
      text:
        "Yo. I'm Tachi — GEARZ’s operator. I can tour projects, open the resume, or spin up a duel in the mini-game. What are you scouting for?",
      followups: ['Show projects', 'Open resume', 'Start duel', 'Skills'],
    }
  }

  // resume / contact
  if (has(query, 'resume', 'cv')) {
    return {
      text: `Opening the resume. Heads up: it’s a PDF (${profile.resumePath}).`,
      action: { type: 'open', href: profile.resumePath, newTab: true },
      followups: ['Email Joel', 'Show projects'],
    }
  }
  if (has(query, 'email', 'contact', 'reach', 'reach out')) {
    return {
      text: `Email Joel at ${profile.email}. I can open your mail app now.`,
      action: { type: 'open', href: `mailto:${profile.email}` },
      followups: ['Show projects', 'Open resume'],
    }
  }
  if (has(query, 'availability', 'available', 'start date')) {
    return {
      text: `${profile.availability}`,
      followups: ['Skills', 'Show projects', 'Open resume'],
    }
  }

  // skills / bio
  if (has(query, 'skills', 'skillset', 'stack', 'tech', 'tools')) {
    return {
      text:
        `Here’s the quick stack: ` +
        profile.skills.join(', ') +
        '. Want a deeper dive on any of those?',
      followups: ['OSINT focus', 'AI/LLM usage', 'Next.js details'],
    }
  }
  if (has(query, 'about', 'bio', 'background')) {
    return { text: profile.bio, followups: ['Open resume', 'Show projects'] }
  }

  // list projects
  if (has(query, 'projects', 'work', 'portfolio', 'showcase')) {
    const list = projects
      .map((p) => `• ${p.title} — ${p.blurb}`)
      .join('\n')
    return {
      text:
        `Top projects:\n${list}\n\nI can open any repo, TikTok demo, or scroll to the cards below.`,
      action: { type: 'scroll', selector: '#projects' },
      followups: projects.map((p) => p.title),
    }
  }

  // project deep-dive (match by title/slug keywords)
  for (const p of projects) {
    const t = norm(p.title)
    const s = norm(p.slug)
    if (has(query, t, s)) {
      const why =
        p.slug === 'gearz-leakfinder'
          ? 'Catches credential/secret spillage before attackers do — across repos/registries/logs.'
          : p.slug === 'vuln-report-agent'
          ? 'Automates clean, consistent reports from messy tool output — a speed and quality multiplier.'
          : p.slug === 'neon-honeypot-llm'
          ? 'A visual way to demo LLM safety/red-teaming with instant feedback and style.'
          : 'High-impact security utility.'
      const how =
        p.slug === 'gearz-leakfinder'
          ? 'Adapters for GitHub, npm, PyPI, DockerHub, Wayback, CI/CD; AI summaries; redaction-first outputs.'
          : p.slug === 'vuln-report-agent'
          ? 'Parses ffuf/nuclei/Burp/curl, extracts issues, assigns severity & remediation, saves to a private vault.'
          : p.slug === 'neon-honeypot-llm'
          ? 'Persona-style responses, payload scoring, highlights, classic payload packs.'
          : ''
      return {
        text: `**${p.title}**\nWhat: ${p.blurb}\nHow: ${how}\nWhy: ${why}\n\nWant GitHub or TikTok?`,
        followups: ['GitHub', 'TikTok', 'Show projects'],
      }
    }
  }

  // open links intents
  if (has(query, 'github')) {
    return {
      text: 'Opening GitHub.',
      action: { type: 'open', href: 'https://github.com/Gearsoldier', newTab: true },
      followups: ['Show projects', 'Open resume'],
    }
  }
  if (has(query, 'tiktok')) {
    return {
      text: 'Opening TikTok demo feed.',
      action: { type: 'open', href: 'https://www.tiktok.com/@gear2705', newTab: true },
      followups: ['Show projects', 'Open resume'],
    }
  }

  // game actions
  if (has(query, 'play', 'game', 'minigame', 'mini game')) {
    return {
      text: 'Let’s roll. I’ll scroll to the game — or open full screen if you want.',
      action: { type: 'scroll', selector: '#play' },
      followups: ['Start duel', 'Open full screen'],
    }
  }
  if (has(query, 'duel', 'challenge', 'battle', 'vs')) {
    return {
      text: 'Spawning as the drones for 30s. No mercy. 😈',
      action: { type: 'event', name: 'abe-adversary', detail: { on: true } },
      followups: ['Stop duel', 'Play again'],
    }
  }
  if (has(query, 'stop duel', 'stop battle', 'stop challenge')) {
    return {
      text: 'Adversary disengaged. Back to fair play.',
      action: { type: 'event', name: 'abe-adversary', detail: { on: false } },
      followups: ['Start duel', 'Play'],
    }
  }
  if (has(query, 'open full screen')) {
    return { text: 'Opening full-screen game.', action: { type: 'open', href: '/play' } }
  }

  // default fallback
  return {
    text:
      "I can talk projects, skills, resume, or fire up the mini-game duel. Try: “Show projects”, “Open resume”, or “Start duel”.",
    followups: ['Show projects', 'Open resume', 'Start duel', 'Email Joel'],
  }
}
