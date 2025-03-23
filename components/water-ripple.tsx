"use client"

import { useEffect, useRef } from "react"

export function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Water ripple effect variables
    const ripples: {
      x: number
      y: number
      radius: number
      maxRadius: number
      opacity: number
      speed: number
    }[] = []

    // Create initial ripples
    for (let i = 0; i < 5; i++) {
      createRipple()
    }

    // Create a new ripple
    function createRipple() {
      if (!canvas) return

      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 100 + 50,
        opacity: 0.7,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    // Animation loop
    function animate() {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update ripples
      for (let i = 0; i < ripples.length; i++) {
        const ripple = ripples[i]

        // Draw ripple
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(100, 200, 255, ${ripple.opacity})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Update ripple
        ripple.radius += ripple.speed
        ripple.opacity -= 0.001

        // Remove ripple if it's too big or transparent
        if (ripple.radius > ripple.maxRadius || ripple.opacity <= 0) {
          ripples.splice(i, 1)
          i--
          createRipple()
        }
      }

      // Occasionally add a new ripple
      if (Math.random() < 0.01) {
        createRipple()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />
}

