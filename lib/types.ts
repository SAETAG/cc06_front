export interface Challenge {
  id: string
  title: string
  description: string
  type: "clothing" | "socks" | "trash" | "other"
  expReward: number
  itemReward: string
  itemType: "box" | "scroll" | "amulet" | "leaf" | "gem" | "crystal" | string
  completed: boolean
}

