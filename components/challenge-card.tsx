"use client"

import { useState } from "react"
import {
  Check,
  Trash,
  Shirt,
  FootprintsIcon as Socks,
  Box,
  Scroll,
  GemIcon as Amulet,
  Leaf,
  Gem,
  SnowflakeIcon as Crystal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/lib/types"

interface ChallengeCardProps {
  challenge: Challenge
  onComplete: (id: string) => void
}

export function ChallengeCard({ challenge, onComplete }: ChallengeCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  // Get the appropriate icon based on challenge type
  const getIcon = () => {
    switch (challenge.type) {
      case "clothing":
        return <Shirt className="h-8 w-8" />
      case "socks":
        return <Socks className="h-8 w-8" />
      case "other":
        return <Shirt className="h-8 w-8" />
      default:
        return <Trash className="h-8 w-8" />
    }
  }

  // Get the appropriate item icon based on item type
  const getItemIcon = () => {
    switch (challenge.itemType) {
      case "box":
        return <Box className="h-4 w-4" />
      case "scroll":
        return <Scroll className="h-4 w-4" />
      case "amulet":
        return <Amulet className="h-4 w-4" />
      case "leaf":
        return <Leaf className="h-4 w-4" />
      case "gem":
        return <Gem className="h-4 w-4" />
      case "crystal":
        return <Crystal className="h-4 w-4" />
      default:
        return <Box className="h-4 w-4" />
    }
  }

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${
        challenge.completed
          ? "transform hover:-translate-y-1 hover:shadow-lg"
          : "transform hover:-translate-y-1 hover:shadow-lg"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card background with lime green texture effect */}
      <div
        className={`absolute inset-0 rounded-lg border ${
          challenge.completed
            ? "bg-gradient-to-b from-lime-800/95 to-green-900/95 border-lime-500/50"
            : "bg-gradient-to-b from-lime-600/90 to-lime-800/90 border-lime-400/50"
        }`}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0">
        <div className={`w-16 h-8 rounded-bl-full ${challenge.completed ? "bg-lime-600/30" : "bg-lime-400/30"}`} />
      </div>
      <div className="absolute bottom-0 left-0">
        <div className={`w-12 h-12 rounded-tr-full ${challenge.completed ? "bg-lime-700/30" : "bg-lime-500/30"}`} />
      </div>

      {/* Card content */}
      <div className="relative p-6 backdrop-blur-sm">
        <div className="flex items-start mb-4">
          <div
            className={`p-3 rounded-full mr-4 ${
              challenge.completed ? "bg-green-800/60 text-lime-300" : "bg-lime-700/40 text-lime-200"
            }`}
          >
            {getIcon()}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${challenge.completed ? "text-lime-300" : "text-lime-100"}`}>
              {challenge.title}
            </h3>
            <p className={`mt-1 ${challenge.completed ? "text-lime-300/80" : "text-lime-200/80"}`}>
              {challenge.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <div className="text-sm flex items-center">
              <span className={`${challenge.completed ? "text-lime-400" : "text-lime-300"}`}>
                +{challenge.expReward} EXP
              </span>
            </div>
            <div className="flex items-center">
              <div className={`p-1 rounded-full mr-2 ${challenge.completed ? "bg-green-800/60" : "bg-lime-700/40"}`}>
                {getItemIcon()}
              </div>
              <span className={`text-sm ${challenge.completed ? "text-cyan-400" : "text-cyan-300"}`}>
                {challenge.itemReward}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            {challenge.completed ? (
              <div className="bg-green-800/80 text-lime-100 px-3 py-1 rounded-full flex items-center">
                <Check className="w-4 h-4 mr-1" />
                <span>達成済み</span>
              </div>
            ) : (
              <Button
                onClick={() => onComplete(challenge.id)}
                className="bg-lime-600 hover:bg-lime-500 text-white border-2 border-lime-400/30"
              >
                完了
              </Button>
            )}
          </div>
        </div>

        {/* Completion effect */}
        {challenge.completed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-green-800/20 to-green-900/20" />
            <div className="bg-green-700/80 rounded-full p-3 shadow-lg shadow-green-900/50 z-10">
              <Check className="w-8 h-8 text-lime-100" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

