"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Sword, Shield } from "lucide-react"

export default function Stage14() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // 音声の初期化のみを行い、自動再生はしない
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/steptitle.mp3")
      audioRef.current.preload = "auto"

      // 音声の読み込み完了を検知
      audioRef.current.addEventListener("canplaythrough", () => {
        setAudioReady(true)
      })

      // エラーハンドリング
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // ページ内のどこかをクリックしたときに音声再生を試みる
  const tryPlayAudio = () => {
    if (audioRef.current && audioReady && !isMuted) {
      audioRef.current.play().catch((error) => {
        console.log("Audio playback failed, this is expected if no user interaction yet:", error)
      })
    }
  }

  const handleStartBattle = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    router.push("/closet/14/battle")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted

      // ミュート解除時に再生を試みる
      if (!isMuted && audioRef.current.paused && audioReady) {
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed on unmute:", error)
        })
      }
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
          <Link href="/closet">
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
              最終決戦
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
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gradient-to-r from-purple-900/80 to-teal-900/80 p-6 rounded-lg border-2 border-yellow-400 mb-6 relative overflow-hidden">
          {/* 背景エフェクト */}
          <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/30"></div>

          <div className="text-center mb-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] tracking-wider uppercase">
              時は、満ちた。さぁ、最終決戦の幕開けだ！
            </h2>

            <div className="bg-purple-900/50 p-6 rounded-lg border-2 border-red-500 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <h3 className="text-xl font-semibold text-white mb-3">ミッション:</h3>
              <p className="text-3xl font-bold text-red-400 mb-4 tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(248,113,113,0.6)]">
                最終決戦
              </p>

              <div className="flex justify-center items-center gap-4 mt-4">
                <div className="relative">
                  <Sword className="h-16 w-16 text-yellow-300 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-ping"></div>
                </div>
                <div className="relative">
                  <Shield className="h-16 w-16 text-yellow-300 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-[pulse_2s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-ping delay-300"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={handleStartBattle}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-lg border-2 border-red-400 shadow-lg transition duration-300 animate-pulse text-xl relative overflow-hidden group"
              >
                <span className="relative z-10">最終決戦開始！</span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/30 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

