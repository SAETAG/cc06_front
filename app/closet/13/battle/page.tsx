"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, ArrowLeft, Home, Tag, Share2, CheckCircle2, Info } from "lucide-react"

export default function Battle13() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [checkedItems, setCheckedItems] = useState({
    madeLabels: false,
    attachedLabels: false,
    sharedWithFamily: false,
  })
  const [activeTab, setActiveTab] = useState<"checklist" | "examples" | "tips">("checklist")

  // シンプルな音声初期化 - ループなし（一回だけ再生）
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const audioElement = new Audio("/stepfight_13.mp3")
        // ループをオフにして一回だけ再生するように設定
        audioElement.loop = false
        audioElement.volume = 0.7
        audioElement.preload = "auto"

        // オーディオの読み込み状態を監視
        audioElement.addEventListener("canplaythrough", () => {
          setAudioLoaded(true)
          console.log("Audio loaded and ready to play")
        })

        audioElement.addEventListener("error", (e) => {
          console.error("Audio loading error:", e)
        })

        setAudio(audioElement)

        // クリーンアップ関数 - コンポーネントがアンマウントされたときに確実に音声を停止
        return () => {
          audioElement.pause()
          audioElement.src = ""
          setAudio(null)
        }
      } catch (error) {
        console.error("Audio initialization error:", error)
      }
    }
  }, [])

  // ページ表示後に一度だけ再生を試みる
  useEffect(() => {
    if (audio && audioLoaded) {
      // モバイルでは自動再生できないことが多いが、一応試みる
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Initial auto-play was prevented:", error)
          // エラーは想定内なので何もしない
        })
      }
    }
  }, [audio, audioLoaded])

  // ミュート状態が変更されたときに適用
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted

      // ミュート解除時に再生を試みる
      if (!isMuted && audio.paused && audioLoaded) {
        const playPromise = audio.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Play on unmute failed:", error)
          })
        }
      }
    }
  }, [isMuted, audio, audioLoaded])

  // 画面タップで再生を試みる関数
  const tryPlayAudio = () => {
    if (audio && audio.paused && !isMuted && audioLoaded) {
      // ユーザーインタラクションの中で再生を試みる（モバイルで重要）
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Play on screen tap failed:", error)
        })
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleComplete = () => {
    // 次のページに移動する前に確実に音声を停止
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    router.push("/closet/13/clear")
  }

  const handleCheckboxChange = (item: keyof typeof checkedItems) => {
    setCheckedItems({
      ...checkedItems,
      [item]: !checkedItems[item],
    })
    tryPlayAudio() // Try to play audio on interaction
  }

  // Check if all items are checked or at least one is checked
  const allChecked = Object.values(checkedItems).every(Boolean)
  const anyChecked = Object.values(checkedItems).some(Boolean)
  const checkedCount = Object.values(checkedItems).filter(Boolean).length

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
              onClick={() => {
                // リンククリック時に音声を停止
                if (audio) {
                  audio.pause()
                  audio.currentTime = 0
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <span className="text-lg sm:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] px-2">
              モノの住所を決める - 戦闘フェーズ
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
              onClick={() => {
                // リンククリック時に音声を停止
                if (audio) {
                  audio.pause()
                  audio.currentTime = 0
                }
              }}
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center p-4 overflow-auto">
        <div className="max-w-4xl w-full">
          {/* Introduction */}
          <div className="bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg p-6 border-2 border-yellow-500 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              ラベリングで収納を完成させよう！
            </h2>

            <div className="bg-teal-800/30 p-4 rounded-lg mb-6 border border-teal-600">
              <p className="text-white text-lg mb-3">
                ラベリングは収納の<span className="text-yellow-300 font-bold">最後の仕上げ</span>であり、
                <span className="text-yellow-300 font-bold">最も重要なステップ</span>です。
              </p>
              <p className="text-white mb-3">ラベルを貼ることで：</p>
              <ul className="list-disc pl-6 space-y-2 text-white">
                <li>
                  どこに何があるかが<span className="text-teal-300 font-medium">一目でわかる</span>
                </li>
                <li>
                  家族みんなが<span className="text-teal-300 font-medium">同じルール</span>で片付けられる
                </li>
                <li>
                  元の場所に<span className="text-teal-300 font-medium">戻しやすく</span>なる
                </li>
                <li>
                  リバウンドを<span className="text-teal-300 font-medium">防止</span>できる
                </li>
              </ul>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab("checklist")}
              className={`flex-1 py-2 px-4 rounded-t-lg font-medium ${
                activeTab === "checklist"
                  ? "bg-gradient-to-r from-purple-900 to-teal-900 text-yellow-300 border-2 border-b-0 border-yellow-500"
                  : "bg-purple-800/50 text-white border border-teal-700"
              }`}
            >
              チェックリスト
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`flex-1 py-2 px-4 rounded-t-lg font-medium ${
                activeTab === "examples"
                  ? "bg-gradient-to-r from-purple-900 to-teal-900 text-yellow-300 border-2 border-b-0 border-yellow-500"
                  : "bg-purple-800/50 text-white border border-teal-700"
              }`}
            >
              ラベルの例
            </button>
            <button
              onClick={() => setActiveTab("tips")}
              className={`flex-1 py-2 px-4 rounded-t-lg font-medium ${
                activeTab === "tips"
                  ? "bg-gradient-to-r from-purple-900 to-teal-900 text-yellow-300 border-2 border-b-0 border-yellow-500"
                  : "bg-purple-800/50 text-white border border-teal-700"
              }`}
            >
              ラベリングのコツ
            </button>
          </div>

          {/* Tab content */}
          <div className="bg-gradient-to-b from-purple-900 to-teal-900 rounded-lg rounded-tl-none p-6 border-2 border-yellow-500 shadow-lg mb-6">
            {activeTab === "checklist" && (
              <div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                  ラベリングチェックリスト
                </h2>

                <div className="bg-purple-900/50 p-6 rounded-lg border border-teal-400 mb-6">
                  <div className="space-y-6">
                    <div
                      className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-purple-800/30 cursor-pointer"
                      onClick={() => handleCheckboxChange("madeLabels")}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${checkedItems.madeLabels ? "bg-green-600 border-green-400" : "border-yellow-400 bg-purple-800/50"}`}
                      >
                        {checkedItems.madeLabels && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-yellow-300 mr-2" />
                          <label className="text-xl font-medium text-white cursor-pointer">ラベルを作った</label>
                        </div>
                        <p className="text-teal-300 mt-2">
                          収納場所がわかるラベルを作りましょう。手書き、印刷、写真など、わかりやすい方法で作成してください。
                          小さいお子さんがいる場合は、絵や色のシールを使うとわかりやすいです。
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-purple-800/30 cursor-pointer"
                      onClick={() => handleCheckboxChange("attachedLabels")}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${checkedItems.attachedLabels ? "bg-green-600 border-green-400" : "border-yellow-400 bg-purple-800/50"}`}
                      >
                        {checkedItems.attachedLabels && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-yellow-300 mr-2" />
                          <label className="text-xl font-medium text-white cursor-pointer">ラベルを貼った</label>
                        </div>
                        <p className="text-teal-300 mt-2">
                          作ったラベルを収納場所（引き出し、棚、ボックスなど）の見やすい位置に貼りましょう。
                          テープ、マスキングテープ、ラベルホルダーなどを使って、しっかり固定してください。
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-purple-800/30 cursor-pointer"
                      onClick={() => handleCheckboxChange("sharedWithFamily")}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${checkedItems.sharedWithFamily ? "bg-green-600 border-green-400" : "border-yellow-400 bg-purple-800/50"}`}
                      >
                        {checkedItems.sharedWithFamily && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Share2 className="h-5 w-5 text-yellow-300 mr-2" />
                          <label className="text-xl font-medium text-white cursor-pointer">
                            家族と収納ルールを共有した
                          </label>
                        </div>
                        <p className="text-teal-300 mt-2">
                          家族がいる場合は、新しい収納場所とラベルの意味を共有しましょう。
                          家族全員が同じルールで片付けられるよう、収納の仕組みを説明してください。
                          一人暮らしの方はこのステップをスキップしてOKです。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="bg-teal-800/30 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">進捗状況:</span>
                    <span className={`font-bold ${allChecked ? "text-green-400" : "text-yellow-300"}`}>
                      {checkedCount} / 3
                    </span>
                  </div>
                  <div className="w-full bg-teal-950 rounded-full h-2.5">
                    <div
                      className={`${
                        allChecked ? "bg-green-500" : "bg-gradient-to-r from-yellow-500 to-amber-500"
                      } h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(checkedCount / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "examples" && (
              <div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                  ラベルの例
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      テキストラベル
                    </h3>
                    <div className="space-y-3 text-white">
                      <p>最もシンプルで作りやすいラベル</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>「冬服」「夏服」「下着」「靴下」</li>
                        <li>「書類」「文房具」「工具」</li>
                        <li>「タオル」「シーツ」「枕カバー」</li>
                      </ul>
                      <p className="text-teal-300 text-sm mt-2">✓ 手書きでもパソコンで印刷してもOK</p>
                    </div>
                  </div>

                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      写真ラベル
                    </h3>
                    <div className="space-y-3 text-white">
                      <p>中身が一目でわかる視覚的なラベル</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>収納物の写真を撮って貼る</li>
                        <li>雑誌から切り抜いた画像</li>
                        <li>インターネットから印刷した画像</li>
                      </ul>
                      <p className="text-teal-300 text-sm mt-2">✓ 文字が読めない子どもや高齢者にもわかりやすい</p>
                    </div>
                  </div>

                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      カラーコードラベル
                    </h3>
                    <div className="space-y-3 text-white">
                      <p>色で分類するシンプルなラベル</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>赤：よく使うもの</li>
                        <li>青：季節のもの</li>
                        <li>緑：たまに使うもの</li>
                        <li>黄：子ども用のもの</li>
                      </ul>
                      <p className="text-teal-300 text-sm mt-2">✓ カラーシールやマスキングテープで簡単に作れる</p>
                    </div>
                  </div>

                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      イラストラベル
                    </h3>
                    <div className="space-y-3 text-white">
                      <p>かわいいイラストで楽しく整理</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Tシャツのイラスト → Tシャツ収納</li>
                        <li>靴下のイラスト → 靴下収納</li>
                        <li>本のイラスト → 本棚</li>
                      </ul>
                      <p className="text-teal-300 text-sm mt-2">✓ 子どもと一緒に作ると楽しく、片付けの習慣づけにも</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tips" && (
              <div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                  ラベリングのコツ
                </h2>

                <div className="space-y-6 mb-6">
                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      ラベルの作り方
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-white">
                      <li>シンプルで読みやすいフォントを使う</li>
                      <li>文字は大きめに、遠くからでも読めるサイズに</li>
                      <li>防水素材（ラミネート加工など）を使うと長持ち</li>
                      <li>マスキングテープに直接書いて貼るのも簡単</li>
                      <li>100均のラベルメーカーやラベルシールが便利</li>
                    </ul>
                  </div>

                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      ラベルの貼り方
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-white">
                      <li>見やすい位置（引き出しの前面、ボックスの側面など）に貼る</li>
                      <li>取り出す際に自然と目に入る場所を選ぶ</li>
                      <li>高い場所の収納には底面ではなく手前に貼る</li>
                      <li>透明な収納ボックスなら中身が見えるので最小限のラベルでOK</li>
                      <li>マグネットタイプは金属面に簡単に付け替えられる</li>
                    </ul>
                  </div>

                  <div className="bg-teal-800/30 p-4 rounded-lg border border-teal-600">
                    <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      家族との共有のコツ
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-white">
                      <li>家族全員が理解できるシンプルな分類にする</li>
                      <li>子どもには「ここに戻す」練習を一緒にやってみる</li>
                      <li>写真や色分けで直感的にわかるようにする</li>
                      <li>収納の全体図（マップ）を作って共有するのも効果的</li>
                      <li>定期的に家族会議を開き、使いにくい点があれば改善する</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Complete button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleComplete}
              disabled={!anyChecked}
              className={`bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-purple-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform ${!anyChecked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {allChecked ? "すべて完了！次へ進む" : "ラベリング完了！次へ進む"}
            </Button>
          </div>

          {!allChecked && anyChecked && (
            <p className="text-center text-teal-300 mt-3">
              すべてのステップを完了するとベストですが、一部でも完了していれば次に進めます
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

