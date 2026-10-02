# GEARZ Portfolio

**A cinematic developer portfolio with a playable cyberpunk edge.**

A Next.js showcase for GEARZ's projects, demos, and contact links, paired with a neon particle backdrop, a canvas bike game, a reactive sidekick, and a compact recruiter chat.

> The recruiter chat runs locally using keyword-based answers in `lib/qa.ts`. The portfolio itself does not call an LLM, require an API key, or include a database-backed chat service.

[Run locally](#run-locally) · [Explore](#whats-inside) · [Customize](#customize-the-portfolio) · [Project map](#project-map) · [Review notes](#current-review-notes)

## What's inside

- **Project showcase:** cards backed by `data/projects.ts`, with local artwork and outbound repository/demo links
- **Portfolio content:** hero, skills, about, contact, and a downloadable résumé
- **Interactive backdrop:** canvas-based grid and particle effects
- **Bike mini-game:** playable on the home page and the dedicated `/play` route, with movement, boost, shields, and drone obstacles
- **Sidekick:** an animated companion that reacts to game events and remembers display preferences
- **Recruiter chat:** prepared answers, keyword routing, and follow-up suggestions, all in the browser
- **Soundtrack controls:** bundled audio and browser-local mute preferences

## Stack

| Area | Technology |
| --- | --- |
| Application | Next.js 15.5.4, App Router, React 19.1 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, custom CSS |
| Animation and game | Canvas 2D, browser events, React effects |
| Chat logic | Dependency-free intent router in `lib/qa.ts` |

These are the technologies used by this repository. Broader skills or technologies mentioned in the portfolio's personal copy are not all application dependencies.

## Run locally

Use Node.js and npm. The lockfile records Next.js's Node requirement as `^18.18.0 || ^19.8.0 || >=20.0.0`; choose a supported release that satisfies it. The repository does not pin a specific Node runtime.

```bash
git clone https://github.com/Gearsoldier/gearz-portfolio.git
cd gearz-portfolio
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No application environment variables are required for the current implementation.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development with Turbopack |
| `npm run lint` | Run ESLint explicitly |
| `npx tsc --noEmit` | Check TypeScript using the installed compiler |
| `npm run build` | Create a production build with Turbopack |
| `npm start` | Serve the production build |

Run lint and type checking separately before a release: `next.config.ts` explicitly disables ESLint during production builds. A successful build alone is not a lint pass. No automated test script is currently provided.

## Mini-game controls

| Key | Action |
| --- | --- |
| Arrow keys or WASD | Move |
| Space | Boost while energy is available |
| B | Activate the shield when its cooldown has elapsed |
| H | Show or hide the sidekick on the home page |
| M | Toggle music |

The bike controls are keyboard-based and ignore input/textarea typing targets. The `/play` route mounts the game and global audio, but does not mount the home-page sidekick. Touch controls are not implemented.

If the home-page chat takes focus, click away from the text field before playing. Audio playback may wait for a user gesture because of browser autoplay rules.

## Customize the portfolio

| Change | Start here |
| --- | --- |
| Main headline, about text, skills, and contact links | `app/page.tsx` |
| Browser title and description | `app/layout.tsx` |
| Featured projects | `data/projects.ts` |
| Active recruiter-chat answers | `lib/qa.ts` |
| Chat layout and follow-up buttons | `components/ChatDock.tsx` |
| Game behavior and drawing | `components/BikeGame.tsx` |
| Sidekick behavior | `components/Sidekick.tsx` and `components/SidekickSprite.tsx` |
| Shared visual styling | `app/globals.css` |
| Artwork, project covers, music, and résumé | `public/` |

`data/profile.ts` and `data/faq.ts` support the separate `RecruiterChat.tsx` component. The home page currently mounts `ChatDock.tsx`, which uses `lib/qa.ts` instead. Changing those data files alone will not update the active chat.

Keep claims, availability, contact details, project links, and résumé content consistent across the page and chat. Reuse only images, audio, fonts, and résumé content you have permission to publish.

## Project map

```text
app/
  page.tsx                Portfolio home
  play/page.tsx           Dedicated game page
  layout.tsx              Site metadata and global audio
  globals.css             Shared styles
components/
  BackgroundCanvas.tsx    Neon canvas backdrop
  BikeGame.tsx            Canvas game
  ChatDock.tsx            Active recruiter chat
  ProjectCard.tsx         Featured-project presentation
  Sidekick.tsx            Companion behavior and controls
  MusicToggle.tsx         Home-page music control
  SiteAudio.tsx           Global audio control
lib/qa.ts                 Local keyword-based chat answers
data/                     Project and alternate-chat data
public/                   Images, audio, and résumé PDF
```

## Current review notes

- **Two audio systems are mounted on the home page:** `SiteAudio` comes from the root layout and `MusicToggle` comes from the home page. They use different preference keys and controls; review duplicate playback and shortcut behavior before deployment
- **Chat content is authored, not generated:** Replies are chosen by keyword matching and canned answer functions. It cannot reliably answer questions outside that content or verify live availability
- **Game state is local:** The current game does not provide server-persisted scores or a shared leaderboard
- **Accessibility needs hands-on review:** Check keyboard focus, reduced-motion needs, small-screen overlays, audio controls, and the keyboard-only game before presenting the site as fully accessible
- **Demo links are external:** Their availability and content are managed outside this repository

Chat messages remain in component state and are not sent to an inference service by the active chat implementation. Music and sidekick preferences use browser storage. This is a code-level description, not an audit of a deployed host or third-party links.

## Deployment and review

The app uses the standard Next.js production workflow: build with `npm run build`, then run `npm start` on a compatible Node host. A hosting provider's Next.js integration may handle those steps for you.

Before publishing, check the home page and `/play`, project links, résumé download, chat suggestions, game controls, music after navigation, and a narrow viewport. Also run lint and TypeScript checks explicitly. No live deployment status or passing build is implied by this README.

## Credits and reuse

Originally bootstrapped with `create-next-app`. Built with Next.js, React, and Tailwind CSS. The bike-game presentation draws on a cyberpunk / Akira-inspired visual direction.

No standalone license is included in this repository. Confirm permission before redistributing the code or bundled media; the résumé and personal branding are not generic template content.
