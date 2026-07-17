import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardPickerGame, { INITIAL_LIVES } from "../../components/games/CardPickerGame";
import "../../styles/game-center.css"; 

export default function CardPickerPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  /* =========================
     INSTRUCTIONS SCREEN
     ========================= */
  if (!started) {
    return (
      <div className="game-intro-page">
        <div className="game-intro-card">
          <h2>Card Picker</h2>

          <div className="game-intro-text">
            <strong>Instructions:</strong>
            <p>
              Match the term shown at the top with the correct definition from the cards below. 
              Keep your streak alive to maximize your bonus points!
            </p>
          </div>

          <ul className="game-intro-list">
            <li>Each correct answer adds to your score</li>
            <li>You have {INITIAL_LIVES} lives—don't lose them!</li>
            <li>The game ends if you run out of lives or cards</li>
          </ul>

          <p className="game-intro-text intro-text-margin">
            Ready to test your knowledge?
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
              onClick={() => navigate("/games")}
            >
              Back to Game Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     ACTUAL GAME SCREEN
     ========================= */
  return <CardPickerGame onExit={() => navigate("/games")} />;
}