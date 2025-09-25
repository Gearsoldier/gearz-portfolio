// lib/qa.ts
export type QAOut = { answer: string; followups: string[] }

type KBEntry = {
  match: (q: string) => boolean
  answer: string
  followups: string[]
}

const KB: KBEntry[] = [
  {
    match: (q) => /stack|tech|technology|tools|framework/i.test(q),
    answer:
      'Primary stack: Next.js (App Router) + TypeScript on the front; Node/Python services on the back; Postgres/Prisma, Redis, WebSockets. LLM features with OpenAI, embeddings/RAG (pgvector/Pinecone), and Vercel/AWS deploys.',
    followups: [
      'What’s your approach to shipping MVPs?',
      'How do you handle auth and sessions?',
      'How do you test and monitor?',
      'What’s your CI/CD setup?',
    ],
  },
  {
    match: (q) => /availability|start|contract|freelance|rate|timezone/i.test(q),
    answer:
      'US-based, remote, contract/freelance. Available to start immediately with strong US time-zone overlap.',
    followups: [
      'What time zones do you overlap?',
      'How do you communicate progress?',
      'What’s your typical project cadence?',
    ],
  },
  {
    match: (q) => /project|portfolio|work|repo|github/i.test(q),
    answer:
      'Top projects: LeakFinder (OSINT secret scanner), Vuln Report Agent (AI report generation), neon-honeypot LLM (safety/red-team demo). Links are on the Projects section.',
    followups: ['Show me LeakFinder', 'Show me Vuln Report Agent', 'Show me neon-honeypot'],
  },
  {
    match: (q) => /security|osint|bug|bounty|mitre|detections/i.test(q),
    answer:
      'Security background: OSINT, detections, report automation, and shipping polished tools. Comfortable with auth hardening, secrets hygiene, and basic hardening.',
    followups: [
      'How do you store secrets safely?',
      'How do you design secure APIs?',
      'Show an example of report automation.',
    ],
  },
  {
    match: (q) => /resume|cv|pdf/i.test(q),
    answer:
      'You can grab the resume at /resume.pdf — it covers stack, projects, and availability.',
    followups: ['What roles are you targeting?', 'What’s your most recent project?'],
  },
]

const DEFAULT_ANSWER =
  'Joel is a full-stack engineer: React/Next.js, TypeScript, Node/Python, Postgres/Prisma, Redis, and LLM features. Ask about projects, availability, or the mini-game.'
const DEFAULT_FOLLOWUPS = [
  'What’s your approach to shipping MVPs?',
  'How do you handle auth?',
  'How do you test?',
  'What’s your CI/CD setup?',
]

/**
 * Deterministic, local Q&A used by the Recruiter Chat.
 * No network calls; returns an answer + safe followups[].
 */
export async function askRecruiterBot(q: string): Promise<QAOut> {
  const text = (q || '').trim()
  if (!text) return { answer: DEFAULT_ANSWER, followups: DEFAULT_FOLLOWUPS }

  const hit = KB.find((k) => k.match(text))
  if (hit) return { answer: hit.answer, followups: hit.followups }

  // Small fuzzy helpers
  if (/leakfinder/i.test(text)) {
    return {
      answer:
        'LeakFinder: scans repos, registries, Docker images, CI logs, and archived captures for exposed secrets. Includes Scope Builder, redaction-first outputs, and AI summaries.',
      followups: ['How does Scope Builder work?', 'How do you redact output?'],
    }
  }
  if (/vuln|report agent|reporter/i.test(text)) {
    return {
      answer:
        'Vuln Report Agent: paste tool output (ffuf, nuclei, Burp, curl) → generates severity, title, impact, PoC, and fixes, then saves to a private vault with export/share.',
      followups: ['Can it parse Burp exports?', 'How do you store reports?'],
    }
  }
  if (/honeypot|neon|llm/i.test(text)) {
    return {
      answer:
        'neon-honeypot LLM: cyberpunk playground for SQLi/XSS/Traversal/Prompt-Injection payloads with detection highlights, scoring, and persona responses.',
      followups: ['What detections does it run?', 'How does the scoring work?'],
    }
  }

  return { answer: DEFAULT_ANSWER, followups: DEFAULT_FOLLOWUPS }
}
