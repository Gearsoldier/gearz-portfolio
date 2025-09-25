// data/profile.ts
export type Profile = {
  name: string
  handle: string
  title: string
  email: string
  resumePath: string
  bio: string
  availability: string
  skills: string[]
  links: { label: string; href: string }[]
}

export const profile: Profile = {
  name: 'Joel "GEARZ" Suarez',
  handle: 'gearz',
  title: 'AI x Cybersecurity Builder',
  email: 'joel.suarez0731@gmail.com',
  resumePath: '/resume.pdf',
  bio:
    'I build AI-powered security tools with a cinematic, neon vibe — OSINT, detections, honeypots, and report automation. Fast builds with production polish.',
  availability: 'US-based. Open to contract/freelance and FT.',
  skills: [
    'OSINT / Shodan',
    'Bug Bounty',
    'Splunk / Elastic',
    'Wireshark',
    'Python',
    'TypeScript / Next.js',
    'OpenAI / LLMs',
    'Kali / WSL',
    'MITRE ATT&CK',
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/Gearsoldier' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@gear2705' },
  ],
}
