export type GameCategory =
  | "speed"
  | "accuracy"
  | "memory"
  | "challenge";

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  route: string;
  enabled: boolean;
  badge?: string;
  scoreKey?: string;
}

export const GAMES: GameDefinition[] = [
  {
    id: "card-hunter",
    title: "Card Hunter",
    description: "Match terms and definitions under pressure.",
    category: "memory",
    route: "/game-center/card-hunter",
    enabled: true,
    scoreKey: "auditstudydesk:card-hunter:high-score",
  },

  {
    id: "card-picker",
    title: "Card Picker",
    description: "Pick the correct answer as fast as you can.",
    category: "speed",
    route: "/game-center/card-picker",
    enabled: true,
    scoreKey: "auditstudydesk:card-picker:high-score",
  },

  {
    id: "flashcard-blitz",
    title: "Flashcard Blitz",
    description: "Rapid-fire recall with a ticking clock.",
    category: "speed",
    route: "/game-center/flashcard-blitz",
    enabled: true,
    scoreKey: "auditstudydesk:flashcard-blitz:high-score",
  },

  {
    id: "time-attack",
    title: "Time Attack",
    description: "Answer as many questions as possible before time runs out.",
    category: "speed",
    route: "/game-center/time-attack",
    enabled: false,
    badge: "Coming Soon",
  },

  {
    id: "elimination",
    title: "Elimination",
    description: "One mistake ends the game. No second chances.",
    category: "challenge",
    route: "/game-center/elimination",
    enabled: false,
    badge: "Coming Soon",
  },

  {
    id: "streak-challenge",
    title: "Streak Challenge",
    description: "Maintain a perfect streak for as long as you can.",
    category: "challenge",
    route: "/game-center/streak",
    enabled: false,
    badge: "Coming Soon",
  },
];
