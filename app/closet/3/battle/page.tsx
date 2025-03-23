"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, VolumeX, ArrowLeft, Home } from "lucide-react"

export default function Stage3BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/stepfight_3.mp3")
    audioElement.loop = true
    audioElement.volume = 0.7
    setAudio(audioElement)

    try {
      audioElement.play().catch((error) => {
        console.log("Auto-play was prevented:", error)
      })
    } catch (error) {
      console.log("Audio play error:", error)
    }

    return () => {
      audioElement.pause()
      audioElement.src = ""
    }
  }, [])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted

      // ミュート解除時に再生を試みる
      if (!isMuted && audio.paused) {
        try {
          audio.play().catch((error) => {
            console.log("Play on unmute failed:", error)
          })
        } catch (error) {
          console.log("Play error:", error)
        }
      }
    }
  }, [isMuted, audio])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (audio && audio.paused && !isMuted) {
      try {
        audio.play().catch((error) => {
          console.log("Play on screen tap failed:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
      }
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Update progress
  const updateProgress = (value: number) => {
    setProgress(value)

    // 進捗ボタンクリック時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        progress,
      })

      // Navigate to clear page
      router.push("/closet/3/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col" onClick={tryPlayAudio}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet/3">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
              虚無の広間 - 戦闘フェーズ
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Link href="/home">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center p-4 overflow-auto">
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">クローゼットの中身をすべて出そう</h2>

          <p className="text-white mb-6 text-center">
            クローゼットの中身をすべて取り出して、何があるのか確認しましょう。
            <br />
            すべてのアイテムを取り出したら、進捗状況を更新してください。
          </p>

          {/* Progress section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">進捗状況</h3>
            <p className="text-white mb-2">クローゼットの中身をどれくらい取り出しましたか？</p>

            <div className="space-y-4">
              <Progress value={progress} className="h-3 bg-teal-800" />

              <div className="flex justify-between">
                <Button
                  onClick={() => updateProgress(25)}
                  variant={progress === 25 ? "default" : "outline"}
                  className={
                    progress === 25 ? "bg-yellow-500 text-purple-900" : "bg-teal-800 text-white border-teal-600"
                  }
                >
                  25%
                </Button>
                <Button
                  onClick={() => updateProgress(50)}
                  variant={progress === 50 ? "default" : "outline"}
                  className={
                    progress === 50 ? "bg-yellow-500 text-purple-900" : "bg-teal-800 text-white border-teal-600"
                  }
                >
                  50%
                </Button>
                <Button
                  onClick={() => updateProgress(75)}
                  variant={progress === 75 ? "default" : "outline"}
                  className={
                    progress === 75 ? "bg-yellow-500 text-purple-900" : "bg-teal-800 text-white border-teal-600"
                  }
                >
                  75%
                </Button>
                <Button
                  onClick={() => updateProgress(100)}
                  variant={progress === 100 ? "default" : "outline"}
                  className={
                    progress === 100 ? "bg-yellow-500 text-purple-900" : "bg-teal-800 text-white border-teal-600"
                  }
                >
                  100%
                </Button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || progress < 100}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "保存中..." : "すべて取り出した！"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

