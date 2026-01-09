import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardPickerGame from "../../components/games/CardPickerGame";
import "../../styles/card-picker.css";

export default function CardPickerPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  /* =========================
     INSTRUCTIONS SCREEN
     ========================= */

  if (!started) {
    return (
      <div className="card-picker-page">
        <div className="card-picker-intro">
          <h2>Card Picker</h2>

          <p className="card-picker-instructions">
            <strong>Instructions:</strong><br />
            You will be shown a question and multiple answer cards.
            Your task is to pick the correct answer as quickly as possible.
            <br /><br />
            • Faster answers earn more points  
            • Wrong answers reduce your score  
            • Difficulty increases as you progress  
            • Try to achieve the highest score possible  
            <br /><br />
            Think fast and choose wisely!
          </p>

          <div className="card-picker-actions">
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

  return (
    <CardPickerGame
      onExit={() => navigate("/game-center")}
    />
  );
}
