"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface Leaf {
  id: number
  left: number
  size: number
  delay: number
  duration: number
  rotation: number
  type: "leaf1" | "leaf2" | "leaf3"
}

export function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([])

  useEffect(() => {
    // Create 15 leaves with random properties
    const newLeaves = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // random horizontal position (%)
      size: Math.random() * 20 + 10, // random size between 10-30px
      delay: Math.random() * 15, // random delay before animation starts
      duration: Math.random() * 10 + 10, // random duration between 10-20s
      rotation: Math.random() * 360, // random initial rotation
      type: ["leaf1", "leaf2", "leaf3"][Math.floor(Math.random() * 3)] as "leaf1" | "leaf2" | "leaf3",
    }))

    setLeaves(newLeaves)

    // Regenerate leaves every 20 seconds to keep the animation going
    const interval = setInterval(() => {
      setLeaves((prev) => {
        return prev.map((leaf) => ({
          ...leaf,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 10,
          rotation: Math.random() * 360,
        }))
      })
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-0 opacity-70 animate-falling"
          style={
            {
              left: `${leaf.left}%`,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              "--delay": `${leaf.delay}s`,
              "--duration": `${leaf.duration}s`,
              transform: `rotate(${leaf.rotation}deg)`,
            } as React.CSSProperties
          }
        >
          {leaf.type === "leaf1" && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-500">
              <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"
                fill="currentColor"
              />
              <path
                d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                fill="currentColor"
              />
            </svg>
          )}
          {leaf.type === "leaf2" && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-600">
              <path
                d="M17 8C8 10 5.9 16.17 5.9 16.17A6.5 6.5 0 0 1 12 21.5a6.5 6.5 0 0 1 6.5-6.5 6.5 6.5 0 0 1-1.5-7z"
                fill="currentColor"
              />
              <path
                d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5 9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2.5 12 9.5 9.5 0 0 1 12 2.5z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
          {leaf.type === "leaf3" && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-700">
              <path d="M12 2L4 12l8 10 8-10-8-10z" fill="currentColor" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

