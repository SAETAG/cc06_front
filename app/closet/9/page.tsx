"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Play } from "lucide-react"

export default function Stage9Page() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/steptitle.mp3")
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

  // Handle video playback
  const playTutorial = () => {
    setShowVideo(true)

    // Pause the background music while the video is playing
    if (audio) {
      audio.pause()
    }

    // 動画再生ボタンクリック時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true)

    // Resume the background music when the video ends
    if (audio && !isMuted) {
      try {
        audio.play().catch((error) => {
          console.log("Could not resume audio:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
      }
    }
  }

  // Close video modal
  const closeVideo = () => {
    setShowVideo(false)

    // Resume the background music when the video is closed
    if (audio && !isMuted) {
      try {
        audio.play().catch((error) => {
          console.log("Could not resume audio:", error)
        })
      } catch (error) {
        console.log("Play error:", error)
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
              ステージ 9
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
        <div className="max-w-2xl w-full bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
          {/* Stage title and description */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              時の洞窟　～使用頻度で並べる～
            </h1>
            <p className="text-white text-base sm:text-lg">
              「時を司る洞窟では、モノの使用頻度を見極めねばならない…。」
            </p>
          </div>

          {/* Hourglass icon */}
          <div className="flex justify-center mb-8">
            <div className="text-7xl animate-pulse">⏳</div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={playTutorial}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 border border-blue-400 shadow-lg"
            >
              <Play className="h-5 w-5" />
              まずは戦い方（片付け方）を動画で予習する
            </Button>

            <Link href="/closet/9/battle">
              <Button
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg border border-red-400 shadow-lg"
                onClick={tryPlayAudio}
              >
                戦う（片付ける）
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Video modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-teal-900 rounded-xl p-4 max-w-3xl w-full border-2 border-yellow-500 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-300">チュートリアル動画</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={closeVideo}
                className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700"
              >
                閉じる
              </Button>
            </div>

            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src="/step9_tutorial.mp4"
                controls
                autoPlay
                className="w-full h-full"
                onEnded={handleVideoEnd}
              />
            </div>

            {videoEnded && (
              <div className="mt-4 text-center">
                <p className="text-white mb-2">動画を見終わりました！準備はできましたか？</p>
                <Link href="/closet/9/battle">
                  <Button
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
                    onClick={tryPlayAudio}
                  >
                    戦いに進む
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

