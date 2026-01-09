import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardHunterGame from "../../components/games/CardHunterGame";
import "../../styles/card-hunter.css";

export default function CardHunterPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  /* =========================
     INSTRUCTIONS SCREEN
     ========================= */

  if (!started) {
    return (
      <div className="card-hunter-shell">
        <div className="card-hunter-intro">
          <h2>Card Hunter</h2>

          <p className="card-hunter-instructions">
            <strong>Instructions:</strong>  
            The goal is to find the matching pair of cards in each round.
            One card shows a term and another shows its definition.
            <br /><br />
            • The first round starts with 4 cards  
            • Each successful round adds 2 more cards  
            • Pick the correct pair to advance  
            • A wrong match costs a life and restarts the round  
            • The game ends when you lose all lives or finish all rounds  
            <br /><br />
            Score increases with each correct match.
            Try to reach the highest round with the best score!
          </p>

          <div className="card-hunter-actions">
            <button
              className="btn primary"
              onClick={() => setStarted(true)}
            >
              Start Playing
            </button>

            <button
              className="btn secondary"
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
