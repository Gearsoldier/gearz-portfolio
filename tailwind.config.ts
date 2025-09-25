import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas',
          'Liberation Mono', 'Courier New', 'monospace'
        ],
      },
      colors: {
        gearz: {
          bg: '#0a0d12',
          card: '#0f1420',
          neon: '#00E5FF',
          accent: '#FF6A00',
          glow: '#7DF9FF',
        },
      },
      boxShadow: {
        neon: '0 0 25px rgba(0, 229, 255, 0.35)',
        accent: '0 0 25px rgba(255, 106, 0, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0, 229, 255, 0.0)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.35)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        scan: 'scan 8s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
