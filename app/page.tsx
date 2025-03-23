import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scroll, Sparkles } from "lucide-react"

export default function Home() {
  // Array of clothing emojis
  const clothingEmojis = ["👒", "👑", "👗", "👙", "👖", "✨", "🧤", "💃", "🦺", "🧦"]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-950 p-4 relative overflow-hidden">
      {/* Sparkling clothing emojis in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl float-animation"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
              transform: `scale(${0.8 + Math.random() * 0.7})`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {clothingEmojis[Math.floor(Math.random() * clothingEmojis.length)]}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full text-center space-y-6 sm:space-y-8 bg-teal-900 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 relative">
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            Closet Chronicle
          </h1>
          <div className="mt-12 space-y-1">
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "0s" }}
            >
              この冒険は
            </div>
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "0.5s" }}
            >
              あなたが
            </div>
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "1s" }}
            >
              自分らしいクローゼットを
            </div>
            <div
              className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-magical-appear"
              style={{ animationDelay: "1.5s" }}
            >
              取り戻すまでの物語
            </div>
          </div>
        </div>

        <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <Link href="/signup" className="block">
            <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 border border-teal-600 transition-colors duration-200">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-200" />
              <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] text-sm sm:text-base">
                新たな冒険へ
              </span>
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 border border-teal-600 transition-colors duration-200">
              <Scroll className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-200" />
              <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] text-sm sm:text-base">
                冒険の続きへ
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-16 bg-teal-950 opacity-90 z-0"></div>
      <div className="absolute bottom-0 w-full h-8 bg-teal-950 opacity-95 z-0"></div>
    </div>
  )
}

