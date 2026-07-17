import { useEffect, useMemo, useState, useCallback } from "react";
import "../../styles/elimination.css";

type Flashcard = {
  id: number;
  term: string;
  definition: string;
};

type Props = {
  onExit: () => void;
};

type Choice = {
  text: string;
  correct: boolean;
};

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SCORE_KEY = "auditstudydesk:elimination:high-score";

function saveHighScore(score: number) {
  const stored = Number(localStorage.getItem(SCORE_KEY)) || 0;
  if (score > stored) {
    localStorage.setItem(SCORE_KEY, String(score));
    return true;
  }
  return false;
}

export default function EliminationGame({ onExit }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [newHigh, setNewHigh] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("http://127.0.0.1:4000/flashcards")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setCards(shuffle(data));
          setLoading(false);
        }
      })
      .catch((err) => console.error("Failed to load cards", err));
    return () => { active = false; };
  }, []);

  const current = useMemo(() => {
    if (!cards.length) return null;
    return cards[index % cards.length];
  }, [cards, index]);

  const choices = useMemo(() => {
    if (!current || cards.length === 0) return [];
    const maxDistractors = Math.min(cards.length - 1, 3);
    const distractors = shuffle(cards.filter((c) => c.id !== current.id)).slice(0, maxDistractors);
    return shuffle([
      { text: current.term, correct: true },
      ...distractors.map((c) => ({ text: c.term, correct: false })),
    ]);
  }, [current, cards]);

  const endGame = useCallback(() => {
    const isNew = saveHighScore(score);
    setNewHigh(isNew);
    setGameOver(true);
  }, [score]);

  function handlePick(i: number) {
    if (selected !== null || gameOver) return;
    setSelected(i);

    if (choices[i]?.correct) {
      setScore((s) => s + 1);
      setTimeout(() => {
        if ((index + 1) % cards.length === 0) {
          setCards((prev) => shuffle(prev));
        }
        setSelected(null);
        setIndex((x) => x + 1);
      }, 600);
    } else {
      setTimeout(() => endGame(), 600);
    }
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setGameOver(false);
    setNewHigh(false);
    setCards((prev) => shuffle(prev));
  }

  if (loading) {
    return (
      <div className="game-intro-card loading-fade">
        <div className="game-header">
          <h2>Elimination</h2>
        </div>
        <div className="loading-skeleton-text"></div>
        <div className="loading-skeleton-grid">
          {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton-button"></div>)}
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-intro-card end-screen-fade">
        <h2>Eliminated 💀</h2>
        {newHigh && <p className="new-high-score-animation">🎉 New High Score!</p>}
        <p className="game-intro-text">Final Score: <strong>{score}</strong></p>
        <div className="game-intro-actions">
          <button className="btn btn-primary" onClick={restart}>Try Again</button>
          <button className="btn btn-secondary" onClick={onExit}>Back to Game Center</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-intro-card game-play-fade">
      <div className="game-header">
        <h2>Elimination</h2>
        <span className="score-badge">Score: {score}</span>
      </div>

      <div className="game-intro-text">
        <p className="elim-label-spacer"><strong>Definition:</strong></p>
        <p className="elim-definition-text">{current?.definition}</p>
      </div>

      <div className="flashcard-blitz-choices">
        {choices.map((c, i) => {
          let statusClass = "";
          if (selected !== null) {
            if (c.correct) statusClass = "choice-correct";
            else if (selected === i) statusClass = "choice-wrong";
          }

          return (
            <button
              key={`${index}-${i}`}
              className={`choice-btn ${statusClass}`}
              disabled={selected !== null}
              onClick={() => handlePick(i)}
            >
              {c.text}
            </button>
          );
        })}
      </div>

      <div className="game-intro-actions">
        <button className="btn btn-secondary" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}