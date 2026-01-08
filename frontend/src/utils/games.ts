export type GameCategory =
  | "speed"
  | "accuracy"
  | "memory"
  | "challenge"
  | "improvement";

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  route: string;
  enabled: boolean;
  comingSoon?: boolean;
}

export const GAMES: GameDefinition[] = [
  {
    id: "card-hunter",
    title: "Card Hunter",
    description: "Answer quickly and build streaks for higher scores.",
    category: "speed",
    route: "/card-hunter",
    enabled: true,
  },
  {
    id: "practice-mode",
    title: "Practice Mode",
    description: "Practice questions with feedback and light scoring.",
    category: "accuracy",
    route: "/practice",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "flashcard-blitz",
    title: "Flashcard Blitz",
    description: "Rapid-fire flashcards to test recall under pressure.",
    category: "memory",
    route: "/flashcard-blitz",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "time-attack",
    title: "Time Attack",
    description: "Answer as many questions as possible before time runs out.",
    category: "speed",
    route: "/time-attack",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "elimination",
    title: "Elimination",
    description: "One mistake ends the game. How far can you go?",
    category: "challenge",
    route: "/elimination",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "streak-challenge",
    title: "Streak Challenge",
    description: "Maintain a perfect streak as long as you can.",
    category: "challenge",
    route: "/streak",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "domain-mastery",
    title: "Domain Mastery",
    description: "Focus on one domain and build mastery over time.",
    category: "accuracy",
    enabled: false,
    comingSoon: true,
    route: "/domain-mastery",
  },
  {
    id: "mistake-review",
    title: "Mistake Review",
    description: "Turn past mistakes into strengths.",
    category: "improvement",
    enabled: false,
    comingSoon: true,
    route: "/mistake-review",
  },
];
