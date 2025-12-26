import { useEffect, useMemo, useState } from "react";
import { CardGrid } from "./CardGrid";
import "../styles/card-picker.css";

const INITIAL_LIVES = 3;
const FEEDBACK_DELAY = 3000;
const DISTRACTOR_COUNT = 5;
const TOTAL_FLASHCARDS = 216;

const HIGH_SCORE_KEY = "auditstudydesk:card-picker:high-score";

type Flashcard = {
  id: number;
  term: string;
  definition: string;
};

type Props = {
  onExit: () => void;
};

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* 🔑 FINAL WEIGHTED SCORE (END ONLY) */
function computeFinalScore(
  correct: number,
  maxStreak: number,
  livesLeft: number
) {
  const coverage = (correct / TOTAL_FLASHCARDS) * 600;
  const streakBonus = Math.min(200, maxStreak * 10);
  const lifeBonus = (livesLeft / INITIAL_LIVES) * 200;

  return Math.round(coverage + streakBonus + lifeBonus);
}

/* 🔑 LIVE SCORE (NO LIFE BONUS) */
function computeLiveScore(correct: number, maxStreak: number) {
  const coverage = (correct / TOTAL_FLASHCARDS) * 600;
  const streakBonus = Math.min(200, maxStreak * 10);
  return Math.round(coverage + streakBonus);
}

export function CardPickerGame({ onExit }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);

  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/flashcards")
      .then(res => res.json())
      .then(data => {
        setCards(shuffle(data));
        setLoading(false);
      });
  }, []);

  const current = cards[index];

  const options = useMemo(() => {
    if (!current) return [];
    return shuffle([
      current.definition,
      ...shuffle(
        cards.filter(c => c.id !== current.id).map(c => c.definition)
      ).slice(0, DISTRACTOR_COUNT)
    ]);
  }, [cards, current]);

  function handlePick(value: string) {
    if (!current || selected) return;

    setSelected(value);
    setShowFeedback(true);

    const isCorrect = value === current.definition;

    if (isCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setLives(l => l - 1);
      setStreak(0);
    }

    setTimeout(() => {
      setIndex(i => i + 1);
      setSelected(null);
      setShowFeedback(false);
    }, FEEDBACK_DELAY);
  }

  function finishGame() {
    const finalScore = computeFinalScore(correct, maxStreak, lives);
    const stored = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    if (finalScore > stored) {
      localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
    }
  }

  if (loading) {
    return <div className="card-picker-shell">Loading…</div>;
  }

  if (lives <= 0 || index >= cards.length) {
    finishGame();
    return (
      <div className="card-picker-shell">
        <div className="game-over">
          <h2>{lives <= 0 ? "Game Over" : "Deck Complete 🎉"}</h2>
          <p>Final Score: {computeFinalScore(correct, maxStreak, lives)}</p>
          <button onClick={() => window.location.reload()}>Restart</button>
          <button onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-picker-shell">
      <div className="game-header">
        <div>Lives: {"❤️".repeat(lives)}</div>
        <div>Streak: {streak}</div>
        <div>Score: {computeLiveScore(correct, maxStreak)}</div>
      </div>

      <div className="main-card">{current.term}</div>

      <CardGrid
        options={options}
        correctAnswer={current.definition}
        selected={selected}
        showFeedback={showFeedback}
        onPick={handlePick}
      />
    </div>
  );
}
