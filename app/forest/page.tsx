"use client"

import { useState, useEffect, useRef } from "react"
import { QuestHeader } from "@/components/quest-header"
import { ChallengeCard } from "@/components/challenge-card"
import { challenges } from "@/lib/data"
import { FallingLeaves } from "@/components/falling-leaves"
import { Volume2, VolumeX, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForestChallenge() {
  const [userChallenges, setUserChallenges] = useState(challenges)
  const [userExp, setUserExp] = useState(0)
  const [showReward, setShowReward] = useState<{ exp: number; item?: string } | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on client side
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/forest.mp3")

    if (audioRef.current) {
      // Set audio properties
      audioRef.current.loop = true
      audioRef.current.volume = 0.5

      // Play audio if sound is enabled
      if (soundEnabled) {
        audioRef.current.play().catch((error) => {
          console.log("Audio autoplay failed:", error)
          // Many browsers require user interaction before playing audio
        })
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.play().catch((error) => {
          console.log("Audio play failed:", error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [soundEnabled])

  // Toggle sound function
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev)
  }

  // 効果音用の参照を追加
  const effectSoundRef = useRef<HTMLAudioElement | null>(null)

  // Play completion sound effect
  const playCompletionSound = () => {
    // 効果音なし - バックグラウンド音楽のみ
  }

  const completeChallenge = (id: string) => {
    setUserChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.id === id && !challenge.completed) {
          // Show reward animation
          setShowReward({ exp: challenge.expReward, item: challenge.itemReward })
          setTimeout(() => setShowReward(null), 3000)

          // Add experience
          setUserExp((prev) => prev + challenge.expReward)

          // 効果音は不要なので削除

          return { ...challenge, completed: true }
        }
        return challenge
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 to-orange-800 text-white relative overflow-hidden">
      {/* Top navigation bar - icons only */}
      <div className="fixed top-0 right-0 z-50 p-2 flex items-center gap-2">
        <Link href="/home">
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-amber-900/60 text-yellow-300 hover:text-yellow-200 hover:bg-amber-800/70 border border-yellow-500/30"
          >
            <Home className="w-5 h-5" />
            <span className="sr-only">ホーム</span>
          </Button>
        </Link>

        <Button
          size="icon"
          variant="ghost"
          className="w-10 h-10 rounded-full bg-amber-900/60 text-yellow-300 hover:text-yellow-200 hover:bg-amber-800/70 border border-yellow-500/30"
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          <span className="sr-only">{soundEnabled ? "サウンド オン" : "サウンド オフ"}</span>
        </Button>
      </div>

      {/* Forest background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat" />
      </div>
      <FallingLeaves />

      {/* Leaves decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-green-300 rotate-45" />
        <div className="absolute top-5 right-20 w-16 h-16 rounded-full bg-green-400 rotate-12" />
        <div className="absolute top-20 right-5 w-24 h-12 rounded-full bg-green-500 -rotate-12" />
      </div>

      {/* Gold decorative elements */}
      <div className="absolute left-0 right-0 top-16 h-40 overflow-hidden opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-yellow-400 blur-xl" />
        <div className="absolute top-10 right-1/3 w-40 h-40 rounded-full bg-amber-500 blur-xl" />
        <div className="absolute top-5 left-2/3 w-24 h-24 rounded-full bg-yellow-500 blur-xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-6">
        {/* Full width header with user profile inside */}
        <div className="w-full mb-8">
          <QuestHeader exp={userExp} />
        </div>

        <main className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} onComplete={completeChallenge} />
            ))}
          </div>
        </main>

        {/* Reward animation */}
        {showReward && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-lime-700/90 text-white text-2xl font-bold px-8 py-6 rounded-lg shadow-lg animate-bounce border-2 border-lime-400/50">
              <div className="text-lime-300 text-3xl mb-2">+{showReward.exp} EXP</div>
              {showReward.item && (
                <div className="text-cyan-300 flex items-center justify-center">
                  <span>獲得アイテム: {showReward.item}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

