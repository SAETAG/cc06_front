"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, RefreshCw, Volume2, VolumeX, Home, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaterRipple } from "@/components/water-ripple"

// 宝物アイテムの型定義
interface Treasure {
  id: string
  name: string
  description: string
  icon: string
  source: "quest" | "daily"
  acquiredDate: string
  isNew: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

// サンプルデータ
const treasures: Treasure[] = [
  {
    id: "1",
    name: "整理の水晶",
    description: "クローゼット整理の達成感を象徴する水晶。持ち主に整頓の力を与えると言われている。",
    icon: "crystal",
    source: "daily",
    acquiredDate: "2025-03-15",
    isNew: true,
    rarity: "rare",
  },
  {
    id: "2",
    name: "収納の魔法箱",
    description: "限られたスペースに無限のアイテムを収納できる不思議な箱。空間を最適化する力を秘めている。",
    icon: "box",
    source: "daily",
    acquiredDate: "2025-03-14",
    isNew: false,
    rarity: "common",
  },
  {
    id: "3",
    name: "ペアの護符",
    description: "バラバラになったものを元に戻す力を持つお守り。靴下のペアを見つける時に特に効果を発揮する。",
    icon: "amulet",
    source: "daily",
    acquiredDate: "2025-03-13",
    isNew: false,
    rarity: "common",
  },
  {
    id: "4",
    name: "整頓の葉",
    description: "自然の秩序を象徴する神秘的な葉。この葉を持つ者は物事を自然に整理整頓できるようになる。",
    icon: "leaf",
    source: "daily",
    acquiredDate: "2025-03-12",
    isNew: false,
    rarity: "rare",
  },
  {
    id: "5",
    name: "宝石の小箱",
    description: "小さなアクセサリーを美しく保管するための宝石箱。中に入れたアイテムは常に輝きを失わない。",
    icon: "gem",
    source: "quest",
    acquiredDate: "2025-03-10",
    isNew: false,
    rarity: "epic",
  },
  {
    id: "6",
    name: "清浄の水晶",
    description: "周囲の空間を浄化する力を持つ水晶。この水晶があるところにはホコリが寄り付かない。",
    icon: "crystal",
    source: "quest",
    acquiredDate: "2025-03-08",
    isNew: false,
    rarity: "legendary",
  },
  {
    id: "7",
    name: "時の砂時計",
    description: "時間を効率的に使う力を与える砂時計。持ち主は常に時間を意識して行動できるようになる。",
    icon: "gem",
    source: "quest",
    acquiredDate: "2025-03-05",
    isNew: false,
    rarity: "epic",
  },
  {
    id: "8",
    name: "記憶の羽根",
    description: "大切なことを忘れないようにする羽根。持ち主は必要なときに必要な記憶を呼び起こせる。",
    icon: "feather",
    source: "daily",
    acquiredDate: "2025-03-01",
    isNew: false,
    rarity: "rare",
  },
]

export default function LakePage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filteredTreasures, setFilteredTreasures] = useState<Treasure[]>(treasures)
  const [currentFilter, setCurrentFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on client side
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/lake.mp3") // 後で lake.mp3 に変更

    if (audioRef.current) {
      // Set audio properties
      audioRef.current.loop = true
      audioRef.current.volume = 0.4

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

  // Filter treasures based on tab selection
  useEffect(() => {
    if (currentFilter === "all") {
      setFilteredTreasures(treasures)
    } else if (currentFilter === "quest") {
      setFilteredTreasures(treasures.filter((treasure) => treasure.source === "quest"))
    } else if (currentFilter === "daily") {
      setFilteredTreasures(treasures.filter((treasure) => treasure.source === "daily"))
    } else if (currentFilter === "new") {
      setFilteredTreasures(treasures.filter((treasure) => treasure.isNew))
    }
  }, [currentFilter])

  // Handle treasure click
  const handleTreasureClick = (treasure: Treasure) => {
    setSelectedTreasure(treasure)
    setIsDialogOpen(true)
  }

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      // Here you would typically fetch new data from an API
      setIsRefreshing(false)
    }, 1500)
  }

  // Get icon component based on treasure icon type
  const getTreasureIcon = (iconType: string) => {
    switch (iconType) {
      case "crystal":
        return (
          <div className="w-full h-full rounded-lg bg-cyan-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">💎</div>
          </div>
        )
      case "box":
        return (
          <div className="w-full h-full rounded-lg bg-amber-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">📦</div>
          </div>
        )
      case "amulet":
        return (
          <div className="w-full h-full rounded-lg bg-purple-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">🔮</div>
          </div>
        )
      case "leaf":
        return (
          <div className="w-full h-full rounded-lg bg-green-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">🍃</div>
          </div>
        )
      case "gem":
        return (
          <div className="w-full h-full rounded-lg bg-pink-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">💠</div>
          </div>
        )
      case "feather":
        return (
          <div className="w-full h-full rounded-lg bg-blue-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">🪶</div>
          </div>
        )
      default:
        return (
          <div className="w-full h-full rounded-lg bg-blue-500/30 flex items-center justify-center">
            <div className="text-6xl animate-float-animation">✨</div>
          </div>
        )
    }
  }

  // Get rarity class for treasure item
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-blue-400/50 shadow-blue-400/20"
      case "rare":
        return "border-purple-400/50 shadow-purple-400/30"
      case "epic":
        return "border-pink-400/50 shadow-pink-400/30"
      case "legendary":
        return "border-amber-400/50 shadow-amber-400/40"
      default:
        return "border-blue-400/50 shadow-blue-400/20"
    }
  }

  // Get rarity text color
  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-blue-300"
      case "rare":
        return "text-purple-300"
      case "epic":
        return "text-pink-300"
      case "legendary":
        return "text-amber-300"
      default:
        return "text-blue-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-indigo-900 text-white relative overflow-hidden">
      {/* Water ripple effect background */}
      <WaterRipple />

      {/* Mystical light effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full bg-purple-400/10 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-400/10 blur-xl"></div>
      </div>

      {/* Fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent z-0"></div>

      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-2 flex items-center justify-between">
        <Link href="/home">
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">戻る</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className={`w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30 ${isRefreshing ? "animate-spin" : ""}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="sr-only">更新</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30"
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="sr-only">{soundEnabled ? "サウンド オン" : "サウンド オフ"}</span>
          </Button>

          <Link href="/home">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-blue-900/60 text-cyan-300 hover:text-cyan-200 hover:bg-blue-800/70 border border-cyan-500/30"
            >
              <Home className="w-5 h-5" />
              <span className="sr-only">ホーム</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-16">
        {/* Header with title */}
        <div className="w-full mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 drop-shadow-[0_2px_8px_rgba(0,255,255,0.5)]">
            秘宝の湖
          </h1>
          <p className="text-cyan-200/80 max-w-2xl mx-auto">
            神秘的な湖面に浮かぶ秘宝たち。あなたの冒険の証が、ここに集まります。
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentFilter}>
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto bg-blue-900/50 border border-cyan-500/30">
              <TabsTrigger value="all" className="data-[state=active]:bg-cyan-800/50">
                すべての秘宝
              </TabsTrigger>
              <TabsTrigger value="quest" className="data-[state=active]:bg-cyan-800/50">
                クエスト秘宝
              </TabsTrigger>
              <TabsTrigger value="daily" className="data-[state=active]:bg-cyan-800/50">
                日替わり秘宝
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-cyan-800/50">
                新着秘宝
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Treasures grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filteredTreasures.map((treasure) => (
            <div
              key={treasure.id}
              className={`relative p-4 rounded-lg backdrop-blur-sm bg-blue-900/30 border-2 ${getRarityClass(treasure.rarity)} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
              onClick={() => handleTreasureClick(treasure)}
            >
              {/* Treasure icon */}
              <div className="w-full aspect-square mb-3">{getTreasureIcon(treasure.icon)}</div>

              {/* Treasure name */}
              <h3 className="text-center font-medium text-cyan-100 mb-1 truncate">{treasure.name}</h3>

              {/* Rarity label */}
              <div className={`text-xs text-center ${getRarityTextColor(treasure.rarity)}`}>
                {treasure.rarity === "common" && "一般"}
                {treasure.rarity === "rare" && "レア"}
                {treasure.rarity === "epic" && "エピック"}
                {treasure.rarity === "legendary" && "伝説"}
              </div>

              {/* Source badge */}
              <div className="absolute top-2 right-2">
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    treasure.source === "quest" ? "bg-indigo-800/70 text-indigo-200" : "bg-teal-800/70 text-teal-200"
                  }`}
                >
                  {treasure.source === "quest" ? "クエスト" : "デイリー"}
                </div>
              </div>

              {/* New item badge */}
              {treasure.isNew && (
                <div className="absolute -top-2 -left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  新着！
                </div>
              )}

              {/* Shine effect for new items */}
              {treasure.isNew && (
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/0 via-white/30 to-white/0 animate-shine"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTreasures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-cyan-300 mb-4">
              <Info className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl text-cyan-200 mb-2">秘宝が見つかりません</h3>
            <p className="text-cyan-300/70">
              この種類の秘宝はまだ獲得していないようです。クエストやデイリーミッションに挑戦して秘宝を集めましょう。
            </p>
          </div>
        )}
      </div>

      {/* Treasure detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-blue-950/95 border-cyan-500/50 text-cyan-50 max-w-md">
          {selectedTreasure && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-center text-cyan-200">{selectedTreasure.name}</DialogTitle>
                <DialogDescription className="text-center text-cyan-300/80">
                  {selectedTreasure.source === "quest" ? "クエスト秘宝" : "デイリーミッション秘宝"}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center py-4">
                {/* Treasure icon (larger) */}
                <div className="w-32 h-32 mb-6">{getTreasureIcon(selectedTreasure.icon)}</div>

                {/* Rarity */}
                <div
                  className={`mb-4 px-3 py-1 rounded-full ${
                    selectedTreasure.rarity === "common"
                      ? "bg-blue-800/50 text-blue-200"
                      : selectedTreasure.rarity === "rare"
                        ? "bg-purple-800/50 text-purple-200"
                        : selectedTreasure.rarity === "epic"
                          ? "bg-pink-800/50 text-pink-200"
                          : "bg-amber-800/50 text-amber-200"
                  }`}
                >
                  {selectedTreasure.rarity === "common" && "一般レアリティ"}
                  {selectedTreasure.rarity === "rare" && "レアレアリティ"}
                  {selectedTreasure.rarity === "epic" && "エピックレアリティ"}
                  {selectedTreasure.rarity === "legendary" && "伝説のレアリティ"}
                </div>

                {/* Description */}
                <p className="text-center text-cyan-100 mb-4">{selectedTreasure.description}</p>

                {/* Acquisition date */}
                <div className="text-sm text-cyan-300/70">
                  獲得日: {new Date(selectedTreasure.acquiredDate).toLocaleDateString("ja-JP")}
                </div>
              </div>

              <div className="flex justify-center">
                <DialogClose asChild>
                  <Button className="bg-cyan-700 hover:bg-cyan-600 text-white">閉じる</Button>
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

