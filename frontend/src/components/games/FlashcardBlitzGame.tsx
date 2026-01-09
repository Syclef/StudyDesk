import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  fetchFlashcards,
  type Flashcard,
} from "../../api/flashcards";

/* ================= MODES ================= */

type Mode = "easy" | "normal" | "hard";

const MODE_CONFIG: Record<
  Mode,
  {
    gameTime: number;
    baseCardTime: number;
    comboBonus: number;
    optionCount: number;
    timePenalty: number;
  }
> = {
  easy: {
    gameTime: 60,
    baseCardTime: 10,
    comboBonus: 0,
    optionCount: 3,
    timePenalty: 0,
  },
  normal: {
    gameTime: 60,
    baseCardTime: 7,
    comboBonus: 1,
    optionCount: 3,
    timePenalty: 1,
  },
  hard: {
    gameTime: 60,
    baseCardTime: 5,
    comboBonus: 2,
    optionCount: 5,
    timePenalty: 2,
  },
};

/* ================= HELPERS ================= */

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function saveHighScore(mode: Mode, score: number) {
  const key = `auditstudydesk:flashcard-blitz:${mode}`;
  const stored = Number(localStorage.getItem(key)) || 0;
  if (score > stored) {
    localStorage.setItem(key, String(score));
    return true;
  }
  return false;
}

/* ================= TYPES ================= */

type Choice = {
  text: string;
  correct: boolean;
};

/* ================= COMPONENT ================= */

export default function FlashcardBlitzGame() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const mode =
    (params.get("mode") as Mode) ?? "normal";
  const cfg = MODE_CONFIG[mode];

  const [flashcards, setFlashcards] =
    useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);

  const [choices, setChoices] =
    useState<Choice[]>([]);
  const [selected, setSelected] =
    useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongStreak, setWrongStreak] =
    useState(0);

  const [gameTimeLeft, setGameTimeLeft] =
    useState(cfg.gameTime);
  const [cardTimeLeft, setCardTimeLeft] =
    useState(cfg.baseCardTime);

  const [gameOver, setGameOver] =
    useState(false);
  const [newHighScore, setNewHighScore] =
    useState(false);

  /* -------- LOAD FLASHCARDS -------- */

  useEffect(() => {
    fetchFlashcards().then(data =>
      setFlashcards(shuffle(data))
    );
  }, []);

  /* -------- GAME TIMER -------- */

  useEffect(() => {
    if (gameOver) return;

    if (gameTimeLeft <= 0) {
      endGame();
      return;
    }

    const id = setInterval(
      () => setGameTimeLeft(t => t - 1),
      1000
    );

    return () => clearInterval(id);
  }, [gameTimeLeft, gameOver]);

  /* -------- BUILD QUESTION -------- */

  useEffect(() => {
    if (flashcards.length < cfg.optionCount)
      return;

    const correct =
      flashcards[index % flashcards.length];

    const distractors = shuffle(
      flashcards.filter(fc => fc.id !== correct.id)
    ).slice(0, cfg.optionCount - 1);

    setChoices(
      shuffle([
        { text: correct.term, correct: true },
        ...distractors.map(fc => ({
          text: fc.term,
          correct: false,
        })),
      ])
    );

    setSelected(null);
    setCardTimeLeft(
      cfg.baseCardTime +
        combo * cfg.comboBonus
    );
  }, [index, flashcards]);

  /* -------- PER-CARD TIMER -------- */

  useEffect(() => {
    if (gameOver) return;

    if (cardTimeLeft <= 0) {
      // ⛔ Missed → zero points, move on
      setCombo(0);
      setWrongStreak(w => w + 1);
      setIndex(i => i + 1);
      return;
    }

    const id = setInterval(
      () => setCardTimeLeft(t => t - 1),
      1000
    );

    return () => clearInterval(id);
  }, [cardTimeLeft, gameOver]);

  /* -------- ANSWER -------- */

  function handleSelect(i: number) {
    if (selected !== null) return;

    setSelected(i);

    if (choices[i].correct) {
      setScore(
        s => s + 10 + combo * 2
      );
      setCombo(c => c + 1);
      setWrongStreak(0);
    } else {
      setCombo(0);
      setWrongStreak(w => {
        const next = w + 1;

        if (
          next % 2 === 0 &&
          cfg.timePenalty > 0
        ) {
          setGameTimeLeft(t =>
            Math.max(0, t - cfg.timePenalty)
          );
        }
        return next;
      });
    }

    setTimeout(() => {
      setIndex(i => i + 1);
    }, 350);
  }

  function endGame() {
    const isNew = saveHighScore(
      mode,
      score
    );
    setNewHighScore(isNew);
    setGameOver(true);
  }

  /* ================= RENDER ================= */

  if (gameOver) {
    return (
      <div className="game-over">
        <h2>Game Complete</h2>
        {newHighScore && (
          <p>🎉 New High Score!</p>
        )}
        <p>Mode: {mode}</p>
        <p>Score: {score}</p>

        <button
          onClick={() =>
            navigate("/game-center")
          }
        >
          Back to Game Center
        </button>
      </div>
    );
  }

  const card =
    flashcards[index % flashcards.length];

  return (
    <div className="flashcard-blitz">
      <div className="flashcard-blitz-header">
        <span>Mode: {mode}</span>
        <span>Score: {score}</span>
        <span>🔥 Combo: {combo}</span>
        <span>
          ⏳ {formatTime(gameTimeLeft)}
        </span>
      </div>

      <div className="flashcard-blitz-card">
        <p>{card?.definition}</p>
        <small>
          Answer in {cardTimeLeft}s
        </small>
      </div>

      <div className="flashcard-blitz-choices">
        {choices.map((c, i) => (
          <button
            key={i}
            disabled={selected !== null}
            onClick={() => handleSelect(i)}
          >
            {c.text}
          </button>
        ))}
      </div>

      <button
        className="btn secondary"
        onClick={endGame}
      >
        End Game
      </button>
    </div>
  );
}
