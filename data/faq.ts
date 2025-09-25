// data/faq.ts
export type QA = { q: string; a: string; tags?: string[]; link?: string };

export const FAQ: QA[] = [
  {
    q: "TL;DR",
    a: "Joel (GEARZ) — builds cinematic, AI-powered cybersecurity tools. Strengths: OSINT, detections, report automation, and UI polish. Fast builds with production finish.",
    tags: ["summary", "about", "overview"],
  },
  {
    q: "Top projects",
    a: [
      "• GEARZ LeakFinder — scan GitHub/npm/PyPI/DockerHub/Wayback/CICD for secrets; redaction-first; AI summary per run.",
      "• Vuln Report Agent — paste ffuf/nuclei/burp/curl → full report (severity, title, impact, PoC, fixes) saved to a vault.",
      "• neon-honeypot LLM — cyberpunk playground to probe prompts (SQLi/XSS/Traversal/Prompt Injection) with scoring & personas.",
    ].join("\n"),
    tags: ["projects", "portfolio", "work", "leakfinder", "report", "honeypot"],
  },
  {
    q: "GitHub",
    a: "https://github.com/Gearsoldier",
    link: "https://github.com/Gearsoldier",
    tags: ["code", "repos"],
  },
  {
    q: "TikTok demos",
    a: "https://www.tiktok.com/@gear2705",
    link: "https://www.tiktok.com/@gear2705",
    tags: ["video", "demos"],
  },
  {
    q: "Resume",
    a: "/resume.pdf",
    link: "/resume.pdf",
    tags: ["cv", "resume", "pdf"],
  },
  {
    q: "Email",
    a: "joel.suarez0731@gmail.com",
    link: "mailto:joel.suarez0731@gmail.com",
    tags: ["contact"],
  },
  {
    q: "Skills",
    a: "Splunk/Elastic • Wireshark • Shodan • OSINT & Recon • Bug Bounty • Python/TypeScript/Next.js • OpenAI/Ollama • Kali/WSL • Report Automation • MITRE ATT&CK",
    tags: ["skills", "stack", "technologies"],
  },
  {
    q: "Availability",
    a: "Open to freelance/contract security builds. Happy to discuss timelines & scope.",
    tags: ["availability", "hire"],
  },
  {
    q: "Location/Timezone",
    a: "US-based; flexible hours for async collab.",
    tags: ["location", "timezone"],
  },
]
