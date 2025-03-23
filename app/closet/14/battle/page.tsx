"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Zap, Volume2, VolumeX, Crown, Skull, Flame, Shield, Swords } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Endroll() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // アニメーションシーケンスの状態管理
  const [currentScene, setCurrentScene] = useState(0)
  const [showLightning, setShowLightning] = useState(false)
  const [showBattleScene, setShowBattleScene] = useState(false)
  const [showBossDefeat, setShowBossDefeat] = useState(false)
  const [showVictoryFlash, setShowVictoryFlash] = useState(false)
  const [showKingdomLight, setShowKingdomLight] = useState(false)
  const [showMoChan, setShowMoChan] = useState(false)
  const [dialogueIndex, setDialogueIndex] = useState(-1)
  const [showCrownButton, setShowCrownButton] = useState(false)
  const [showCrown, setShowCrown] = useState(false)
  const [showFin, setShowFin] = useState(false)
  const [showHomeButton, setShowHomeButton] = useState(false)
  const [showBattleEndText, setShowBattleEndText] = useState(false)

  // バトルアニメーションの状態
  const [battlePhase, setBattlePhase] = useState(0)
  const [showHeroAttack, setShowHeroAttack] = useState(false)
  const [showBossAttack, setShowBossAttack] = useState(false)
  const [showFinalAttack, setShowFinalAttack] = useState(false)
  const [bossHealth, setBossHealth] = useState(100)

  // モーちゃんのセリフ
  const dialogues = [
    "偉大なる勇者よ、いや、クローゼット王国の真の君主よ。",
    "あなたが歩んできたその果てしない旅路は、数えきれぬ試練と、面倒臭い作業の連続でした。",
    "そして、あなたはついにこの王国に、かつて失われた秩序と、忘れがたい美しさを取り戻しました。",
    "心の奥底から溢れる賛辞と感謝の意をもって、あなたの偉業に最大の拍手を贈ります。",
    "今、あなた自身が、どれほど深い覚悟と情熱で未来を切り拓いてきたか、身をもって知っているはずです。",
    "いまのあなたになら、もうわかるはずです。",
    "服は、あなたを困らせるものであってはいけない。",
    "服は、その一枚一枚があなたの生き様を照らし出す光であり、あなたを幸せにするものです。",
    "そして、あなたこそ、それらを統治できる唯一無二の支配者なのです。",
    "これから先、再び暗雲が立ち込める時が訪れようとも、あなたの堅固な心と不屈の意志があれば、どんな試練も乗り越えられると信じています。",
    "いつでも、共に新たな旅に出る準備は整っています。",
    "最後に、どうか、受け取って欲しい。",
    "王の証、『クローゼット王国の王冠』を。",
    "あなたこそが、私たちの希望であり、未来への光そのものなのだから。",
    "モオォォォォォ―。",
  ]

  // シンプルな音声初期化
  useEffect(() => {
    const audioElement = new Audio("/endroll.mp3")
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

  // 音声のミュート切り替え
  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    // 直接audioのmuted状態も更新する
    if (audio) {
      audio.muted = newMutedState
    }
  }

  // アニメーションシーケンスのタイミング制御
  useEffect(() => {
    let lightningTimer: NodeJS.Timeout
    let battleStartTimer: NodeJS.Timeout

    // シーン1: 稲妻の演出
    lightningTimer = setTimeout(() => {
      setShowLightning(true)
      setTimeout(() => setShowLightning(false), 2000)
    }, 1000)

    // シーン2: バトルシーンの開始
    battleStartTimer = setTimeout(() => {
      setShowBattleScene(true)
      setCurrentScene(1)

      // バトルフェーズ1: 勇者の攻撃
      setTimeout(() => {
        setShowHeroAttack(true)
        setBossHealth(80)

        setTimeout(() => {
          setShowHeroAttack(false)

          // バトルフェーズ2: ボスの反撃
          setTimeout(() => {
            setShowBossAttack(true)

            setTimeout(() => {
              setShowBossAttack(false)

              // バトルフェーズ3: 勇者の2回目の攻撃
              setTimeout(() => {
                setShowHeroAttack(true)
                setBossHealth(50)

                setTimeout(() => {
                  setShowHeroAttack(false)

                  // バトルフェーズ4: 勇者の必殺技
                  setTimeout(() => {
                    setShowFinalAttack(true)
                    setBossHealth(0)

                    // ボス敗北シーン
                    setTimeout(() => {
                      setShowBossDefeat(true)
                      setShowFinalAttack(false)

                      // 勝利の閃光
                      setTimeout(() => {
                        setShowVictoryFlash(true)
                        setTimeout(() => {
                          setShowVictoryFlash(false)
                          setShowBattleScene(false)

                          // 暗転して「戦いが...ついに...終わった...」のテキスト表示
                          setTimeout(() => {
                            setShowBattleEndText(true)

                            // 4秒後に暗転テキストを消して王国の光のシーンへ
                            setTimeout(() => {
                              setShowBattleEndText(false)

                              // テキストが完全に消えてから0.5秒後に王国の光を表示
                              setTimeout(() => {
                                setShowKingdomLight(true)
                                setCurrentScene(2)

                                // 王国の光が表示されてから2秒後にモーちゃん登場
                                setTimeout(() => {
                                  setShowMoChan(true)
                                  setCurrentScene(3)
                                  // モーちゃんが登場したらすぐに最初のセリフを表示
                                  setDialogueIndex(0)

                                  // セリフの表示 - 最初のセリフはモーちゃん登場時に表示するため、2番目のセリフからスタート
                                  setTimeout(() => {
                                    const intervalId = setInterval(() => {
                                      setDialogueIndex((prev) => {
                                        if (prev < dialogues.length - 1) {
                                          return prev + 1
                                        } else {
                                          clearInterval(intervalId)
                                          // 最後のセリフが表示された後に王冠ボタンを表示
                                          setTimeout(() => setShowCrownButton(true), 1000)
                                          return prev
                                        }
                                      })
                                    }, 6000) // 3秒から6秒に変更

                                    return () => clearInterval(intervalId)
                                  }, 3000) // モーちゃん登場から3秒後に2番目のセリフを表示
                                }, 2000)
                              }, 500)
                            }, 4000)
                          }, 1000)
                        }, 2000)
                      }, 3000)
                    }, 2000)
                  }, 1500)
                }, 1000)
              }, 1500)
            }, 1500)
          }, 1500)
        }, 1500)
      }, 1000)
    }, 1500)

    return () => {
      clearTimeout(lightningTimer)
      clearTimeout(battleStartTimer)
    }
  }, [])

  // handleCrownReceive関数を修正して、正しいパスに遷移するようにします
  const handleCrownReceive = () => {
    // 現在の音楽を停止
    if (audio) {
      audio.pause()
      audio.src = ""
    }

    // 正しいパスに修正: /closet/endroll/crown
    router.push("/closet/14/clear")
  }

  const handleBackToHome = () => {
    try {
      if (audio) {
        audio.pause()
        audio.src = ""
      }
    } catch (error) {
      console.error("Error stopping audio:", error)
    }

    router.push("/home")
  }

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative"
      onClick={tryPlayAudio}
    >
      {/* 背景 */}
      <div className="absolute inset-0 z-0">
        {currentScene >= 2 && (
          <div
            className={`absolute inset-0 bg-gradient-to-t from-purple-900 to-black transition-opacity duration-3000 ${
              showKingdomLight ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* 王国のシルエット - 画像パスを修正 */}
            <div className="absolute bottom-0 w-full h-1/3">
              {/* シルエットの代わりに城や家のアイコンを使用 */}
              <div className="absolute bottom-10 left-1/4 text-6xl opacity-50">🏰</div>
              <div className="absolute bottom-20 left-1/2 text-5xl opacity-40">🏠</div>
              <div className="absolute bottom-5 right-1/4 text-5xl opacity-60">🏛️</div>
              <div className="absolute bottom-15 right-1/3 text-4xl opacity-30">🏡</div>
              <div className="absolute bottom-25 left-1/3 text-4xl opacity-40">🏘️</div>

              {/* 地面の表現 */}
              <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-purple-900 to-transparent"></div>
            </div>

            {/* 差し込む光 */}
            <div
              className={`absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-transparent transition-opacity duration-5000 ${
                showKingdomLight ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>
        )}
      </div>

      {/* 稲妻エフェクト */}
      {showLightning && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="lightning-container">
            <Zap size={100} className="text-yellow-400 animate-lightning-1" />
            <Zap size={120} className="text-yellow-400 animate-lightning-2 absolute top-1/4 left-1/4" />
            <Zap size={80} className="text-yellow-400 animate-lightning-3 absolute bottom-1/3 right-1/3" />
          </div>
        </div>
      )}

      {/* バトルシーン - 新しく追加 */}
      {showBattleScene && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
          <div className="battle-scene w-full max-w-2xl h-80 bg-gradient-to-b from-gray-900 to-red-950 rounded-lg border-2 border-red-800 overflow-hidden relative">
            {/* ボスの体力ゲージ */}
            <div className="absolute top-2 left-0 right-0 flex justify-center">
              <div className="w-3/4 h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                <div
                  className="h-full bg-red-600 transition-all duration-1000 ease-out"
                  style={{ width: `${bossHealth}%` }}
                ></div>
              </div>
            </div>

            {/* ボスキャラクタ�� */}
            <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className={`text-8xl ${bossHealth === 0 ? "animate-boss-death" : "animate-boss-idle"}`}>👿</div>
                {/* ボスの名前 */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-sm whitespace-nowrap">
                  ボス
                </div>
              </div>
            </div>

            {/* 勇者キャラクター */}
            <div className="absolute bottom-10 left-1/4 transform -translate-x-1/2">
              <div className="relative">
                <div className="text-6xl animate-hero-idle">🧙‍♀️</div>
                {/* 勇者の名前 */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-blue-400 font-bold text-sm whitespace-nowrap">
                  あなた
                </div>
              </div>
            </div>

            {/* 勇者の攻撃エフェクト */}
            {showHeroAttack && (
              <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* 魔法の円 */}
                  <div className="absolute inset-0 w-32 h-32 border-4 border-blue-500 rounded-full animate-magic-circle"></div>

                  {/* 魔法の星 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl animate-spin-slow">✨</div>
                  </div>

                  {/* 衝撃波 */}
                  <div className="absolute inset-0 w-32 h-32 border-2 border-blue-300 rounded-full animate-shockwave"></div>
                  <div
                    className="absolute inset-0 w-32 h-32 border-2 border-blue-300 rounded-full animate-shockwave"
                    style={{ animationDelay: "0.3s" }}
                  ></div>

                  {/* ダメージ表示 */}
                  <div className="absolute top-0 right-0 text-2xl font-bold text-yellow-400 animate-damage-number">
                    -20!
                  </div>
                </div>
              </div>
            )}

            {/* ボスの攻撃エフェクト */}
            {showBossAttack && (
              <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                  {/* 炎の攻撃 */}
                  <div className="absolute inset-0 w-24 h-24">
                    <Flame size={80} className="text-red-500 animate-flame" />
                    <Flame
                      size={60}
                      className="absolute top-2 left-2 text-orange-500 animate-flame"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <Flame
                      size={40}
                      className="absolute top-4 left-4 text-yellow-500 animate-flame"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>

                  {/* 勇者の防御 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield size={50} className="text-blue-400 animate-shield" />
                  </div>

                  {/* ミス表示 */}
                  <div className="absolute top-0 left-0 text-2xl font-bold text-blue-400 animate-miss-text">BLOCK!</div>
                </div>
              </div>
            )}

            {/* 必殺技エフェクト */}
            {showFinalAttack && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* 必殺技の光の柱 */}
                  <div className="absolute inset-0 w-full h-screen bg-gradient-to-t from-blue-500/0 via-blue-500/50 to-blue-500/0 animate-light-pillar"></div>

                  {/* 剣のエフェクト */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Swords size={100} className="text-blue-300 animate-final-attack" />
                  </div>

                  {/* 衝撃波の輪 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-blue-400 rounded-full animate-expand-ring"></div>
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-blue-300 rounded-full animate-expand-ring"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-blue-200 rounded-full animate-expand-ring"
                    style={{ animationDelay: "0.6s" }}
                  ></div>

                  {/* クリティカルヒット表示 */}
                  <div className="absolute top-1/4 right-1/4 text-3xl font-bold text-yellow-400 animate-critical-hit">
                    CRITICAL HIT!
                  </div>
                  <div
                    className="absolute top-1/3 right-1/4 text-4xl font-bold text-yellow-400 animate-critical-hit"
                    style={{ animationDelay: "0.5s" }}
                  >
                    -50!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* バトルテキスト */}
          <div className="mt-4 text-center text-xl font-bold text-yellow-300 animate-battle-text">
            {showFinalAttack
              ? "必殺技：断捨離の剣！"
              : showBossAttack
                ? "リバウンドラゴンの攻撃！しかし防御した！"
                : showHeroAttack
                  ? "あなたの攻撃が命中！"
                  : "最後の戦い！"}
          </div>
        </div>
      )}

      {/* ボスの敗北シーン */}
      {showBossDefeat && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className={`boss-defeat-effect ${showBossDefeat ? "animate-boss-defeat" : ""}`}>
            {/* 稲妻と爆発エフェクトの組み合わせ */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <div className="absolute inset-0 bg-red-900/30 rounded-full animate-pulse-fast"></div>

              {/* 複数の稲妻 */}
              <Zap
                size={60}
                className="absolute text-red-500 top-1/4 left-1/4 transform -rotate-45 animate-lightning-fade"
              />
              <Zap
                size={50}
                className="absolute text-orange-500 bottom-1/4 right-1/3 transform rotate-45 animate-lightning-fade"
                style={{ animationDelay: "0.2s" }}
              />
              <Zap
                size={40}
                className="absolute text-yellow-500 top-1/3 right-1/4 transform rotate-90 animate-lightning-fade"
                style={{ animationDelay: "0.4s" }}
              />

              {/* 爆発を表現する放射状の線 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-explosion"></div>
              </div>

              {/* 中央の赤い光 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full animate-pulse-shrink"></div>
              </div>

              {/* 敗北したボスのアイコン */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-boss-final-defeat">
                👿
              </div>

              {/* 骸骨のアイコン - ボスが倒れた後に表示 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 animate-skull-appear">
                <Skull size={60} className="text-gray-200" />
              </div>
            </div>

            {/* 敗北の効果音を表現するテキスト */}
            <div className="mt-4 text-red-500 font-bold text-xl animate-text-fade">ドゴォォン...</div>

            {/* 勝利メッセージ */}
            <div className="mt-8 text-yellow-400 font-bold text-2xl animate-victory-text">ボスを倒した！</div>
          </div>
        </div>
      )}

      {/* 勝利の閃光 */}
      {showVictoryFlash && <div className="absolute inset-0 z-25 bg-white animate-victory-flash"></div>}

      {/* 戦いが終わったテキスト */}
      {showBattleEndText && (
        <div className="absolute inset-0 z-25 flex items-center justify-center bg-black">
          <p className="text-2xl sm:text-3xl text-white font-bold animate-battle-end-text">
            戦いが
            <span className="inline-block animate-text-appear" style={{ animationDelay: "1s" }}>
              ...
            </span>
            ついに
            <span className="inline-block animate-text-appear" style={{ animationDelay: "2s" }}>
              ...
            </span>
            終わった
            <span className="inline-block animate-text-appear" style={{ animationDelay: "3s" }}>
              ...
            </span>
          </p>
        </div>
      )}

      {/* モーちゃんと対話 */}
      {showMoChan && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* モーちゃんのアイコン - 丸く切り抜いてライムグリーンの縁取りを追加 */}
            <div
              className={`mo-chan-icon mb-8 transition-opacity duration-2000 ${showMoChan ? "opacity-100" : "opacity-0"}`}
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                {/* ライムグリーンの縁取り */}
                <div className="absolute inset-0 rounded-full bg-lime-500 animate-pulse-glow"></div>

                {/* 内側の光る効果 */}
                <div className="absolute inset-1 rounded-full bg-lime-300/30 animate-pulse"></div>

                {/* モーちゃんの画像 - 丸く切り抜き */}
                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-lime-400">
                  <Image src="/cow-fairy.webp" alt="片付けの妖精モーちゃん" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* セリフ表示エリア */}
            <div className="dialogue-box w-full bg-gradient-to-r from-purple-900/80 to-indigo-900/80 p-4 rounded-lg border border-purple-500 min-h-[120px] flex items-center justify-center">
              {dialogueIndex >= 0 && (
                <p className="text-lg sm:text-xl text-center animate-fade-in">{dialogues[dialogueIndex]}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 王冠を受け取るボタン */}
      {showCrownButton && (
        <div className="absolute bottom-20 z-40 animate-bounce-slow">
          <Button
            onClick={handleCrownReceive}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          >
            <Crown className="h-5 w-5" />
            <span>王冠を受け取る</span>
          </Button>
        </div>
      )}

      {/* 王冠のアニメーション */}
      {showCrown && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="animate-crown-appear">
            <Crown size={120} className="text-yellow-400 animate-pulse-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full animate-sparkle"></div>
            </div>
          </div>
        </div>
      )}

      {/* FIN表示 */}
      {showFin && (
        <div className="absolute inset-0 z-60 flex items-center justify-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-fin-appear">
            Closet Chronicle FIN
          </h1>
        </div>
      )}

      {/* ホームに戻るボタン */}
      {showHomeButton && (
        <div className="absolute bottom-10 z-70 animate-fade-in">
          <Button
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>ホームに戻る</span>
          </Button>
        </div>
      )}

      {/* 音声コントロール - 右上に1つだけ配置 */}
      <div className="fixed top-4 right-4 z-80">
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
        @keyframes lightning {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          10%, 90% { opacity: 1; transform: scale(1.2); }
          20%, 80% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        .animate-lightning-1 {
          animation: lightning 1s ease-in-out;
        }
        
        .animate-lightning-2 {
          animation: lightning 1s ease-in-out 0.2s;
        }
        
        .animate-lightning-3 {
          animation: lightning 1s ease-in-out 0.4s;
        }
        
        @keyframes bossDefeat {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          20% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
          40% { transform: translateY(-10px) rotate(-10deg); opacity: 0.9; }
          60% { transform: translateY(10px) rotate(15deg); opacity: 0.7; }
          80% { transform: translateY(30px) rotate(-5deg); opacity: 0.5; }
          100% { transform: translateY(50px) rotate(0deg); opacity: 0; }
        }
        
        .animate-boss-defeat {
          animation: bossDefeat 4s forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite ease-in-out;
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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
        
        .transition-opacity {
          transition-property: opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .duration-3000 {
          transition-duration: 3000ms;
        }
        
        .duration-5000 {
          transition-duration: 5000ms;
        }

        /* 既存のアニメーション定義は維持 */
  
        @keyframes lightningFade {
          0% { opacity: 1; transform: scale(1.2); }
          50% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        
        .animate-lightning-fade {
          animation: lightningFade 1.5s forwards;
        }
        
        @keyframes explosion {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.8); }
          70% { box-shadow: 0 0 0 50px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 70px rgba(220, 38, 38, 0); }
        }
        
        .animate-explosion {
          animation: explosion 2s forwards;
        }
        
        @keyframes pulseFast {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .animate-pulse-fast {
          animation: pulseFast 0.5s infinite;
        }
        
        @keyframes pulseShrink {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        .animate-pulse-shrink {
          animation: pulseShrink 2s forwards;
        }
        
        @keyframes textFade {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        
        .animate-text-fade {
          animation: textFade 3s forwards;
        }
        
        /* 新しいアニメーション: ライムグリーンの縁取りが光るエフェクト */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px 2px rgba(132, 204, 22, 0.7); }
          50% { box-shadow: 0 0 20px 5px rgba(132, 204, 22, 0.9); }
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite ease-in-out;
        }
        
        /* バトルシーン用の新しいアニメーション */
        @keyframes boss-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-boss-idle {
          animation: boss-idle 2s infinite ease-in-out;
        }
        
        @keyframes hero-idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(3deg); }
        }
        
        .animate-hero-idle {
          animation: hero-idle 2s infinite ease-in-out;
        }
        
        @keyframes magic-circle {
          0% { transform: scale(0.5) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0.5) rotate(360deg); opacity: 0; }
        }
        
        .animate-magic-circle {
          animation: magic-circle 2s forwards;
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        @keyframes shockwave {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-shockwave {
          animation: shockwave 1.5s forwards;
        }
        
        @keyframes damage-number {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          80% { transform: translateY(-30px) scale(1.5); opacity: 0.8; }
          100% { transform: translateY(-40px) scale(1); opacity: 0; }
        }
        
        .animate-damage-number {
          animation: damage-number 1.5s forwards;
        }
        
        @keyframes flame {
          0% { transform: scale(0.8) rotate(-5deg); opacity: 0.7; }
          50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(0.8) rotate(-5deg); opacity: 0.7; }
        }
        
        .animate-flame {
          animation: flame 0.8s infinite;
        }
        
        @keyframes shield {
          0% { transform: scale(1); opacity: 0.5; }
          25% { transform: scale(1.3); opacity: 1; }
          50% { transform: scale(1); opacity: 0.8; }
          75% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        
        .animate-shield {
          animation: shield 1.5s forwards;
        }
        
        @keyframes miss-text {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          80% { transform: translateY(-20px) scale(1.3); opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1); opacity: 0; }
        }
        
        .animate-miss-text {
          animation: miss-text 1.5s forwards;
        }
        
        @keyframes light-pillar {
          0% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(0); }
        }
        
        .animate-light-pillar {
          animation: light-pillar 2s forwards;
        }
        
        @keyframes final-attack {
          0% { transform: scale(0.5) rotate(-45deg); opacity: 0.5; }
          25% { transform: scale(1.5) rotate(0deg); opacity: 1; }
          50% { transform: scale(1) rotate(45deg); opacity: 0.8; }
          75% { transform: scale(1.5) rotate(90deg); opacity: 1; }
          100% { transform: scale(0.5) rotate(135deg); opacity: 0; }
        }
        
        .animate-final-attack {
          animation: final-attack 2s forwards;
        }
        
        @keyframes expand-ring {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        
        .animate-expand-ring {
          animation: expand-ring 1.5s forwards;
        }
        
        @keyframes critical-hit {
          0% { transform: scale(0.8); opacity: 0; }
          25% { transform: scale(1.5); opacity: 1; }
          75% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        
        .animate-critical-hit {
          animation: critical-hit 2s forwards;
        }
        
        @keyframes battle-text {
          0% { transform: scale(0.8); opacity: 0; }
          10% { transform: scale(1.1); opacity: 1; }
          90% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        
        .animate-battle-text {
          animation: battle-text 2s forwards;
        }
        
        @keyframes boss-death {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          25% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          50% { transform: scale(0.9) rotate(-15deg); opacity: 0.8; }
          75% { transform: scale(1.1) rotate(5deg); opacity: 0.5; }
          100% { transform: scale(0.5) rotate(0deg); opacity: 0; }
        }
        
        .animate-boss-death {
          animation: boss-death 3s forwards;
        }
        
        @keyframes boss-final-defeat {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          30% { transform: scale(1.2) rotate(20deg); opacity: 0.8; }
          60% { transform: scale(0.8) rotate(-30deg); opacity: 0.5; }
          100% { transform: scale(0) rotate(0deg); opacity: 0; }
        }
        
        .animate-boss-final-defeat {
          animation: boss-final-defeat 2s forwards;
        }
        
        @keyframes skull-appear {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.2) rotate(10deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        .animate-skull-appear {
          animation: skull-appear 3s forwards;
        }
        
        @keyframes victory-text {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.3); opacity: 1; }
          85% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-victory-text {
          animation: victory-text 4s forwards;
        }
        
        @keyframes victory-flash {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .animate-victory-flash {
          animation: victory-flash 2s forwards;
        }

        @keyframes battle-end-text {
          0% { opacity: 0; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }

        .animate-battle-end-text {
          animation: battle-end-text 4s forwards;
        }

        @keyframes text-appear {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-text-appear {
          animation: text-appear 0.5s forwards;
        }
      `}</style>
    </div>
  )
}

