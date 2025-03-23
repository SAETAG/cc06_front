"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCw, Volume2, VolumeX, Home, Crown, Medal, Trophy, Award, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CloudEffects } from "@/components/cloud-effects"

// ランキングユーザーの型定義
interface RankingUser {
  id: string
  name: string
  avatar: string
  score: number
  rank: number
  achievements: string[]
  level: number
  isCurrentUser: boolean
}

// サンプルデータ
const generateRankingData = (period: string): RankingUser[] => {
  // 実際のアプリではAPIからデータを取得する
  const baseUsers = [
    {
      id: "1",
      name: "山田太郎",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9850,
      achievements: ["全ステージクリア", "コンプリート達成", "連続ログイン30日"],
      level: 42,
      isCurrentUser: false,
    },
    {
      id: "2",
      name: "佐藤花子",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9720,
      achievements: ["デイリーミッション達成王", "アイテムコレクター", "早起きチャレンジャー"],
      level: 40,
      isCurrentUser: false,
    },
    {
      id: "3",
      name: "鈴木一郎",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9580,
      achievements: ["整理の達人", "収納マスター", "時間管理のプロ"],
      level: 39,
      isCurrentUser: false,
    },
    {
      id: "4",
      name: "田中美咲",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9350,
      achievements: ["断捨離の達人", "ミニマリスト", "エコフレンドリー"],
      level: 38,
      isCurrentUser: true,
    },
    {
      id: "5",
      name: "高橋健太",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9200,
      achievements: ["収納の魔術師", "整理整頓マスター", "時短テクニック"],
      level: 37,
      isCurrentUser: false,
    },
    {
      id: "6",
      name: "伊藤さくら",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9050,
      achievements: ["クローゼット整理の達人", "カラーコーディネーター", "季節管理のプロ"],
      level: 36,
      isCurrentUser: false,
    },
    {
      id: "7",
      name: "渡辺大輔",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 8900,
      achievements: ["収納ボックスマスター", "ラベリングの達人", "空間活用のプロ"],
      level: 35,
      isCurrentUser: false,
    },
    {
      id: "8",
      name: "小林結衣",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 8750,
      achievements: ["デジタル整理の達人", "ファイル管理のプロ", "バックアップマスター"],
      level: 34,
      isCurrentUser: false,
    },
    {
      id: "9",
      name: "加藤雄太",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 8600,
      achievements: ["キッチン整理の達人", "食材管理のプロ", "収納スペースの魔術師"],
      level: 33,
      isCurrentUser: false,
    },
    {
      id: "10",
      name: "吉田千尋",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 8450,
      achievements: ["バスルーム整理の達人", "洗面所管理のプロ", "清潔さの維持"],
      level: 32,
      isCurrentUser: false,
    },
    {
      id: "11",
      name: "山本拓也",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 8300,
      achievements: ["書類整理の達人", "ペーパーレス推進者", "情報管理のプロ"],
      level: 31,
      isCurrentUser: false,
    },
    {
      id: "12",
      name: "中村美月",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 8150,
      achievements: ["季節の切り替え達人", "クローゼット変身術", "収納の効率化"],
      level: 30,
      isCurrentUser: false,
    },
  ]

  // 期間によって若干スコアを変動させる
  let multiplier = 1
  if (period === "weekly") multiplier = 0.7
  if (period === "daily") multiplier = 0.4

  // ランクを付与して返す
  return baseUsers
    .map((user, index) => ({
      ...user,
      score: Math.floor(user.score * multiplier),
      rank: index + 1,
    }))
    .sort((a, b) => b.score - a.score)
}

export default function MountainPage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentPeriod, setCurrentPeriod] = useState("all")
  const [rankingData, setRankingData] = useState<RankingUser[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<RankingUser | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentUserRef = useRef<HTMLDivElement>(null)

  // Initialize audio on client side
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/mountain.mp3")

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

  // Load ranking data based on selected period
  useEffect(() => {
    setRankingData(generateRankingData(currentPeriod))
  }, [currentPeriod])

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      setRankingData(generateRankingData(currentPeriod))
      setIsRefreshing(false)
    }, 1500)
  }

  // Handle user click
  const handleUserClick = (user: RankingUser) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  // Scroll to current user
  useEffect(() => {
    if (currentUserRef.current) {
      // Wait a bit for the layout to stabilize
      setTimeout(() => {
        currentUserRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 500)
    }
  }, [rankingData])

  // Get top 3 users and the rest
  const topUsers = rankingData.slice(0, 3)
  const otherUsers = rankingData.slice(3)

  // Find current user
  const currentUser = rankingData.find((user) => user.isCurrentUser)

  // Get rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold">{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-700 text-white relative overflow-hidden">
      {/* Mountain background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Blue sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-400 to-blue-500"></div>

        {/* Sun effect */}
        <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-yellow-200 blur-xl opacity-70"></div>

        {/* Mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-[70vh] z-0">
          <div className="absolute bottom-0 left-0 w-full h-[60vh]">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
              <path
                fill="rgba(55, 65, 81, 0.9)"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
              <path
                fill="rgba(31, 41, 55, 0.95)"
                d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Summit glow */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-yellow-400/30 blur-3xl"></div>

        {/* Cloud effects */}
        <CloudEffects />
      </div>

      {/* Top navigation bar */}
      <div className="fixed top-0 right-0 z-50 p-2 flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className={`w-10 h-10 rounded-full bg-blue-600/60 text-white hover:text-blue-100 hover:bg-blue-700/70 border border-blue-300/30 ${isRefreshing ? "animate-spin" : ""}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className="w-5 h-5" />
          <span className="sr-only">更新</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="w-10 h-10 rounded-full bg-blue-600/60 text-white hover:text-blue-100 hover:bg-blue-700/70 border border-blue-300/30"
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          <span className="sr-only">{soundEnabled ? "サウンド オン" : "サウンド オフ"}</span>
        </Button>

        <Link href="/home">
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-blue-600/60 text-white hover:text-blue-100 hover:bg-blue-700/70 border border-blue-300/30"
          >
            <Home className="w-5 h-5" />
            <span className="sr-only">ホーム</span>
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-16">
        {/* Header with title */}
        <div className="w-full mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
            覇者の山
          </h1>
          <p className="text-amber-200/80 max-w-2xl mx-auto">
            頂上を目指す者たちの栄光の記録。あなたの努力が、ここに刻まれる。
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentPeriod}>
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-blue-900/50 border border-blue-300/30">
              <TabsTrigger
                value="all"
                className="text-white data-[state=active]:bg-blue-700/70 data-[state=active]:text-white"
              >
                全体
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="text-white data-[state=active]:bg-blue-700/70 data-[state=active]:text-white"
              >
                週間
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className="text-white data-[state=active]:bg-blue-700/70 data-[state=active]:text-white"
              >
                日別
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Top 3 users */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-12">
          {topUsers.map((user, index) => {
            // Determine position-based styling
            const position = user.rank
            let containerClasses = "relative flex flex-col items-center"
            let avatarSize = "w-20 h-20"
            let podiumHeight = "h-16"
            let zIndex = "z-10"

            if (position === 1) {
              containerClasses += " order-2 md:order-2"
              avatarSize = "w-28 h-28"
              podiumHeight = "h-24"
              zIndex = "z-30"
            } else if (position === 2) {
              containerClasses += " order-1 md:order-1"
              avatarSize = "w-24 h-24"
              podiumHeight = "h-20"
              zIndex = "z-20"
            } else if (position === 3) {
              containerClasses += " order-3 md:order-3"
              avatarSize = "w-24 h-24"
              podiumHeight = "h-16"
              zIndex = "z-20"
            }

            return (
              <div key={user.id} className={containerClasses} onClick={() => handleUserClick(user)}>
                {/* Crown for 1st place */}
                {position === 1 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl animate-float-animation">
                    👑
                  </div>
                )}

                {/* User avatar with special effects */}
                <div className={`${zIndex} mb-2`}>
                  <div className={`relative ${avatarSize}`}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse opacity-50"></div>
                    <Avatar
                      className={`${avatarSize} border-4 ${
                        position === 1 ? "border-yellow-400" : position === 2 ? "border-gray-300" : "border-amber-600"
                      }`}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-indigo-800">
                        <User className="w-1/2 h-1/2" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Rank badge */}
                    <div
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                        position === 1 ? "bg-yellow-500" : position === 2 ? "bg-gray-400" : "bg-amber-700"
                      }`}
                    >
                      {getRankIcon(position)}
                    </div>
                  </div>
                </div>

                {/* User name */}
                <div className="text-center mb-2">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-sm text-amber-300">スコア: {user.score}</div>
                </div>

                {/* Podium */}
                <div
                  className={`w-24 ${podiumHeight} rounded-t-lg bg-gradient-to-t ${
                    position === 1
                      ? "from-yellow-700 to-yellow-500"
                      : position === 2
                        ? "from-gray-700 to-gray-400"
                        : "from-amber-900 to-amber-700"
                  }`}
                >
                  <div className="h-1/3 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Other users list */}
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg border border-indigo-500/30 max-w-2xl mx-auto mb-24">
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            {otherUsers.map((user) => (
              <div
                key={user.id}
                ref={user.isCurrentUser ? currentUserRef : null}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                  user.isCurrentUser
                    ? "bg-amber-800/50 border-2 border-amber-500/50"
                    : "bg-indigo-800/30 hover:bg-indigo-700/40"
                }`}
                onClick={() => handleUserClick(user)}
              >
                {/* Rank */}
                <div className="w-10 h-10 rounded-full bg-indigo-700/50 flex items-center justify-center mr-3">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10 mr-3 border-2 border-indigo-300/30">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-indigo-800">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                {/* User info */}
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-indigo-300">Lv.{user.level}</div>
                </div>

                {/* Score */}
                <div className="text-amber-300 font-bold">{user.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current user fixed bar */}
        {currentUser && (
          <div className="fixed bottom-0 left-0 right-0 bg-indigo-950/90 backdrop-blur-md border-t border-amber-500/30 p-3 z-40">
            <div className="max-w-2xl mx-auto flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-800/70 flex items-center justify-center mr-3">
                {getRankIcon(currentUser.rank)}
              </div>

              <Avatar className="h-10 w-10 mr-3 border-2 border-amber-400/50">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-indigo-800">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="font-medium">
                  {currentUser.name} <span className="text-amber-300">(あなた)</span>
                </div>
                <div className="text-xs text-indigo-300">Lv.{currentUser.level}</div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-amber-300 font-bold">{currentUser.score}</div>
                <div className="text-xs text-amber-200/70">{currentUser.rank}位</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-indigo-950/95 border-amber-500/50 text-amber-50 max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-center text-amber-200">
                  {selectedUser.name} {selectedUser.isCurrentUser && <span className="text-amber-300">(あなた)</span>}
                </DialogTitle>
                <DialogDescription className="text-center text-amber-300/80">
                  ランキング: {selectedUser.rank}位
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center py-4">
                {/* User avatar */}
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 border-4 border-amber-500/50">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback className="bg-indigo-800">
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Rank badge */}
                  <div
                    className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedUser.rank === 1
                        ? "bg-yellow-500"
                        : selectedUser.rank === 2
                          ? "bg-gray-400"
                          : selectedUser.rank === 3
                            ? "bg-amber-700"
                            : "bg-indigo-700"
                    }`}
                  >
                    {getRankIcon(selectedUser.rank)}
                  </div>
                </div>

                {/* User stats */}
                <div className="w-full bg-indigo-900/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-indigo-300">レベル:</span>
                    <span className="font-bold text-amber-300">Lv.{selectedUser.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">スコア:</span>
                    <span className="font-bold text-amber-300">{selectedUser.score}</span>
                  </div>
                </div>

                {/* Achievements */}
                <div className="w-full">
                  <h3 className="text-amber-200 mb-2 font-medium">実績:</h3>
                  <ul className="space-y-2">
                    {selectedUser.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center bg-indigo-900/30 p-2 rounded-lg">
                        <Trophy className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <DialogClose asChild>
                  <Button className="bg-amber-700 hover:bg-amber-600 text-white">閉じる</Button>
                </DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

