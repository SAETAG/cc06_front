"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Home, Crown, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CrownPage() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [showCrown, setShowCrown] = useState(false)
  const [showFin, setShowFin] = useState(false)
  const [showHomeButton, setShowHomeButton] = useState(false)

  // 音声のミュート切り替え
  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      setIsMuted(newMutedState)
      audioRef.current.muted = newMutedState

      // まだ再生されていなければ再生を試みる
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error)
        })
      }
    }
  }

  // ホームに戻る
  const handleBackToHome = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    } catch (error) {
      console.error("Error stopping audio:", error)
    }

    router.push("/home")
  }

  // ページロード時のアニメーションシーケンス
  useEffect(() => {
    // 王冠のアニメーションを表示
    setTimeout(() => {
      setShowCrown(true)

      // 王冠表示後、FINの表示
      setTimeout(() => {
        setShowFin(true)

        // FIN表示後、ホームに戻るボタンの表示
        setTimeout(() => {
          setShowHomeButton(true)
        }, 2000)
      }, 3000)
    }, 1000)

    // オーディオの初期化
    const audio = new Audio("/crown.mp3")
    audio.loop = false // ループを無効化して一度だけ再生
    audio.volume = 0.7
    audioRef.current = audio

    // 自動再生
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error)
    })

    // クリーンアップ
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* 背景の光の効果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-purple-900/10 to-transparent"></div>

        {/* 背景の星や輝き */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-300"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 紙吹雪のアニメーションを追加 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 紙吹雪のアニメーション - 50個の紙吹雪を生成 */}
        {Array.from({ length: 50 }).map((_, i) => {
          // ランダムな紙吹雪の種類（ハート、キラキラ、丸、四角など）
          const confettiTypes = ["❤️", "✨", "🎊", "🎉", "⭐", "💫", "🌟"]
          const confetti = confettiTypes[Math.floor(Math.random() * confettiTypes.length)]

          // ランダムな位置、サイズ、アニメーション時間
          const left = Math.random() * 100
          const size = Math.random() * 20 + 10
          const animationDuration = Math.random() * 5 + 3
          const animationDelay = Math.random() * 5

          return (
            <div
              key={i}
              className="absolute top-0 animate-confetti"
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
              }}
            >
              {confetti}
            </div>
          )
        })}
      </div>

      {/* 王冠のアニメーション - 中央に配置 */}
      {showCrown && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-crown-appear">
            <div className="relative">
              {/* 王冠の後ろの光の輪 */}
              <div className="absolute -inset-10 rounded-full bg-yellow-500/30 animate-pulse-slow"></div>

              {/* 王冠アイコン */}
              <Crown size={160} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />

              {/* 王冠の周りの光の粒子 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-sparkle"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 王冠の下のテキスト - 王冠とは別に配置 */}
      {showCrown && (
        <div
          className="absolute top-2/3 left-0 right-0 text-center animate-fade-in z-10"
          style={{ animationDelay: "1s" }}
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">クローゼット王国の王冠</h2>
          <p className="text-yellow-100/80">あなたは正式にクローゼット王国の王となりました</p>
        </div>
      )}

      {/* FIN表示 - 下部に配置して王冠と重ならないようにする */}
      {showFin && (
        <div className="absolute bottom-20 z-20 w-full flex items-center justify-center animate-fin-appear">
          <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Closet Chronicle FIN
          </h1>
        </div>
      )}

      {/* ホームに戻るボタン */}
      {showHomeButton && (
        <div className="absolute bottom-10 z-30 animate-fade-in">
          <Button
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>ホームに戻る</span>
          </Button>
        </div>
      )}

      {/* 音声コントロール - 右上に配置 */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={toggleMute}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg"
          aria-label={isMuted ? "ミュート解除" : "ミュート"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* アニメーション用のスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        @keyframes crownAppear {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(20deg); opacity: 1; }
          80% { transform: scale(0.9) rotate(-10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        .animate-crown-appear {
          animation: crownAppear 2s forwards;
        }
        
        @keyframes sparkle {
          0%, 100% { box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px 20px rgba(255, 215, 0, 0.6); }
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s infinite ease-in-out;
        }
        
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s infinite ease-in-out;
        }
        
        @keyframes finAppear {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fin-appear {
          animation: finAppear 2s forwards;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  )
}

