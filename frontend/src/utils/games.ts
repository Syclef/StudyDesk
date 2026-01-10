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
    description: "A high-stakes memory gauntlet. Identify the matching pairs and survive the rising difficulty. You have 3 lives to conquer the deck—how deep into the rounds can you go",
    category: "memory",
    route: "/game-center/card-hunter",
    enabled: true,
    scoreKey: "auditstudydesk:card-hunter:high-score",
  },

  {
    id: "card-picker",
    title: "Card Picker",
    description: "The ultimate test of accuracy. Navigate through the flashcard deck with only 3 lives to spare. Every mistake brings you closer to defeat—how many cards can you clear before your health runs out?",
    category: "speed",
    route: "/game-center/card-picker",
    enabled: true,
    scoreKey: "auditstudydesk:card-picker:high-score",
  },

  {
    id: "flashcard-blitz",
    title: "Flashcard Blitz",
    description: "Rapid-fire recall under pressure! Choose the right term before the fuse runs out. Build your combo to boost your score, but beware: every mistake eats away at your remaining time. Speed is key, but precision is everything.",
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
    enabled: true,
    scoreKey: "auditstudydesk:time-attack:high-score",
  },

  {
    id: "elimination",
    title: "Elimination",
    description: "One mistake ends the game. No second chances.",
    category: "challenge",
    route: "/game-center/elimination",
    enabled: true,
    scoreKey: "auditstudydesk:elimination:high-score",
  },

  {
    id: "streak-challenge",
    title: "Streak Challenge",
    description: "Maintain a perfect streak for as long as you can.",
    category: "challenge",
    route: "/game-center/streak-challenge",
    enabled: true,
    scoreKey: "auditstudydesk:streak-challenge:high-score",
  },
];
