"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Layers, CheckCircle2 } from "lucide-react"

export default function Stage8BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
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
      const audioElement = new Audio("/stepfight_8.mp3")
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

  // Handle type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
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
        selectedType,
      })

      // Navigate to clear page
      router.push("/closet/8/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  // タイプの選択肢
  const typeOptions = [
    {
      id: "work",
      title: "👩‍💼 仕事が多い人（ビジネスカジュアル・スーツが多い人）",
      description: "スーツやオフィスカジュアル服での出勤が多い人向け。シーン別×アイテム別で分類します。",
      bgColor: "from-blue-800 to-blue-900",
      borderColor: "border-blue-700",
      selectedBorderColor: "border-yellow-400",
      selectedBgColor: "from-blue-700 to-blue-800",
      hoverBorderColor: "hover:border-blue-500",
    },
    {
      id: "home",
      title: "🏡 おうち時間が多い人（リモートワーク・専業主婦・フリーランス）",
      description: "家での時間が長い人向け。快適さ×シーン別で分類します。",
      bgColor: "from-green-800 to-green-900",
      borderColor: "border-green-700",
      selectedBorderColor: "border-yellow-400",
      selectedBgColor: "from-green-700 to-green-800",
      hoverBorderColor: "hover:border-green-500",
    },
    {
      id: "fashion",
      title: "👗 ファッション好きな人（トレンド・おしゃれを楽しみたい人）",
      description: "服が多く、おしゃれを楽しみたい人向け。アイテム別×シーズン別で分類します。",
      bgColor: "from-purple-800 to-purple-900",
      borderColor: "border-purple-700",
      selectedBorderColor: "border-yellow-400",
      selectedBgColor: "from-purple-700 to-purple-800",
      hoverBorderColor: "hover:border-purple-500",
    },
    {
      id: "simple",
      title: "🛠️ とりあえず一番簡単に分けたい人（整理が苦手な人）",
      description: "シンプルに、最小限の労力で整理したい人向け。ゾーン別でシンプルに分類します。",
      bgColor: "from-amber-800 to-amber-900",
      borderColor: "border-amber-700",
      selectedBorderColor: "border-yellow-400",
      selectedBgColor: "from-amber-700 to-amber-800",
      hoverBorderColor: "hover:border-amber-500",
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
          <Link href="/closet/8">
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
              秩序の神殿 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">テーマに沿ってモノをグルーピング</h2>

          {!showInstructions ? (
            <>
              <p className="text-white mb-6 text-center">
                ここまでで、だいぶ「賢者の箱（クローゼットに本当に入れるべきもの）」の中身が研ぎ澄まされたのではないだろうか？
                <br />
                　ここからはいよいよ「収納」フェーズに入るぞ！
                <br />
                最初は、「賢者の箱」の中身をグルーピングしてみよう！
                <br />
                まずは、以下の中から最も自分の生活スタイルに近いものを選択してみよう！
              </p>

              {/* Type selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-300 mb-4">あなたのタイプは？</h3>

                <div className="space-y-4">
                  {typeOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleTypeSelect(option.id)}
                      className={`relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-300 bg-gradient-to-r ${
                        selectedType === option.id
                          ? `${option.selectedBorderColor} ${option.selectedBgColor} shadow-[0_0_15px_rgba(250,204,21,0.2)]`
                          : `${option.borderColor} ${option.bgColor} ${option.hoverBorderColor}`
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1 pr-8">
                          <h4 className="text-yellow-300 font-bold text-lg">{option.title}</h4>
                          <p className="text-white text-base mt-1">{option.description}</p>
                        </div>
                        <div className="absolute right-4 top-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-yellow-300 bg-teal-900/50">
                          {selectedType === option.id && <CheckCircle2 className="h-6 w-6 text-green-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => {
                      setShowInstructions(true)
                      tryPlayAudio()
                    }}
                    disabled={!selectedType}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    分類手順を見る
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Instructions based on selected type */}
              <div className="mb-8">
                {selectedType === "work" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      👩‍💼 仕事が多い人（ビジネスカジュアル・スーツが多い人）
                    </h3>
                    <p className="text-white mb-4">👉 【シーン別 × アイテム別】で分類する！</p>

                    {/* 手順カード 1 */}
                    <div className="bg-blue-800/50 p-5 rounded-lg border-2 border-blue-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">1</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">シーンごとに大きく分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <p>仕事 / 休日 / フォーマルの3つに分けましょう</p>
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 仕事用（スーツ・オフィスカジュアル・ビジネスシューズ）</li>
                          <li>✅ 休日用（カジュアルウェア・スニーカー・リラックスウェア）</li>
                          <li>✅ フォーマル（冠婚葬祭・結婚式・特別な場面用）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 2 */}
                    <div className="bg-blue-800/50 p-5 rounded-lg border-2 border-blue-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">2</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">仕事用の服をさらに分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ トップス（シャツ・ブラウス・ニット）</li>
                          <li>✅ ボトムス（スラックス・スカート）</li>
                          <li>✅ アウター（ジャケット・コート）</li>
                          <li>✅ 靴（革靴・パンプス）</li>
                          <li>✅ 小物（ネクタイ・ベルト・ストッキング・カバン）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 3 */}
                    <div className="bg-blue-800/50 p-5 rounded-lg border-2 border-blue-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">3</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">休日用の服をさらに分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ トップス（Tシャツ・パーカー・ニット）</li>
                          <li>✅ ボトムス（デニム・スカート・ジョガーパンツ）</li>
                          <li>✅ アウター（カジュアルジャケット・カーディガン）</li>
                          <li>✅ 靴（スニーカー・ブーツ・サンダル）</li>
                          <li>✅ 小物（キャップ・バッグ・アクセサリー）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 4 */}
                    <div className="bg-blue-800/50 p-5 rounded-lg border-2 border-blue-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">4</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">下着・靴下・部屋着・パジャマをまとめる</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 下着・靴下 → 毎日使うものとして、まとめて収納</li>
                          <li>✅ 部屋着・パジャマ → すぐ取り出せる場所に配置</li>
                        </ul>
                      </div>
                    </div>

                    {/* ポイントカード */}
                    <div className="bg-teal-900/70 p-5 rounded-lg border-2 border-yellow-500 shadow-md mt-6">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-100 font-bold">✨</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">ポイント！</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-teal-300">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>仕事用の服は「統一感」を意識して分けると、毎朝コーデが楽！</li>
                          <li>シーンごとにゾーンを作ると、探しやすくなる！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "home" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      🏡 おうち時間が多い人（リモートワーク・専業主婦・フリーランス）
                    </h3>
                    <p className="text-white mb-4">👉 【快適さ × シーン別】で分類する！</p>

                    {/* 手順カード 1 */}
                    <div className="bg-green-800/50 p-5 rounded-lg border-2 border-green-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">1</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">大まかに3つのグループに分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <p>家・ちょっと外出・しっかり外出の3つに分けましょう</p>
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 家で着る服（ルームウェア・パジャマ）</li>
                          <li>✅ ちょっと外出服（近所・スーパー・コンビニ用）</li>
                          <li>✅ しっかり外出服（おでかけ・レジャー・友達と会う用）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 2 */}
                    <div className="bg-green-800/50 p-5 rounded-lg border-2 border-green-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">2</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">家で着る服を分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 部屋着（Tシャツ・スウェット・ゆるニット）</li>
                          <li>✅ パジャマ（上下セット・ルームローブ）</li>
                          <li>✅ 防寒用アイテム（ルームソックス・ガウン・ブランケット）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 3 */}
                    <div className="bg-green-800/50 p-5 rounded-lg border-2 border-green-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">3</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">ちょっと外出服を分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ トップス（シンプルなカットソー・羽織れるカーディガン）</li>
                          <li>✅ ボトムス（デニム・ジョガーパンツ・スカート）</li>
                          <li>✅ 靴（スニーカー・サンダル）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 4 */}
                    <div className="bg-green-800/50 p-5 rounded-lg border-2 border-green-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">4</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">しっかり外出服を分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ トップス（ブラウス・おしゃれニット・アウター）</li>
                          <li>✅ ボトムス（キレイめパンツ・スカート）</li>
                          <li>✅ 靴（パンプス・ブーツ）</li>
                          <li>✅ 小物（バッグ・ストール・アクセサリー）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 5 */}
                    <div className="bg-green-800/50 p-5 rounded-lg border-2 border-green-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">5</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">下着・靴下をまとめる</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 下着・インナー類は1ヶ所にまとめる</li>
                          <li>✅ 靴下は「厚手/薄手」で分けると使いやすい！</li>
                        </ul>
                      </div>
                    </div>

                    {/* ポイントカード */}
                    <div className="bg-teal-900/70 p-5 rounded-lg border-2 border-yellow-500 shadow-md mt-6">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-100 font-bold">✨</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">ポイント！</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-teal-300">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>「すぐ着られる快適服」を手前に収納する！</li>
                          <li>ルームウェアと外出服を混ぜないことで、外出時の準備がスムーズに！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "fashion" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      👗 ファッション好きな人（トレンド・おしゃれを楽しみたい人）
                    </h3>
                    <p className="text-white mb-4">👉 【アイテム別 × シーズン別】で分類する！</p>

                    {/* 手順カード 1 */}
                    <div className="bg-purple-800/50 p-5 rounded-lg border-2 border-purple-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">1</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">アイテムごとに分類する</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ トップス（Tシャツ・ニット・ブラウス）</li>
                          <li>✅ ボトムス（デニム・スラックス・スカート）</li>
                          <li>✅ ワンピース・セットアップ</li>
                          <li>✅ アウター（コート・ジャケット）</li>
                          <li>✅ 靴（スニーカー・ブーツ・パンプス・サンダル）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 2 */}
                    <div className="bg-purple-800/50 p-5 rounded-lg border-2 border-purple-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">2</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">季節ごとに分類する</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 春夏用（薄手・涼しい素材）</li>
                          <li>✅ 秋冬用（厚手・防寒アイテム）</li>
                          <li>✅ オールシーズン用（どの季節でも使えるアイテム）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 3 */}
                    <div className="bg-purple-800/50 p-5 rounded-lg border-2 border-purple-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">3</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">小物・アクセサリーも分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ バッグ（ショルダー・トート・クラッチ）</li>
                          <li>✅ 帽子（キャップ・ハット・ニット帽）</li>
                          <li>✅ アクセサリー（ピアス・ネックレス・ベルト）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 4 */}
                    <div className="bg-purple-800/50 p-5 rounded-lg border-2 border-purple-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">4</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">下着・靴下・ストッキングをまとめる</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ シーン別（普段用 / 特別用）で分ける</li>
                          <li>✅ カラーごとに並べると選びやすい！</li>
                        </ul>
                      </div>
                    </div>

                    {/* ポイントカード */}
                    <div className="bg-teal-900/70 p-5 rounded-lg border-2 border-yellow-500 shadow-md mt-6">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-100 font-bold">✨</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">ポイント！</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-teal-300">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>「着たい服がすぐ見つかる収納」にすることが大事！</li>
                          <li>カラーグラデーションで並べると、コーデがしやすい✨</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedType === "simple" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      🛠️ とりあえず一番簡単に分けたい人（整理が苦手な人）
                    </h3>
                    <p className="text-white mb-4">👉 【ゾーン別でシンプルに分類！】</p>

                    {/* 手順カード 1 */}
                    <div className="bg-amber-800/50 p-5 rounded-lg border-2 border-amber-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">1</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">大きく2つに分ける</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <p>普段着 / たまに着る服の2つに分けましょう</p>
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 普段着（毎日着る服・すぐ取り出したいもの）</li>
                          <li>✅ たまに着る服（フォーマル・シーズンオフの服）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 2 */}
                    <div className="bg-amber-800/50 p-5 rounded-lg border-2 border-amber-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">2</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">さらにざっくり分類する</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ トップス（Tシャツ・ブラウス・ニット）</li>
                          <li>✅ ボトムス（デニム・スカート・スラックス）</li>
                          <li>✅ アウター（コート・ジャケット）</li>
                        </ul>
                      </div>
                    </div>

                    {/* 手順カード 3 */}
                    <div className="bg-amber-800/50 p-5 rounded-lg border-2 border-amber-600 shadow-md">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-300 font-bold">3</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">下着・靴下・小物をまとめる</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-white">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>✅ 靴下・下着 → 1ヶ所にまとめる（分類不要！）</li>
                          <li>✅ 小物（バッグ・帽子） → ボックスにまとめてポイッ！</li>
                        </ul>
                      </div>
                    </div>

                    {/* ポイントカード */}
                    <div className="bg-teal-900/70 p-5 rounded-lg border-2 border-yellow-500 shadow-md mt-6">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 border border-yellow-400">
                          <span className="text-yellow-100 font-bold">✨</span>
                        </div>
                        <h4 className="text-lg font-bold text-yellow-300">ポイント！</h4>
                      </div>
                      <div className="ml-11 space-y-2 text-teal-300">
                        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                          <li>とにかく「手間をかけずにパッと取れる収納」を作る！</li>
                          <li>完璧を目指さず「とりあえず分ける」だけでスッキリする！</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    tryPlayAudio()
                    saveRecord()
                  }}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {isSaving ? (
                    "保存中..."
                  ) : (
                    <>
                      <Layers className="h-5 w-5" />
                      グルーピング完了！
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

