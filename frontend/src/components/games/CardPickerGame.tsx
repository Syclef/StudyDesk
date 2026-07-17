import { useEffect, useMemo, useState } from "react";
import { CardGrid } from "../CardGrid";
import "../../styles/card-picker.css";

import {
  getCardPickerWeightedScore,
  saveHighScore
} from "../../utils/scoreUtils";

export const INITIAL_LIVES = 3;
const FEEDBACK_DELAY = 3000;
const DISTRACTOR_COUNT = 5;
const STORAGE_KEY = "auditstudydesk:card-picker";

type Flashcard = {
  id: number;
  term: string;
  definition: string;
};

type Props = {
  onExit: () => void;
};

export default function CardPickerGame({ onExit }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);


  useEffect(() => {
    async function load() {
      const res = await fetch("http://127.0.0.1:4000/flashcards");
      const data: Flashcard[] = await res.json();
      setCards(shuffle(data));
      setLoading(false);
    }
    load();
  }, []);

  const current = cards[index];

  const options = useMemo(() => {
    if (!current) return [];
    const distractors = shuffle(
      cards.filter(c => c.id !== current.id).map(c => c.definition)
    ).slice(0, DISTRACTOR_COUNT);

    return shuffle([current.definition, ...distractors]);
  }, [cards, current]);

  function handlePick(value: string) {
    if (!current || selected) return;

    setSelected(value);
    setShowFeedback(true);

    const correct = value === current.definition;

    if (correct) {
      setScore(s => s + 100 + streak * 20);
      setStreak(s => s + 1);
    } else {
      setLives(l => l - 1);
      setStreak(0);
    }

    setTimeout(() => {
      if (!correct && lives - 1 <= 0) {
        finalizeGame();
        return;
      }
      setIndex(i => i + 1);
      setSelected(null);
      setShowFeedback(false);
    }, FEEDBACK_DELAY);
  }

  function finalizeGame() {
    const weighted = getCardPickerWeightedScore(score);
    saveHighScore(STORAGE_KEY, score, weighted);
  }

  function restartGame() {
    finalizeGame();
    setCards(shuffle(cards));
    setIndex(0);
    setLives(INITIAL_LIVES);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setShowFeedback(false);
  }

  if (loading) {
    return <div className="card-picker-game">Loading…</div>;
  }

  if (lives <= 0 || index >= cards.length) {
    finalizeGame();
    return (
      <div className="card-picker-game">
        <h2>Game Over</h2>
        <p>Final Score: {score}</p>
        <button onClick={restartGame}>Restart</button>
        <button onClick={onExit}>Back</button>
      </div>
    );
  }

  return (
    <div className="card-picker-game">
      <div className="game-header">
        <span>Lives: {"❤️".repeat(lives)}</span>
        <span>Streak: {streak}</span>
        <span>Score: {score}</span>
        <button onClick={restartGame}>Restart</button>
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

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}
