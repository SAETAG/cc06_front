"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { Volume2, VolumeX, CheckCircle2 } from "lucide-react"

// Define the options for each question
const jobOptions = [
  {
    id: "warrior",
    title: "断捨離の剣士",
    description: "不要なものを素早く処分する",
    hoverBg: "linear-gradient(135deg, #115e59, #0d9488)",
    hoverBorder: "#f59e0b",
    hoverShadow: "0 0 12px rgba(245, 158, 11, 0.4)",
  },
  {
    id: "mage",
    title: "空間デザインの魔法使い",
    description: "レイアウトや見た目の美しさを追求",
    hoverBg: "linear-gradient(135deg, #115e59, #0891b2)",
    hoverBorder: "#c084fc",
    hoverShadow: "0 0 12px rgba(192, 132, 252, 0.4)",
  },
  {
    id: "alchemist",
    title: "時短の錬金術師",
    description: "作業時間や導線を最適化",
    hoverBg: "linear-gradient(135deg, #115e59, #059669)",
    hoverBorder: "#4ade80",
    hoverShadow: "0 0 12px rgba(74, 222, 128, 0.4)",
  },
]

const bossOptions = [
  {
    id: "dragon",
    title: "リバウンドラゴン",
    description: "片付けてもすぐにリバウンドする",
    hoverBg: "linear-gradient(135deg, #115e59, #b91c1c)",
    hoverBorder: "#fca5a5",
    hoverShadow: "0 0 12px rgba(252, 165, 165, 0.4)",
  },
  {
    id: "angel",
    title: "マジックミラー堕天使",
    description: "どこになにがあるのかわからない",
    hoverBg: "linear-gradient(135deg, #115e59, #6366f1)",
    hoverBorder: "#a5b4fc",
    hoverShadow: "0 0 12px rgba(165, 180, 252, 0.4)",
  },
  {
    id: "slime",
    title: "無限増殖スライム",
    description: "物が増えすぎる",
    hoverBg: "linear-gradient(135deg, #115e59, #7c3aed)",
    hoverBorder: "#d8b4fe",
    hoverShadow: "0 0 12px rgba(216, 180, 254, 0.4)",
  },
]

const rewardOptions = [
  {
    id: "crystal",
    title: "クリスタルクローゼット",
    description: "一目でどこになにがあるのかわかる",
    hoverBg: "linear-gradient(135deg, #115e59, #0ea5e9)",
    hoverBorder: "#7dd3fc",
    hoverShadow: "0 0 12px rgba(125, 211, 252, 0.4)",
  },
  {
    id: "stylist",
    title: "スタイリストクローゼット",
    description: "すぐにコーディネートが決まる",
    hoverBg: "linear-gradient(135deg, #115e59, #db2777)",
    hoverBorder: "#fbcfe8",
    hoverShadow: "0 0 12px rgba(251, 207, 232, 0.4)",
  },
  {
    id: "eternal",
    title: "エターナルクローゼット",
    description: "永遠に綺麗な状態を保つ",
    hoverBg: "linear-gradient(135deg, #115e59, #ca8a04)",
    hoverBorder: "#fef08a",
    hoverShadow: "0 0 12px rgba(254, 240, 138, 0.4)",
  },
]

export default function SettingPage() {
  const [step, setStep] = useState(1)
  const [selectedJob, setSelectedJob] = useState("")
  const [selectedBoss, setSelectedBoss] = useState("")
  const [selectedReward, setSelectedReward] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Get the title of the selected option
  const getOptionTitle = (optionId: string, options: typeof jobOptions) => {
    const option = options.find((opt) => opt.id === optionId)
    return option ? option.title : ""
  }

  // Handle next step
  const handleNext = () => {
    setStep(step + 1)

    // ステップ進行時に音声再生を試みる（ユーザーインタラクション）
    tryPlayAudio()
  }

  // Check if the current step has a selection
  const canProceed = () => {
    if (step === 1) return selectedJob !== ""
    if (step === 2) return selectedBoss !== ""
    if (step === 3) return selectedReward !== ""
    return true
  }

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/setting.mp3")
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

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

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

  // Card component with improved touch handling
  const OptionCard = ({
    option,
    isSelected,
    onSelect,
  }: {
    option: (typeof jobOptions)[0]
    isSelected: boolean
    onSelect: (id: string) => void
  }) => {
    const [isHovered, setIsHovered] = useState(false)

    // Handle touch start - immediately set hover state
    const handleTouchStart = () => {
      setIsHovered(true)
    }

    // Handle touch end - select the option and reset hover state
    const handleTouchEnd = () => {
      onSelect(option.id)
      setIsHovered(false)

      // カード選択時に音声再生を試みる（ユーザーインタラクション）
      tryPlayAudio()
    }

    return (
      <div
        className="relative flex flex-col p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: isSelected ? "#0f766e" : isHovered ? "transparent" : "#115e59",
          backgroundImage: isHovered ? option.hoverBg : "none",
          borderColor: isSelected ? "#facc15" : isHovered ? option.hoverBorder : "#0d9488",
          boxShadow: isSelected ? "0 0 15px rgba(250,204,21,0.5)" : isHovered ? option.hoverShadow : "none",
          transform: isHovered && !isSelected ? "scale(1.03)" : "scale(1)",
        }}
        onClick={() => onSelect(option.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CheckCircle2
          className="absolute top-3 right-3 text-yellow-300 transition-opacity duration-200"
          style={{ opacity: isSelected ? 1 : 0 }}
        />
        <h3 className="text-lg font-medium text-yellow-200 mb-1">{option.title}</h3>
        <p className="text-sm text-gray-200">{option.description}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col items-center justify-center p-4" onClick={tryPlayAudio}>
      {/* Audio control */}
      <div className="fixed top-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          className="bg-teal-800 border-teal-600 text-white hover:bg-teal-700"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="max-w-md w-full bg-teal-900 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 relative mt-16">
        {/* Mo-chan character */}
        <div
          className="absolute -top-20 left-1/2 transform -translate-x-1/2"
          style={{ animation: "rpg-float 3s ease-in-out infinite" }}
        >
          <div className="relative w-28 h-28">
            <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-contain" />
          </div>
        </div>

        {/* Step 1: Choose Job */}
        {step === 1 && (
          <div className="space-y-6 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              勇者よ、あなたはどんな勇者を目指したいですか？
            </h2>

            <div className="space-y-4">
              {jobOptions.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedJob === option.id}
                  onSelect={setSelectedJob}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-teal-800 hover:bg-teal-900 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ進む
            </Button>
          </div>
        )}

        {/* Step 2: Choose Boss */}
        {step === 2 && (
          <div className="space-y-6 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              現状のクローゼットの問題は何だろう？
            </h2>

            <div className="space-y-4">
              {bossOptions.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedBoss === option.id}
                  onSelect={setSelectedBoss}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-teal-800 hover:bg-teal-900 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ進む
            </Button>
          </div>
        )}

        {/* Step 3: Choose Reward */}
        {step === 3 && (
          <div className="space-y-6 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              どんなクローゼットにしたい？
            </h2>

            <div className="space-y-4">
              {rewardOptions.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedReward === option.id}
                  onSelect={setSelectedReward}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-teal-800 hover:bg-teal-900 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ進む
            </Button>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="space-y-6 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 text-center drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              冒険の準備が整いました！
            </h2>

            <div className="space-y-4">
              <div className="bg-teal-800 p-4 rounded-lg border border-teal-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">あなたの職業：</h3>
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="w-[180px] bg-teal-700 border-teal-600 text-white">
                      <SelectValue placeholder="職業を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-800 border-teal-600">
                      {jobOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id} className="text-white hover:bg-teal-700">
                          {option.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-yellow-200 text-lg mt-2">{getOptionTitle(selectedJob, jobOptions)}</p>
              </div>

              <div className="bg-teal-800 p-4 rounded-lg border border-teal-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">倒すべきボス：</h3>
                  <Select value={selectedBoss} onValueChange={setSelectedBoss}>
                    <SelectTrigger className="w-[180px] bg-teal-700 border-teal-600 text-white">
                      <SelectValue placeholder="ボスを選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-800 border-teal-600">
                      {bossOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id} className="text-white hover:bg-teal-700">
                          {option.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-yellow-200 text-lg mt-2">{getOptionTitle(selectedBoss, bossOptions)}</p>
              </div>

              <div className="bg-teal-800 p-4 rounded-lg border border-teal-600">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">目指すべき最終報酬：</h3>
                  <Select value={selectedReward} onValueChange={setSelectedReward}>
                    <SelectTrigger className="w-[180px] bg-teal-700 border-teal-600 text-white">
                      <SelectValue placeholder="報酬を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-teal-800 border-teal-600">
                      {rewardOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id} className="text-white hover:bg-teal-700">
                          {option.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-yellow-200 text-lg mt-2">{getOptionTitle(selectedReward, rewardOptions)}</p>
              </div>
            </div>

            <Link href="/home" className="block">
              <Button className="w-full bg-teal-800 hover:bg-teal-900 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] font-medium py-2 px-4 rounded-lg border border-teal-600 transition-colors duration-200">
                これでOK
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

