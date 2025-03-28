// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { silentLogin } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Starting silent login...");
      const result = await silentLogin();
      console.log("Silent login successful:", result);
      
      // 新規ユーザーと既存ユーザーで分岐
      if (result.newlyCreated) {
        console.log("New user detected, redirecting to prologue...");
        router.push("/prologue");
      } else {
        console.log("Existing user detected, redirecting to home...");
        router.push("/home");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 既存の背景やレイアウトのコードはそのまま残す
  const clothingEmojis = [
    "👒", "👑", "👗", "👙", "👖", "✨", "🧤", "💃", "🦺", "🧦",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-950 p-4 relative overflow-hidden">
      {/* Sparkling clothing emojis in background */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && [...Array(20)].map((_, i) => (
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
          <Button
            onClick={handleLogin}
            className="w-full bg-teal-800 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 border border-teal-600 transition-colors duration-200"
            disabled={loading}
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-200" />
            <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] text-base sm:text-lg font-bold">
              {loading ? "ログイン中..." : "冒険を始める"}
            </span>
          </Button>
          {error && (
            <p className="text-red-500 text-sm">
              {error}
              <br />
              <span className="text-xs text-red-400">
                ブラウザのコンソールで詳細を確認できます
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-16 bg-teal-950 opacity-90 z-0"></div>
      <div className="absolute bottom-0 w-full h-8 bg-teal-950 opacity-95 z-0"></div>
    </div>
  );
}
