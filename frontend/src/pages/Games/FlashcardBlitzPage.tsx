import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import FlashcardBlitzGame from "../../components/games/FlashcardBlitzGame";
// Ensure the blitz styles are available for the intro page as well
import "../../styles/flashcard-blitz.css";

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
    description: "10 seconds per card. No penalties. Focus on recall.",
    scoreKey: "auditstudydesk:flashcard-blitz:easy",
  },
  normal: {
    label: "Normal",
    description:
      "7 seconds per card. Combo adds time. Wrong answers reduce game time.",
    scoreKey: "auditstudydesk:flashcard-blitz:normal",
  },
  hard: {
    label: "Hard",
    description:
      "5 seconds per card. More options. Heavy time penalties.",
    scoreKey: "auditstudydesk:flashcard-blitz:hard",
  },
};

function getHighScore(key: string): number | null {
  const value = localStorage.getItem(key);
  return value ? Number(value) : null;
}

export default function FlashcardBlitzPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const modeFromUrl = searchParams.get("mode") as Mode | null;
  const [selectedMode, setSelectedMode] = useState<Mode>("normal");

  /* =========================
      GAME VIEW
      ========================= */
  if (modeFromUrl) {
    return (
      <div className="blitz-page-wrapper">
        <FlashcardBlitzGame />
      </div>
    );
  }

  /* =========================
      INSTRUCTIONS VIEW
      ========================= */
  return (
    <div className="game-intro-page">
      <div className="game-intro-card">
        <h2 className="title-gradient">Flashcard Blitz</h2>

        <div className="game-intro-text">
          <p className="subtitle">
            A rapid-fire challenge to test your split-second recall. 
            Choose the correct term for the definition before the clock runs out.
          </p>
        </div>

        <div className="instructions-list instructions-list-styled">
          <div className="inst-item">⏳ <span>1-minute high-pressure rounds</span></div>
          <div className="inst-item">🔥 <span>Combos reward speed with bonus time</span></div>
          <div className="inst-item">⚠️ <span>Inaccurate answers penalize your total time</span></div>
        </div>

        <h3 className="game-category-title margin-top-24">
          Select Difficulty
        </h3>

        <div className="game-mode-selector">
          {(Object.keys(MODE_INFO) as Mode[]).map((m) => {
            const best = getHighScore(MODE_INFO[m].scoreKey);
            const isActive = selectedMode === m;

            return (
              <button
                key={m}
                className={`mode-card ${isActive ? "active" : ""}`}
                onClick={() => setSelectedMode(m)}
              >
                <div className="mode-card-header">
                   <strong>{MODE_INFO[m].label}</strong>
                   {isActive && <span className="active-check">✓</span>}
                </div>
                <p>{MODE_INFO[m].description}</p>
                <div className="mode-score">
                  Best Score: <span>{best === null ? "—" : best}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="game-intro-actions margin-top-40">
          <button
            className="btn btn-primary btn-primary-custom"
            onClick={() =>
              navigate(
                `/game-center/flashcard-blitz?mode=${selectedMode}`
              )
            }
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