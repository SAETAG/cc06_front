"use client"

import { useEffect, useState, useRef } from "react"

interface Cloud {
  id: number
  left: number
  top: number
  size: number
  opacity: number
  speed: number
}

export function CloudEffects() {
  const [clouds, setClouds] = useState<Cloud[]>([])
  const animationFrameIdRef = useRef<number>(0)

  useEffect(() => {
    // 雲のエフェクトをより薄いモヤモヤした形状に変更し、数を減らします
    // Create initial clouds
    const initialClouds = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 50,
      size: Math.random() * 200 + 100,
      opacity: Math.random() * 0.2 + 0.1, // より薄く
      speed: Math.random() * 0.03 + 0.005, // よりゆっくり
    }))

    setClouds(initialClouds)

    // Animation frame for cloud movement
    let lastTimestamp = 0

    const animateClouds = (timestamp: number) => {
      // Only update every 50ms for performance
      if (timestamp - lastTimestamp > 50) {
        lastTimestamp = timestamp

        setClouds((prevClouds) =>
          prevClouds.map((cloud) => {
            // Move cloud from left to right
            let newLeft = cloud.left + cloud.speed

            // Reset cloud position when it goes off-screen
            if (newLeft > 120) {
              newLeft = -20
              return {
                ...cloud,
                left: newLeft,
                top: Math.random() * 50,
                size: Math.random() * 200 + 100,
                opacity: Math.random() * 0.2 + 0.1,
                speed: Math.random() * 0.03 + 0.005,
              }
            }

            return {
              ...cloud,
              left: newLeft,
            }
          }),
        )
      }

      animationFrameIdRef.current = requestAnimationFrame(animateClouds)
    }

    animationFrameIdRef.current = requestAnimationFrame(animateClouds)

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute rounded-full bg-white blur-3xl"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.5}px`, // より平たく
            opacity: cloud.opacity,
            filter: "blur(40px)", // よりぼやけさせる
          }}
        />
      ))}
    </div>
  )
}

