import { GameTile } from "../components/GameTile";
import "../styles/game-center.css";
import { GAMES, GameCategory } from "../utils/games";
import {
  loadHighScore,
  resetAllScores
} from "../utils/scoreUtils";

const CATEGORY_LABELS: Record<GameCategory, string> = {
  speed: "Speed & Focus",
  accuracy: "Accuracy & Mastery",
  memory: "Memory",
  challenge: "Challenge",
  improvement: "Improve Weaknesses"
};

export default function GameCenter() {
  function handleReset() {
    if (
      window.confirm(
        "Reset all game scores and rankings?\nThis cannot be undone."
      )
    ) {
      resetAllScores();
      window.location.reload();
    }
  }

  const gamesByCategory = GAMES.reduce<Record<GameCategory, typeof GAMES>>(
    (acc, game) => {
      acc[game.category].push(game);
      return acc;
    },
    {
      speed: [],
      accuracy: [],
      memory: [],
      challenge: [],
      improvement: []
    }
  );

  return (
    <div className="game-center">
      <h1 className="game-center-title">Game Center</h1>

      <div className="game-center-reset">
        <button onClick={handleReset}>
          Reset Scores & Rankings
        </button>
      </div>

      {Object.entries(gamesByCategory).map(([category, games]) => {
        if (!games.length) return null;

        return (
          <section
            key={category}
            className="game-category"
          >
            <h2 className="game-category-title">
              {CATEGORY_LABELS[category as GameCategory]}
            </h2>

            <div className="game-grid">
              {games.map(game => {
                const score = game.enabled
                  ? loadHighScore(`auditstudydesk:${game.id}`)
                  : null;

                return (
                  <GameTile
                    key={game.id}
                    title={game.title}
                    highestScore={score?.raw ?? 0}
                    rank={score?.weighted ?? 0}
                    to={game.route}
                    disabled={!game.enabled}
                    badge={game.comingSoon ? "Coming Soon" : undefined}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
