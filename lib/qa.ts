// lib/qa.ts
// Tiny intent router for the recruiter chat — no network calls, zero deps.

export type QAResult = {
  text: string;
  followups: string[];
};

type Intent = {
  name: string;
  keywords: string[];
  answer: (q: string) => QAResult;
};

// ---------- helpers ----------
const rnd = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const tone = () =>
  rnd([
    "Short answer:",
    "Here’s the cinematic cut:",
    "In plain English:",
    "Dev-to-dev:",
    "Quick take:",
    "No fluff:",
  ]);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (q: string, needles: string[]) =>
  needles.some((k) => q.includes(k));

const scoreIntent = (q: string, intent: Intent): number => {
  let score = 0;
  for (const k of intent.keywords) {
    if (q.includes(k)) score += 2; // substring hit
  }
  // bonus for whole-word hits
  const words = new Set(q.split(" "));
  for (const k of intent.keywords) {
    if (words.has(k)) score += 1;
  }
  return score;
};

// ---------- knowledge ----------
const STACK_TEXT =
  `${tone()} full-stack: React/Next.js, TypeScript, Node/Python, Postgres + Prisma, ` +
  `Redis for queues/caching, Tailwind/UI polish, and LLM features where they make sense. ` +
  `Comfortable across infra (Vercel, Docker, CI/CD) and security-minded by background.`;

const intents: Intent[] = [
  {
    name: "stack",
    keywords: [
      "stack",
      "tech",
      "skills",
      "typescript",
      "react",
      "next",
      "node",
      "python",
      "database",
      "postgres",
      "prisma",
      "redis",
      "tailwind",
      "llm",
      "openai",
    ],
    answer: () => ({
      text: STACK_TEXT,
      followups: [
        "Show me your favorite project.",
        "How do you structure repos?",
        "What’s your testing approach?",
        "What’s your CI/CD setup?",
      ],
    }),
  },
  {
    name: "mvp",
    keywords: ["mvp", "prototype", "ship fast", "iterate", "iteration", "roadmap"],
    answer: () => ({
      text:
        `${tone()} scope laser-tight → build vertical slice end-to-end → ` +
        `ship behind a feature flag → watch real usage → iterate. I pick boring tech for the first cut, ` +
        `add observability from day one, and keep DX sharp so iteration stays cheap.`,
      followups: [
        "How do you de-risk unknowns?",
        "What’s your instrumentation stack?",
        "How do you decide when to refactor?",
      ],
    }),
  },
  {
    name: "auth",
    keywords: ["auth", "authentication", "authorization", "oauth", "jwt", "session"],
    answer: () => ({
      text:
        `${tone()} NextAuth/Auth.js for OAuth and email magic links when possible. ` +
        `JWTs or signed cookies depending on constraints; ` +
        `RBAC by default, feature flags for finer toggles, ` +
        `and middleware guards on sensitive routes. Secrets via env + CI/CD vars.`,
      followups: ["How do you handle roles?", "What about multi-tenant?", "SOC2-friendly notes?"],
    }),
  },
  {
    name: "testing",
    keywords: [
      "test",
      "testing",
      "unit",
      "integration",
      "e2e",
      "playwright",
      "cypress",
      "jest",
      "vitest",
    ],
    answer: () => ({
      text:
        `${tone()} unit tests for pure logic (Vitest/Jest), component tests with ` +
        `React Testing Library, and E2E via Playwright. I treat smoke tests and ` +
        `happy paths as first-class so shipping stays fast.`,
      followups: ["How do you test LLM features?", "How is test data seeded?", "What’s your coverage target?"],
    }),
  },
  {
    name: "cicd",
    keywords: ["cicd", "ci", "cd", "pipeline", "deploy", "vercel", "github actions"],
    answer: () => ({
      text:
        `${tone()} GitHub Actions for checks (typecheck, lint, tests) + preview builds. ` +
        `Vercel for production deploys and env management. I prefer “main” always shippable; ` +
        `feature flags for risky work.`,
      followups: ["Do you gate releases?", "How do you manage env vars?", "Rollbacks/playbooks?"],
    }),
  },
  {
    name: "projects",
    keywords: [
      "project",
      "projects",
      "portfolio",
      "leakfinder",
      "vuln",
      "report",
      "honeypot",
      "mini game",
      "minigame",
      "game",
    ],
    answer: () => ({
      text:
        `${tone()} highlights: LeakFinder (OSINT secret scan), Vuln Report Agent (AI report generator), ` +
        `and a neon mini-game baked into the site. Each shows shipping speed + polish.`,
      followups: ["Link me to LeakFinder.", "Tell me about the report agent.", "How’s the mini-game built?"],
    }),
  },
  {
    name: "minigame",
    keywords: ["mini game", "minigame", "game", "akira", "bike", "arcade"],
    answer: () => ({
      text:
        `${tone()} Akira-styled 2D canvas game. Arrows/WASD to steer, Space to boost, ` +
        `survive the drones and chain pickups. It’s a fun way to show off canvas, animation, input, and state.`,
      followups: ["Can the sidekick battle me?", "What powers are there?", "How’s collision handled?"],
    }),
  },
  {
    name: "availability",
    keywords: ["available", "availability", "open", "contract", "freelance", "hire", "start"],
    answer: () => ({
      text:
        `${tone()} US-based and open to contract/freelance. I can start quickly on scoped builds ` +
        `or jump into an existing codebase to get velocity up.`,
      followups: ["What’s your ideal scope?", "Time zone coverage?", "What’s your rate?"],
    }),
  },
  {
    name: "resume",
    keywords: ["resume", "cv", "pdf"],
    answer: () => ({
      text: `${tone()} Grab it here: /resume.pdf`,
      followups: ["What’s the best email?", "Any references?", "Where are you located?"],
    }),
  },
  {
    name: "contact",
    keywords: ["email", "contact", "reach"],
    answer: () => ({
      text: `${tone()} Email: joel.suarez0731@gmail.com — I actually reply.`,
      followups: ["Send your availability.", "Want a quick intro call?", "Share your GitHub too?"],
    }),
  },
  {
    name: "sidekick",
    keywords: ["sidekick", "assistant", "bot", "clippy"],
    answer: () => ({
      text:
        `${tone()} The little neon gremlin is a client-only sprite that quips, idles, ` +
        `and can pilot enemies for a duel (opt-in). It never steals player input.`,
      followups: ["Can it play the game now?", "How’s it implemented?", "Can we theme it for our brand?"],
    }),
  },
];

// ---------- public API ----------
export const greeting = (): QAResult => ({
  text:
    "Hey! I’m the recruiter bot. Ask about Joel’s stack, projects, availability, the mini-game, " +
    "or process (MVPs, auth, testing, CI/CD). I’ll keep it tight.",
  followups: [
    "What’s your stack?",
    "How do you ship MVPs?",
    "How do you handle auth?",
    "Tell me about the mini-game.",
  ],
});

export async function ask(raw: string): Promise<QAResult> {
  const q = normalize(raw);

  if (!q) {
    // Empty input → nudge politely
    return {
      text: "Shoot a question and I’ll keep it crisp. Stack, projects, MVPs, auth, testing—your pick.",
      followups: ["What’s your stack?", "Any favorite project?", "How do you test?"],
    };
  }

  // Quick direct routes for common phrasings
  if (includesAny(q, ["stack", "skill", "skills", "tech"])) {
    return intents.find((i) => i.name === "stack")!.answer(q);
  }
  if (includesAny(q, ["mini game", "minigame", "game", "akira"])) {
    return intents.find((i) => i.name === "minigame")!.answer(q);
  }

  // Score all intents and pick the best
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    const s = scoreIntent(q, intent);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }

  // Threshold: if nothing looks relevant, fall back with personality
  if (!best || bestScore < 2) {
    return {
      text:
        `${tone()} I didn’t catch a strong intent there, but here’s the TL;DR on Joel: ` +
        STACK_TEXT,
      followups: [
        "How do you ship MVPs?",
        "What’s your CI/CD?",
        "Tell me about a project you’re proud of.",
      ],
    };
  }

  return best.answer(q);
}
