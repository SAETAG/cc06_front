"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Clock, Star, Sparkles, Calendar, Sun, Hourglass } from "lucide-react"

export default function Stage9BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [frequencyChecked, setFrequencyChecked] = useState(Array(5).fill(false))
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true)
  }, [])

  // シンプルな音声初期化 - クライアントサイドでのみ実行
  useEffect(() => {
    if (!isClient) return

    try {
      const audioElement = new Audio("/stepfight_9.mp3")
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

  // Toggle frequency checked
  const toggleFrequency = (index: number) => {
    const newFrequencyChecked = [...frequencyChecked]
    newFrequencyChecked[index] = !newFrequencyChecked[index]
    setFrequencyChecked(newFrequencyChecked)

    // チェックボックス操作時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // 「atLeastThreeChecked」を「allCategoriesChecked」に変更し、条件を全て選択されているかどうかに変更
  // Check if all frequencies are checked
  const allCategoriesChecked = frequencyChecked.every((checked) => checked)

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        frequencyChecked,
      })

      // Navigate to clear page
      router.push("/closet/9/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  // 使用頻度カテゴリの定義
  const frequencyCategories = [
    {
      id: "daily",
      title: "毎日使うもの（デイリー）を分けた！",
      description: "👉 下着、靴下、お気に入りのTシャツなど、毎日使うアイテム",
      icon: <Star className="h-6 w-6" />,
      bgColor: "from-green-800 to-green-900",
      selectedBgColor: "from-green-600 to-green-700",
      borderColor: "border-green-700",
      selectedBorderColor: "border-green-400",
      textColor: "text-green-300",
      selectedTextColor: "text-green-100",
      sparkleColor: "text-green-300",
    },
    {
      id: "weekly",
      title: "週に数回使うもの（ウィークリー）を分けた！",
      description: "👉 仕事着、普段着など、週に何度か着るアイテム",
      icon: <Calendar className="h-6 w-6" />,
      bgColor: "from-blue-800 to-blue-900",
      selectedBgColor: "from-blue-600 to-blue-700",
      borderColor: "border-blue-700",
      selectedBorderColor: "border-blue-400",
      textColor: "text-blue-300",
      selectedTextColor: "text-blue-100",
      sparkleColor: "text-blue-300",
    },
    {
      id: "monthly",
      title: "月に数回使うもの（マンスリー）を分けた！",
      description: "👉 特別な日の服、趣味の服など、月に数回使うアイテム",
      icon: <Sun className="h-6 w-6" />,
      bgColor: "from-yellow-800 to-yellow-900",
      selectedBgColor: "from-yellow-600 to-yellow-700",
      borderColor: "border-yellow-700",
      selectedBorderColor: "border-yellow-400",
      textColor: "text-yellow-300",
      selectedTextColor: "text-yellow-100",
      sparkleColor: "text-yellow-300",
    },
    {
      id: "seasonal",
      title: "季節ごとに使うもの（シーズナル）を分けた！",
      description: "👉 冬のコート、夏の水着など、特定の季節だけ使うアイテム",
      icon: <Sparkles className="h-6 w-6" />,
      bgColor: "from-orange-800 to-orange-900",
      selectedBgColor: "from-orange-600 to-orange-700",
      borderColor: "border-orange-700",
      selectedBorderColor: "border-orange-400",
      textColor: "text-orange-300",
      selectedTextColor: "text-orange-100",
      sparkleColor: "text-orange-300",
    },
    {
      id: "rare",
      title: "年に数回しか使わないもの（アニュアル・レア）を分けた！",
      description: "👉 冠婚葬祭の服、特別なイベント用の服など、めったに使わないアイテム",
      icon: <Hourglass className="h-6 w-6" />,
      bgColor: "from-purple-800 to-purple-900",
      selectedBgColor: "from-purple-600 to-purple-700",
      borderColor: "border-purple-700",
      selectedBorderColor: "border-purple-400",
      textColor: "text-purple-300",
      selectedTextColor: "text-purple-100",
      sparkleColor: "text-purple-300",
    },
  ]

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
          <Link href="/closet/9">
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
              時の洞窟 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">使用頻度順に並べ替える</h2>

          <p className="text-white mb-6 text-center">
            前のステージでグルーピングしたグループ毎に、さらに使用頻度順に並べ替えてみよう。
            <br />
            以下の使用頻度カテゴリを参考に、「賢者の箱」の中身を並べ替えてください。
          </p>

          {/* Frequency categories */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">使用頻度カテゴリ</h3>

            <div className="space-y-4">
              {frequencyCategories.map((category, index) => (
                <div
                  key={category.id}
                  onClick={() => toggleFrequency(index)}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 rounded-lg border-2 p-5 shadow-md
                    ${
                      frequencyChecked[index]
                        ? `bg-gradient-to-r ${category.selectedBgColor} ${category.selectedBorderColor} shadow-[0_0_15px_rgba(255,255,255,0.2)]`
                        : `bg-gradient-to-r ${category.bgColor} ${category.borderColor} hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                    }`}
                >
                  {/* キラキラエフェクト（選択時のみ表示） */}
                  {frequencyChecked[index] && (
                    <>
                      <div className="absolute top-2 right-2 animate-pulse">
                        <Sparkles className={`h-4 w-4 ${category.sparkleColor}`} />
                      </div>
                      <div className="absolute top-4 right-6 animate-pulse delay-100">
                        <Sparkles className={`h-3 w-3 ${category.sparkleColor}`} />
                      </div>
                      <div className="absolute bottom-3 right-4 animate-pulse delay-200">
                        <Sparkles className={`h-3 w-3 ${category.sparkleColor}`} />
                      </div>
                      <div className="absolute top-1/2 right-12 animate-pulse delay-300">
                        <Sparkles className={`h-2 w-2 ${category.sparkleColor}`} />
                      </div>
                    </>
                  )}

                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 
                      ${
                        frequencyChecked[index]
                          ? `bg-opacity-80 border-2 ${category.selectedBorderColor} shadow-[0_0_10px_rgba(255,255,255,0.3)]`
                          : `bg-opacity-50 border ${category.borderColor}`
                      }`}
                    >
                      <div className={frequencyChecked[index] ? category.selectedTextColor : category.textColor}>
                        {category.icon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`font-bold text-lg ${frequencyChecked[index] ? category.selectedTextColor : category.textColor}`}
                      >
                        {category.title}
                      </h4>
                      <p className="text-white text-sm mt-1">{category.description}</p>
                    </div>

                    {/* 選択インジケーター */}
                    {frequencyChecked[index] && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20 border border-white">
                        <svg
                          className={`w-5 h-5 ${category.selectedTextColor}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white">選択したカテゴリ:</span>
              <span className={`font-bold ${allCategoriesChecked ? "text-green-400" : "text-yellow-300"}`}>
                {frequencyChecked.filter(Boolean).length} / 5
              </span>
            </div>
            <div className="w-full bg-teal-950 rounded-full h-2.5 mt-2">
              <div
                className={`${
                  allCategoriesChecked ? "bg-green-500" : "bg-gradient-to-r from-yellow-500 to-amber-500"
                } h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${(frequencyChecked.filter(Boolean).length / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !allCategoriesChecked}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Clock className="h-5 w-5" />
                  使用頻度順に並べ替え完了！
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

