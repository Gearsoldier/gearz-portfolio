export type Project = {
  slug: string
  title: string
  blurb: string
  github: string
  tiktok: string
  cover: string
  stack: string[]
}

export const projects: Project[] = [
  {
    slug: 'gearz-leakfinder',
    title: 'GEARZ LeakFinder',
    blurb:
      'Scan code repos, package registries, Docker images, CI/CD logs, and archived web captures for leaked secrets. Includes Scope Builder, redaction-first outputs, adapter control (GitHub, npm, PyPI, DockerHub, Wayback, CICD), and an AI summary after each run.',
    github: 'https://github.com/Gearsoldier/gearz-leakfinder?tab=readme-ov-file',
    tiktok: 'https://www.tiktok.com/@gear2705/video/7539746188468194573',
    cover: '/projects/leakfinder/cover.png',
    stack: ['Next.js', 'TypeScript', 'OSINT', 'AI'],
  },
  {
    slug: 'vuln-report-agent',
    title: 'GEARZ Vuln Report Agent',
    blurb:
      'AI-powered vulnerability report generator for bug bounty hunters. Paste tool output (ffuf, nuclei, Burp, curl) → gets severity, title, impact, PoC, and fixes, then saves to a private vault with export/share options.',
    github: 'https://github.com/Gearsoldier/gearz-vuln-report-agent',
    tiktok: 'https://www.tiktok.com/@gear2705/video/7535102156874009870',
    cover: '/projects/vuln-report-agent/cover.png',
    stack: ['Next.js', 'TypeScript', 'AI'],
  },
  {
    slug: 'neon-honeypot-llm',
    title: 'neon-honeypot LLM',
    blurb:
      'Cyberpunk LLM honeypot playground—try SQLi/XSS/Traversal/Prompt-Injection payloads and get detection highlights, scoring, and persona-style responses. Great for demoing model safety and red-teaming.',
    github: 'https://github.com/Gearsoldier/neon-honeypot-llm',
    tiktok: 'https://www.tiktok.com/@gear2705/video/7538442226226023735',
    cover: '/projects/neon-honeypot-llm/cover.png',
    stack: ['Node', 'TypeScript', 'LLM'],
  },
]
