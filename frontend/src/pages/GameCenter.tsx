import { useState } from "react";
import { GameTile } from "../components/GameTile";
import ResetScoresModal from "../components/ResetScoresModal";
import {
  getHighScore,
  getLastPlayed,
  resetGame,
  resetAllGames
} from "../utils/scoreUtils";
import "../styles/game-center.css";

/* 🔐 SIMPLE ADMIN FLAG (EXTEND LATER) */
const IS_ADMIN = true;

export default function GameCenter() {
  const [modal, setModal] = useState<null | {
    type: "single" | "all";
    game?: "card-picker" | "card-hunter";
  }>(null);

  const cardPickerHigh = getHighScore("card-picker");
  const cardHunterHigh = getHighScore("card-hunter");

  const rank = (score: number) =>
    score > 0 ? Math.max(1, 1000 - score) : 0;

  function confirmReset() {
    if (modal?.type === "single" && modal.game) {
      resetGame(modal.game);
    }
    if (modal?.type === "all") {
      resetAllGames();
    }
    setModal(null);
    window.location.reload();
  }

  return (
    <div className="game-center">
      <div className="game-center-header">
        <h1>Game Center</h1>

        {IS_ADMIN && (
          <button
            className="reset-scores-btn"
            onClick={() => setModal({ type: "all" })}
          >
            Reset All Scores
          </button>
        )}
      </div>

      <div className="game-grid">
        <GameTile
          title="Card Picker"
          highestScore={cardPickerHigh}
          rank={rank(cardPickerHigh)}
          to="/game-center/card-picker"
          lastPlayed={getLastPlayed("card-picker")}
          onReset={
            IS_ADMIN
              ? () =>
                  setModal({
                    type: "single",
                    game: "card-picker"
                  })
              : undefined
          }
        />

        <GameTile
          title="Card Hunter"
          highestScore={cardHunterHigh}
          rank={rank(cardHunterHigh)}
          to="/game-center/card-hunter"
          lastPlayed={getLastPlayed("card-hunter")}
          onReset={
            IS_ADMIN
              ? () =>
                  setModal({
                    type: "single",
                    game: "card-hunter"
                  })
              : undefined
          }
        />
      </div>

      <ResetScoresModal
        open={!!modal}
        label={
          modal?.type === "all"
            ? "This will reset ALL game scores and history."
            : "This will reset this game's score and history."
        }
        onConfirm={confirmReset}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
