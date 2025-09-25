'use client'
import { useEffect, useState } from 'react'

type Fly = { id:number; left:string; top:string; size:string; delay:string; dur:string }

export default function Fireflies({ count = 20 }: { count?: number }) {
  const [flies, setFlies] = useState<Fly[] | null>(null)

  useEffect(() => {
    // Generate only on the client (after mount) to avoid SSR mismatch
    const arr: Fly[] = Array.from({ length: count }).map((_, i) => {
      const left = `${Math.random() * 100}%`
      const top = `${Math.random() * 100}%`
      const size = `${2 + Math.random() * 2}px`
      const delay = `${Math.random() * 6}s`
      const dur = `${6 + Math.random() * 6}s`
      return { id: i, left, top, size, delay, dur }
    })
    setFlies(arr)
  }, [count])

  if (!flies) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]" suppressHydrationWarning>
      {flies.map(f => (
        <span
          key={f.id}
          className="firefly"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            animationDelay: f.delay,
            animationDuration: f.dur,
          }}
        />
      ))}
    </div>
  )
}
