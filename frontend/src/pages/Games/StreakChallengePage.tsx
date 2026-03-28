import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StreakChallengeGame from "../../components/games/StreakChallengeGame";
import "../../styles/streak-challenge.css";

type Mode = "normal" | "hard";

export default function StreakChallengePage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode>("normal");

  const highScore = localStorage.getItem("auditstudydesk:streak-challenge:high-score") || 0;

  if (started) {
    return (
      <StreakChallengeGame
        mode={mode}
        onExit={() => navigate("/game-center")}
      />
    );
  }

  return (
    <div className="game-intro-page">
      <div className="game-intro-card">
        <div className="game-header">
          <h2>Streak Challenge</h2>
          <span className="high-score-tag">Personal Best: {highScore}</span>
        </div>

        <div className="game-intro-text">
          <strong>Instructions:</strong>
          <p>
            Build the longest correct streak possible. The pressure increases
            as your streak grows.
          </p>
        </div>

        <ul className="game-intro-list">
          <li>Correct answer = +1 streak</li>
          <li>Normal: wrong answer resets streak</li>
          <li>Hard: one mistake ends the game</li>
        </ul>

        <h3 className="game-category-title margin-top-24">
          Select Difficulty
        </h3>

        <div className="game-mode-selector">
          <button
            className={`mode-card ${mode === "normal" ? "active" : ""}`}
            onClick={() => setMode("normal")}
          >
            <strong>Normal</strong>
            <p>Mistakes reset your streak.</p>
          </button>

          <button
            className={`mode-card ${mode === "hard" ? "active" : ""}`}
            onClick={() => setMode("hard")}
          >
            <strong>Hard</strong>
            <p>One mistake ends the run.</p>
          </button>
        </div>

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