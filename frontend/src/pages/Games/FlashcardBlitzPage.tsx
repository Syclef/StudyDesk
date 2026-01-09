import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Mode = "easy" | "normal" | "hard";

const MODE_INFO: Record<
  Mode,
  {
    label: string;
    description: string;
    scoreKey: string;
  }
> = {
  easy: {
    label: "Easy",
    description:
      "10 seconds per card. No penalties. Focus on recall.",
    scoreKey:
      "auditstudydesk:flashcard-blitz:easy",
  },
  normal: {
    label: "Normal",
    description:
      "7 seconds per card. Combo adds time. Wrong answers reduce game time.",
    scoreKey:
      "auditstudydesk:flashcard-blitz:normal",
  },
  hard: {
    label: "Hard",
    description:
      "5 seconds per card. More options. Heavy time penalties.",
    scoreKey:
      "auditstudydesk:flashcard-blitz:hard",
  },
};

function getHighScore(key: string): number | null {
  const value = localStorage.getItem(key);
  return value ? Number(value) : null;
}

export default function FlashcardBlitzPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("normal");

  return (
    <div className="game-intro-page">
      <div className="game-intro-card">
        <h2>Flashcard Blitz</h2>

        <p className="game-intro-text">
          <strong>Instructions:</strong>
          <br />
          A definition is shown with multiple terms
          underneath. You must choose the correct term
          before time runs out.
        </p>

        <ul className="game-intro-list">
          <li>1-minute game</li>
          <li>Forced recall under time pressure</li>
          <li>Combos reward accuracy</li>
          <li>Mistakes may reduce game time</li>
        </ul>

        {/* MODE SELECTOR */}
        <h3 className="mode-selector-heading">
          Select Difficulty
        </h3>

        <div className="game-mode-selector">
          {(Object.keys(MODE_INFO) as Mode[]).map(
            m => {
              const best = getHighScore(
                MODE_INFO[m].scoreKey
              );

              return (
                <button
                  key={m}
                  className={`mode-card ${
                    mode === m ? "active" : ""
                  }`}
                  onClick={() => setMode(m)}
                >
                  <strong>
                    {MODE_INFO[m].label}
                  </strong>
                  <p>{MODE_INFO[m].description}</p>

                  <div className="mode-score">
                    Best Score:{" "}
                    {best === null ? "—" : best}
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* ACTIONS */}
        <div className="game-intro-actions">
          <button
            className="btn primary"
            onClick={() =>
              navigate(
                `/game-center/flashcard-blitz/play?mode=${mode}`
              )
            }
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
