import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardHunterGame from "../../components/games/CardHunterGame";
/* Using the unified game-center styles for consistency */
import "../../styles/game-center.css";

export default function CardHunterPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  /* =========================
      INSTRUCTIONS SCREEN
      ========================= */

  if (!started) {
    return (
      <div className="game-intro-page">
        <div className="game-intro-card">
          <h2>Card Hunter</h2>

          <div className="game-intro-text">
            <strong>Instructions:</strong>
            <p>
              The goal is to find the matching pair of cards in each round. 
              One card shows a term and another shows its definition. 
              Precision and memory are your best tools!
            </p>
          </div>

          <ul className="game-intro-list">
            <li>The first round starts with 4 cards</li>
            <li>Each successful round adds 2 more cards to the board</li>
            <li>Pick the correct pair to advance to the next level</li>
            <li>A wrong match costs a life and restarts the current round</li>
            <li>The game ends when you lose all lives or finish all rounds</li>
          </ul>

          <p className="game-intro-text score-text">
            Score increases with each correct match. Try to reach the highest round!
          </p>

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

  /* =========================
      GAME ENGINE
      ========================= */

  return <CardHunterGame />;
}