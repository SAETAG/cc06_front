"use client"

import { useState, useEffect } from "react"
import { Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface QuestHeaderProps {
  exp: number
}

export function QuestHeader({ exp }: QuestHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeLeft, setTimeLeft] = useState("")

  // Calculate level based on exp (simple formula)
  const level = Math.floor(exp / 100) + 1
  const expToNextLevel = level * 100 - exp
  const progress = exp % 100

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Calculate time until midnight
      const tomorrow = new Date()
      tomorrow.setHours(24, 0, 0, 0)
      const diff = tomorrow.getTime() - new Date().getTime()

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format date in Japanese style
  const formattedDate = currentTime.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-sm p-8 rounded-lg border-2 border-yellow-500/50 shadow-xl">
        {/* Gold decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 opacity-70" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 opacity-70" />
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-300 opacity-70" />
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-300 opacity-70" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-lg" />

        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            鍛練の森デイリークエスト
          </h1>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            <div className="text-amber-200 text-lg text-center px-4 py-2 bg-amber-950/30 rounded-full border border-amber-500/30">
              {formattedDate}
            </div>
            <div className="flex items-center text-yellow-300 px-4 py-2 bg-amber-950/30 rounded-full border border-amber-500/30">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-mono">残り時間: {timeLeft}</span>
            </div>
          </div>

          {/* Divider with gold accent */}
          <div className="w-full max-w-2xl relative my-4">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-amber-700/50" />
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-900 border-2 border-yellow-400 rounded-full" />
          </div>

          {/* User Profile Section */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 relative bg-amber-900/40 p-4 rounded-lg border border-yellow-500/30 max-w-xl w-full">
            <Avatar className="h-16 w-16 ring-2 ring-yellow-400 ring-offset-2 ring-offset-amber-900">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User avatar" />
              <AvatarFallback className="bg-amber-700">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <span className="text-sm text-amber-200">Lv.</span>
                <span className="text-2xl font-bold text-yellow-300 ml-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {level}
                </span>
              </div>
              <div className="w-48 mt-2 relative">
                <Progress value={progress} className="h-3 bg-amber-950 border border-amber-600/30" />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div className="text-sm text-amber-300 mt-2 flex items-center">
                <span className="text-yellow-400 font-semibold mr-1">{progress}</span>
                <span>/</span>
                <span className="text-amber-400 font-semibold ml-1">100</span>
                <span className="ml-2">次のレベルまで: {expToNextLevel} EXP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-3 -left-3 w-16 h-16 bg-amber-600/40 rounded-full blur-md -z-10" />
      <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-orange-600/30 rounded-full blur-md -z-10" />

      {/* Gold shine effect */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-yellow-400/30 to-transparent blur-xl" />
    </div>
  )
}

