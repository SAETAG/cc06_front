"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Trash2, CheckCircle2, ArrowRight } from "lucide-react"

export default function Stage6BattlePage() {
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [sageItems, setSageItems] = useState(Array(10).fill(false))
  const [fateItems, setFateItems] = useState(Array(10).fill(false))
  const [sageCompleted, setSageCompleted] = useState(false)
  const [fateCompleted, setFateCompleted] = useState(false)
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
      const audioElement = new Audio("/stepfight_6.mp3")
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

  // Toggle sage item
  const toggleSageItem = (index: number) => {
    const newSageItems = [...sageItems]
    newSageItems[index] = !newSageItems[index]
    setSageItems(newSageItems)
    tryPlayAudio()
  }

  // Toggle fate item
  const toggleFateItem = (index: number) => {
    const newFateItems = [...fateItems]
    newFateItems[index] = !newFateItems[index]
    setFateItems(newFateItems)
    tryPlayAudio()
  }

  // Check if all sage items are selected
  const allSageItemsSelected = sageItems.every((item) => item)

  // Check if all fate items are selected
  const allFateItemsSelected = fateItems.every((item) => item)

  // Complete sage box review
  const completeSageReview = () => {
    setSageCompleted(true)
    tryPlayAudio()
  }

  // Complete fate box review
  const completeFateReview = () => {
    setFateCompleted(true)
    tryPlayAudio()
  }

  // Check if review is complete
  const isReviewComplete = sageCompleted && fateCompleted

  // Save record to database and navigate to clear page
  const saveRecord = async () => {
    setIsSaving(true)

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would save the data to your database here
      console.log("Saving record:", {
        sageItems,
        fateItems,
      })

      // Navigate to clear page
      router.push("/closet/6/clear")
    } catch (error) {
      console.error("Error saving record:", error)
      alert("保存中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  // 賢者の箱のアイテムリスト
  const sageItemsList = [
    {
      title: "着心地が悪い服",
      description: "👉 着るたびに不快感を感じる服は、どんなに見た目が良くても手放しましょう",
    },
    {
      title: "サイズが合わない服",
      description: "👉 大きすぎる・小さすぎる服は、着る機会がないまま場所を取るだけです",
    },
    {
      title: "色あせた服",
      description: "👉 色あせや生地の劣化が目立つ服は、新しいものに更新する時期かもしれません",
    },
    {
      title: "流行遅れのデザイン",
      description: "👉 トレンドに合わなくなった服で、もう着る予定がないものは手放しましょう",
    },
    {
      title: "似たようなデザインの服",
      description: "👉 ほぼ同じデザインの服が複数ある場合は、最も状態の良いものだけを残しましょう",
    },
    {
      title: "着用頻度の低い服",
      description: "👉 1年以上着ていない服は、今後も着る可能性が低いかもしれません",
    },
    {
      title: "メンテナンスが難しい服",
      description: "👉 手入れが大変で、そのために着る機会が減っている服は見直しましょう",
    },
    {
      title: "季節外れの服",
      description: "👉 気候に合わない服や、季節感が合わない服は整理の対象になります",
    },
    {
      title: "コーディネートしにくい服",
      description: "👉 他の服と合わせにくく、着回しができない服は活用度が低いです",
    },
    {
      title: "気分が上がらない服",
      description: "👉 着ても特に気分が良くならない服は、本当に必要か考えましょう",
    },
  ]

  // 運命の箱のアイテムリスト
  const fateItemsList = [
    {
      title: "思い出の服（卒業式で着た服など）",
      description: "👉 思い出は写真に残っています。服自体を持っていなくても、思い出は心の中に残ります",
    },
    {
      title: "高価だった服（一度も着ていない）",
      description: "👉 「もったいない」という気持ちは理解できますが、着ない服は「埋蔵金」ではなく「埋蔵コスト」です",
    },
    {
      title: "痩せたら着たい服（サイズが小さい）",
      description: "👉 「痩せたら着る」という未来のために取っておくのではなく、今の自分に合った服を大切にしましょう",
    },
    {
      title: "いつか直そうと思っている服",
      description: "👉 「いつか直す」と思いながら何ヶ月も経っていませんか？修理する予定がないなら、手放す勇気を",
    },
    {
      title: "もらいものの服（着る機会がない）",
      description: "👉 大切な人からもらった服でも、着ないなら持っていても意味がありません。感謝の気持ちは心に留めて",
    },
    {
      title: "いつか着るかもしれない服",
      description: "👉 「いつか」は多くの場合、来ません。今の生活スタイルで着ないものは手放しましょう",
    },
    {
      title: "買ったけど失敗だった服",
      description: "👉 購入の失敗を認めるのは難しいですが、着ない服を持ち続けることはさらなる損失です",
    },
    {
      title: "特別な場所用の服（滅多に行かない）",
      description: "👉 年に一度も着ない特別な場所用の服は、必要になったときにレンタルという選択肢も",
    },
    {
      title: "昔の趣味・活動用の服",
      description: "👉 もう続けていない趣味や活動のための服は、新しい持ち主に活用してもらいましょう",
    },
    {
      title: "何となく捨てられない服",
      description: "👉 理由がはっきりしないのに捨てられない服は、実は不要なものかもしれません",
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
          <Link href="/closet/6">
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
              未練の洞窟 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">本当に必要なモノを再度見直す</h2>

          <p className="text-white mb-6 text-center">
            「賢者の箱」「運命の箱」に入れたアイテムを再度見直し、本当に持ち続ける価値があるか考えましょう。
            <br />
            捨てられるものは「断捨離の箱」へ移しましょう。
          </p>

          {/* Mission 1: Sage Box Review */}
          <div
            className={`mb-8 p-5 rounded-lg border-2 ${sageCompleted ? "border-green-500 bg-green-900/20" : "border-blue-500 bg-blue-900/20"}`}
          >
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
              ミッション１：「賢者の箱」から「断捨離の箱」へ
              {sageCompleted && <CheckCircle2 className="ml-2 h-5 w-5 text-green-400" />}
            </h3>

            <p className="text-white mb-4">
              「賢者の箱」から以下のアイテムを「断捨離の箱」へ移しましょう！ すべての項目を選択してください。
            </p>

            <div className="space-y-3 mb-6">
              {sageItemsList.map((item, index) => (
                <div
                  key={`sage-${index}`}
                  onClick={() => !sageCompleted && toggleSageItem(index)}
                  className={`flex items-start space-x-4 ${
                    sageItems[index]
                      ? "bg-blue-700 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                      : "bg-blue-800 bg-opacity-50 border-blue-700"
                  } p-3 rounded-lg border transition-all duration-300 ${!sageCompleted && "cursor-pointer hover:border-yellow-300"} ${sageCompleted && "opacity-80"}`}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 border-yellow-300 mt-1">
                    {sageItems[index] && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-yellow-300 font-bold text-sm sm:text-base">{item.title}</h4>
                    <p className="text-white text-xs sm:text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={completeSageReview}
                disabled={!allSageItemsSelected || sageCompleted}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                「賢者の箱」の見直し完了！
              </Button>
            </div>
          </div>

          {/* Mission 2: Fate Box Review */}
          <div
            className={`mb-8 p-5 rounded-lg border-2 ${fateCompleted ? "border-green-500 bg-green-900/20" : "border-amber-500 bg-amber-900/20"}`}
          >
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
              ミッション２：「運命の箱」から「断捨離の箱」へ
              {fateCompleted && <CheckCircle2 className="ml-2 h-5 w-5 text-green-400" />}
            </h3>

            <p className="text-white mb-4">
              「運命の箱」から以下のアイテムを「断捨離の箱」へ移しましょう！ すべての項目を選択してください。
            </p>

            <div className="space-y-3 mb-6">
              {fateItemsList.map((item, index) => (
                <div
                  key={`fate-${index}`}
                  onClick={() => !fateCompleted && toggleFateItem(index)}
                  className={`flex items-start space-x-4 ${
                    fateItems[index]
                      ? "bg-amber-700 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                      : "bg-amber-800 bg-opacity-50 border-amber-700"
                  } p-3 rounded-lg border transition-all duration-300 ${!fateCompleted && "cursor-pointer hover:border-yellow-300"} ${fateCompleted && "opacity-80"}`}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 border-yellow-300 mt-1">
                    {fateItems[index] && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-yellow-300 font-bold text-sm sm:text-base">{item.title}</h4>
                    <p className="text-white text-xs sm:text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={completeFateReview}
                disabled={!allFateItemsSelected || fateCompleted}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                「運命の箱」の見直し完了！
              </Button>
            </div>
          </div>

          {/* Final Submit button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={saveRecord}
              disabled={isSaving || !isReviewComplete}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-4 px-10 text-xl rounded-lg shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isSaving ? (
                "保存中..."
              ) : (
                <>
                  <Trash2 className="h-6 w-6" />
                  見直し完了！
                  <ArrowRight className="h-6 w-6" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

