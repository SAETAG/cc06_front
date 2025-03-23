"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Heart, Save, AlertCircle } from "lucide-react"

// Feeling type definition
type Feeling = {
  id: string
  text: string
  selected: boolean
}

export default function Stage11BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [showMaxSelectedAlert, setShowMaxSelectedAlert] = useState(false)

  const router = useRouter()

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize feelings with random positions
  useEffect(() => {
    if (!isClient) return

    const feelingTexts = [
      "スッキリできた！",
      "断捨離成功！",
      "整頓完了！",
      "お気に入り配置できた！",
      "無駄一掃できた！",
      "色別に並べられた！",
      "レイアウト完璧！",
      "収納革命達成！",
      "アクセント際立った！",
      "スペース最大活用！",
      "なかなか捨てきれなかった…",
      "迷いが多かった…",
      "思い出に引きずられた…",
      "もっと断固とすべきだった！",
      "決断が遅れた反省！",
      "整理の達人になった！",
      "全体バランス良好！",
      "未来への一歩踏み出した！",
      "クローゼット変身完了！",
      "驚きの整理力発揮！",
      "完璧な調和が生まれた！",
      "使いやすさ抜群！",
      "見た目が輝いた！",
      "収納美学を極めた！",
      "一新された空間！",
      "整理上手の証明！",
      "次回はもっと大胆に！",
      "後回しにしがちな部分反省！",
      "余計なものを見直した！",
      "次回に向けてさらに進化したい！",
    ]

    // 単純な配列に変更
    const initialFeelings = feelingTexts.map((text, index) => {
      return {
        id: `feeling-${index}`,
        text,
        selected: false,
      }
    })

    setFeelings(initialFeelings)
  }, [isClient])

  // シンプルな音声初期化 - クライアントサイドでのみ実行
  useEffect(() => {
    if (!isClient) return

    try {
      const audioElement = new Audio("/stepfight_11.mp3")
      audioElement.loop = true
      audioElement.volume = 0.7
      audioElement.preload = "auto"

      // オーディオの読み込み状態を監視
      audioElement.addEventListener("canplaythrough", () => {
        console.log("Audio loaded and ready to play")

        try {
          audioElement.play().catch((error) => {
            console.log("Auto-play was prevented:", error)
          })
        } catch (error) {
          console.log("Audio play error:", error)
        }
      })

      // エラーハンドリングを改善
      audioElement.addEventListener("error", () => {
        console.log("Audio could not be loaded, continuing without sound")
      })

      setAudio(audioElement)

      return () => {
        audioElement.pause()
        audioElement.src = ""
      }
    } catch (error) {
      console.log("Audio initialization error, continuing without sound:", error)
    }
  }, [isClient])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (!audio || !isClient) return

    try {
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
    } catch (error) {
      console.log("Audio control error, continuing without sound")
    }
  }, [isMuted, audio, isClient])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (!audio || !isClient) return

    if (audio.paused && !isMuted) {
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
    tryPlayAudio()
  }

  // Get selected feelings count
  const selectedFeelingsCount = feelings.filter((f) => f.selected).length

  // Toggle feeling selection - only allow 3 selections
  const toggleFeeling = (id: string) => {
    const feeling = feelings.find((f) => f.id === id)

    // If already selected, just deselect it
    if (feeling?.selected) {
      setFeelings(feelings.map((f) => (f.id === id ? { ...f, selected: false } : f)))
      setShowMaxSelectedAlert(false)
      tryPlayAudio()
      return
    }

    // If not selected but already have 3 selections, show alert
    if (selectedFeelingsCount >= 3) {
      setShowMaxSelectedAlert(true)
      setTimeout(() => setShowMaxSelectedAlert(false), 3000) // Hide alert after 3 seconds
      tryPlayAudio()
      return
    }

    // Otherwise, select it
    setFeelings(feelings.map((f) => (f.id === id ? { ...f, selected: true } : f)))
    setShowMaxSelectedAlert(false)
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
        selectedFeelings: feelings.filter((f) => f.selected).map((f) => f.text),
      })

      // Navigate to clear page
      router.push("/closet/11/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col" onClick={isClient ? tryPlayAudio : undefined}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-teal-900 to-purple-900 p-3 flex justify-between items-center border-b-2 border-yellow-500 shadow-md relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500"></div>

        <div className="flex items-center gap-2">
          <Link href="/closet/11">
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
              記録の書庫 - 戦闘フェーズ
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
          {/* Feelings section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">今の気持ちを記録しよう！</h2>
            <p className="text-white text-center mb-8">
              以下の中から、あなたの気持ちに最も近いものを<span className="text-yellow-300 font-bold">3つだけ</span>
              選んでください。
            </p>

            {/* Max selection alert */}
            {showMaxSelectedAlert && (
              <div className="bg-red-900/70 border border-red-500 text-white p-3 rounded-lg mb-4 flex items-center gap-2 animate-pulse">
                <AlertCircle className="h-5 w-5 text-red-300" />
                <span>3つまでしか選択できません！他の選択を解除してから選んでください。</span>
              </div>
            )}

            {/* Floating feelings container */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {feelings.map((feeling) => (
                <button
                  key={feeling.id}
                  onClick={() => toggleFeeling(feeling.id)}
                  className={`relative transition-all duration-300 rounded-lg p-3 flex items-center
        ${
          feeling.selected
            ? "bg-gradient-to-r from-pink-600 to-purple-700 border-2 border-yellow-300 shadow-lg transform scale-105"
            : "bg-gradient-to-r from-teal-700 to-blue-800 border border-teal-500 hover:border-teal-400 hover:shadow"
        }`}
                >
                  <div className="flex-1 text-left">
                    <span className={`${feeling.selected ? "text-white font-bold" : "text-white"}`}>
                      {feeling.text}
                    </span>
                  </div>
                  {feeling.selected && <Heart className="h-5 w-5 ml-2 text-pink-300 fill-pink-300 animate-pulse" />}
                </button>
              ))}
            </div>

            {/* Selected feelings counter */}
            <div className="bg-teal-800 bg-opacity-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white">選択した気持ち:</span>
                <span className={`font-bold ${selectedFeelingsCount === 3 ? "text-green-400" : "text-yellow-300"}`}>
                  {selectedFeelingsCount} / 3
                </span>
              </div>
              <div className="w-full bg-teal-950 rounded-full h-2.5 mt-2">
                <div
                  className={`${
                    selectedFeelingsCount === 3 ? "bg-green-500" : "bg-gradient-to-r from-pink-500 to-purple-500"
                  } h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${(selectedFeelingsCount / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Selected feelings display */}
            <div className="bg-teal-800/30 rounded-lg p-4 border border-teal-700">
              <h3 className="text-lg font-bold text-yellow-300 mb-3">選択した気持ち:</h3>
              {selectedFeelingsCount === 0 ? (
                <p className="text-teal-300 italic">まだ選択されていません</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {feelings
                    .filter((f) => f.selected)
                    .map((feeling) => (
                      <div
                        key={feeling.id}
                        className="bg-gradient-to-r from-pink-600 to-purple-700 px-3 py-1 rounded-full text-white font-medium flex items-center gap-1"
                      >
                        <Heart className="h-3 w-3 fill-pink-300" />
                        {feeling.text}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                tryPlayAudio()
                saveRecord()
              }}
              disabled={isSaving || selectedFeelingsCount !== 3}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  気持ちを記録する
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

