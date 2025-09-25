// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import SiteAudio from '@/components/SiteAudio'

export const metadata: Metadata = {
  title: 'GEARZ — cinematic, AI-powered cybersecurity tools',
  description:
    'OSINT → payloads → honeypots → reporting. Fast builds with production polish.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="scanlines">
        {children}
        {/* Global looping soundtrack with mute toggle */}
        <SiteAudio />
      </body>
    </html>
  )
}
