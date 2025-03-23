"use client";

// app/silentlogin/page.tsx
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { silentLogin } from "@/lib/auth";

export default function SilentLogin() {
  const [loginStatus, setLoginStatus] = useState("ログイン中...");

  useEffect(() => {
    // ページ読み込み時にサイレントログインを実施
    silentLogin()
      .then((result) => {
        if (result.success) {
          setLoginStatus("サイレントログインに成功しました");
          console.log("ログイン成功:", result.data);
        } else {
          setLoginStatus("サイレントログインに失敗しました: " + result.error);
        }
      })
      .catch((err) => {
        setLoginStatus("エラーが発生しました: " + err.message);
      });
  }, []);

  // UIは元のデザインに加え、ログイン状況のメッセージを表示します
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-teal-950 p-4 relative overflow-hidden">
      {/* 背景のスパークリングエフェクト */}
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
            {["👒", "👑", "👗", "👙", "👖", "✨", "🧤", "💃", "🦺", "🧦"][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>

      <div className="max-w-md w-full text-center space-y-6 sm:space-y-8 bg-teal-900 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-teal-700 z-10 relative">
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold text-yellow-300 tracking-tight drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
            Closet Chronicle
          </h1>
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-medium text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] mb-4">
              あなたの名前を入力してください
            </h2>
            <Input
              type="text"
              placeholder="名前を入力"
              className="w-full bg-teal-800 border-teal-600 text-white placeholder:text-teal-400 focus:border-yellow-300 focus:ring-yellow-300"
              minLength={3}
              maxLength={10}
            />
            <p className="mt-2 text-sm text-teal-300">
              ※名前は３文字から１０文字まで入力できます。<br />
              ※名前は後から変えることができます。
            </p>
          </div>
          {/* ログイン状況の表示 */}
          <div className="mt-4">
            <p className="text-sm text-white">{loginStatus}</p>
          </div>
        </div>

        <div className="pt-4 sm:pt-6">
          <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 border border-teal-600 transition-colors duration-200">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-200" />
            <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)] text-sm sm:text-base">
              完了
            </span>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-16 bg-teal-950 opacity-90 z-0"></div>
      <div className="absolute bottom-0 w-full h-8 bg-teal-950 opacity-95 z-0"></div>
    </div>
  );
}
