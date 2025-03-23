"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  ArrowUpIcon as BackArrow,
  Home,
} from "lucide-react"

export default function Stage13Battle() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false])
  const [allChecked, setAllChecked] = useState(false)

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/stepfight_13.mp3")
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

  useEffect(() => {
    setAllChecked(checkedItems.every((item) => item === true))
  }, [checkedItems])

  const handleCheckItem = (index: number) => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = !newCheckedItems[index]
    setCheckedItems(newCheckedItems)

    // チェックボックス操作時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    router.push("/closet/12/clear")
  }

  const checklistItems = [
    {
      title: "もう捨てるものはないか？",
      description: [
        "「使わないけど、まだ捨ててない物」が残っていないか確認。",
        "迷ったら…「半年以上使っていない？」「今後使う予定はある？」",
      ],
    },
    {
      title: "移動するものはないか？",
      description: [
        "別の部屋や収納の方が適しているものはない？",
        "例えば…「季節外の服は別の収納へ」「使用頻度の低いものは別の場所へ」",
      ],
    },
    {
      title: "使用頻度の高い順に配置できているか？",
      description: [
        "真ん中 → 毎日使うもの（すぐ取り出せる位置）",
        "下段 → 週1回〜月1回使うもの（多少しゃがんでもOK）",
        "上段 → 季節モノ・めったに使わないもの（脚立を使うレベル）",
      ],
    },
    {
      title: "収納の中が詰め込みすぎていないか？",
      description: [
        "取り出しやすさを確保！「7〜8割収納」が理想。",
        "ギュウギュウ詰め → 出しづらくて結局使わなくなる💦",
      ],
    },
    {
      title: "あと一歩、おしゃれにできるところはないか？",
      description: [
        "服を色順に並べてみる（グラデーションで統一感UP！）",
        "ハンガーを揃えるだけでスッキリ感UP！",
        "小物やバッグの配置も美しく整理（ショップ風にディスプレイ！）",
      ],
    },
  ]

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
          <Link href="/closet/13">
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-800 border-yellow-600 text-white hover:bg-purple-700 h-8 w-8 sm:h-10 sm:w-10"
            >
              <BackArrow className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
              最終確認の間 - 戦闘フェーズ
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
          <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
            最終確認チェックリスト
          </h2>

          <p className="text-white mb-6 text-center">
            クローゼットの整理が完了したら、以下のチェックリストで最終確認をしましょう。
            <br />
            すべての項目をチェックして、真の快適さを手に入れましょう！
          </p>

          <div className="bg-purple-900 bg-opacity-60 rounded-lg p-4 mb-6 border border-teal-600">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  handlePrevStep()
                  tryPlayAudio()
                }}
                disabled={currentStep === 0}
                className={`p-2 rounded-full ${currentStep === 0 ? "text-gray-500" : "text-white hover:bg-purple-800"}`}
              >
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-xl font-bold text-center text-yellow-300">
                {currentStep + 1}. {checklistItems[currentStep].title}
              </h3>
              <button
                onClick={() => {
                  handleNextStep()
                  tryPlayAudio()
                }}
                disabled={currentStep === 4}
                className={`p-2 rounded-full ${currentStep === 4 ? "text-gray-500" : "text-white hover:bg-purple-800"}`}
              >
                <ArrowRight size={24} />
              </button>
            </div>

            <div className="bg-teal-900 bg-opacity-50 p-4 rounded-lg mb-6 border border-teal-700">
              <ul className="space-y-2">
                {checklistItems[currentStep].description.map((item, idx) => (
                  <li key={idx} className="flex items-start text-white">
                    <span className="mr-2 text-yellow-300">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckItem(currentStep)}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 rounded-lg transition duration-300 text-white font-bold border border-blue-400"
            >
              {checkedItems[currentStep] ? (
                <CheckCircle className="mr-2" size={24} />
              ) : (
                <Circle className="mr-2" size={24} />
              )}
              <span>{checkedItems[currentStep] ? "チェック済み" : "チェックする"}</span>
            </button>
          </div>

          <div className="bg-purple-900 bg-opacity-60 rounded-lg p-4 mb-6 border border-teal-600">
            <h3 className="text-xl font-bold mb-3 text-yellow-300">チェックリスト進捗</h3>
            <div className="grid grid-cols-5 gap-2">
              {checkedItems.map((checked, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentStep(idx)
                    tryPlayAudio()
                  }}
                  className={`cursor-pointer p-2 rounded-lg flex flex-col items-center justify-center border ${
                    currentStep === idx ? "bg-teal-800 border-yellow-400" : "bg-teal-900 border-teal-700"
                  }`}
                >
                  <span className="text-sm mb-1 text-white">{idx + 1}</span>
                  {checked ? (
                    <CheckCircle className="text-green-400" size={20} />
                  ) : (
                    <Circle className="text-gray-400" size={20} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              handleComplete()
              tryPlayAudio()
            }}
            disabled={!allChecked}
            className={`w-full py-4 rounded-lg text-xl font-bold transition duration-300 border-2 ${
              allChecked
                ? "bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white border-yellow-500 transform hover:scale-105"
                : "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600"
            }`}
          >
            {allChecked ? "完了！" : "すべての項目をチェックしてください"}
          </button>
        </div>
      </main>
    </div>
  )
}

