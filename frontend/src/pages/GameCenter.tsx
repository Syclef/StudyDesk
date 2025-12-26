import { GameTile } from "../components/GameTile";
import "../styles/game-center.css";
import {
  loadHighScore,
  resetAllScores
} from "../utils/scoreUtils";

export default function GameCenter() {
  const picker = loadHighScore("auditstudydesk:card-picker");
  const hunter = loadHighScore("auditstudydesk:card-hunter");

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

  return (
    <div className="game-center">
      <h1 className="game-center-title">Game Center</h1>

      <div className="game-center-reset">
        <button onClick={handleReset}>
          Reset Scores & Rankings
        </button>
      </div>

      <div className="game-grid">
        <GameTile
          title="Card Picker"
          highestScore={picker.raw}
          rank={picker.weighted}
          to="/game-center/card-picker"
        />

        <GameTile
          title="Card Hunter"
          highestScore={hunter.raw}
          rank={hunter.weighted}
          to="/game-center/card-hunter"
        />
      </div>
    </div>
  );
}
