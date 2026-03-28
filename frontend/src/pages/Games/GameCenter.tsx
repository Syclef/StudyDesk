import { GameTile } from "../../components/games/GameTile";
import { GAMES, type GameCategory } from "../../utils/games";
import "../../styles/game-center.css";

/* =========================
   Helpers
   ========================= */

function getHighScore(key?: string): number | null {
  if (!key) return null;

  const raw = localStorage.getItem(key);
  if (raw === null) return null;

  const score = Number(raw);
  return Number.isFinite(score) ? score : null;
}

/* =========================
   Category Metadata
   ========================= */

const CATEGORY_META: Record<
  GameCategory,
  { label: string; icon: string }
> = {
  speed: { label: "Speed Games", icon: "⏱️" },
  memory: { label: "Memory Games", icon: "🧠" },
  accuracy: { label: "Accuracy Games", icon: "🎯" },
  challenge: { label: "Challenge Games", icon: "⚠️" },
};

const CATEGORY_ORDER: GameCategory[] = [
  "speed",
  "memory",
  "accuracy",
  "challenge",
];

/* =========================
   Component
   ========================= */

export default function GameCenter() {
  return (
    <div className="game-center">
      <h1 className="game-center-title">Game Center</h1>

      {CATEGORY_ORDER.map(category => {
        const games = GAMES.filter(
          game => game.category === category
        );

        if (games.length === 0) return null;

        const meta = CATEGORY_META[category];

        return (
          <section
            key={category}
            className="game-category"
          >
            <h2 className="game-category-title">
              {meta.icon} {meta.label}
            </h2>

            <div className="game-grid">
              {games.map(game => (
                <GameTile
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  highestScore={getHighScore(game.scoreKey) ?? 0}
                  rank={null}
                  to={game.route}
                  disabled={!game.enabled}
                  badge={game.badge}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
