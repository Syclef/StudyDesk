import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EliminationGame from "../../components/games/EliminationGame";
import "../../styles/elimination.css";

export default function EliminationPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const highScore = localStorage.getItem("auditstudydesk:elimination:high-score") || 0;

  if (started) {
    return (
      <EliminationGame onExit={() => navigate("/game-center")} />
    );
  }

  return (
    <div className="game-intro-page">
      <div className="game-intro-card">
        <div className="game-header">
          <h2>Elimination</h2>
          <span className="high-score-tag">Personal Best: {highScore}</span>
        </div>

        <div className="game-intro-text">
          <strong>Instructions:</strong>
          <p>
            Sudden death mode. Choose the correct term for the given
            definition.
          </p>
          <p className="warning-text">
            <strong>One mistake ends the game instantly.</strong>
          </p>
        </div>

        <ul className="game-intro-list">
          <li>No retries</li>
          <li>No second chances</li>
          <li>Perfect accuracy required</li>
        </ul>

        <div className="game-intro-actions">
          <button
            className="btn btn-primary"
            onClick={() => setStarted(true)}
          >
            Start Playing
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/game-center")}
          >
            Back to Game Center
          </button>
        </div>
      </div>
    </div>
  );
}