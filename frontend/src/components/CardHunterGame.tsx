import { useEffect, useState } from "react";
import "../styles/card-hunter.css";

/* ================= TYPES ================= */

type Flashcard = {
  id: string;
  term: string;
  definition: string;
};

type TileStatus =
  | "idle"
  | "selected"
  | "correct"
  | "wrong"
  | "disabled";

type Tile = {
  id: string;
  text: string;
  type: "term" | "definition";
  isCorrect: boolean;
  status: TileStatus;
};

/* ================= CONSTANTS ================= */

const MAX_ROUNDS = 6;
const BASE_TILE_COUNT = 4;
const REVEAL_DELAY = 400;
const ROUND_DELAY = 1400;

const HIGH_SCORE_KEY = "auditstudydesk:card-hunter:high-score";

const END_MESSAGES = [
  "Cool! Try again!",
  "Nice run!",
  "Well played!",
  "Good effort!",
  "Keep sharpening your skills!"
];

/* ================= HELPERS ================= */

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* 🔑 LIVE SCORE (NO FREE POINTS) */
function computeLiveScore(round: number) {
  return Math.round(((round - 1) / MAX_ROUNDS) * 700);
}

/* 🔑 FINAL WEIGHTED SCORE (0–1000) */
function computeFinalScore(
  roundsCleared: number,
  livesRemaining: number,
  timeSeconds: number
) {
  const coverage = (roundsCleared / MAX_ROUNDS) * 700;
  const lifeBonus = (livesRemaining / 3) * 200;
  const speedBonus = Math.max(0, 100 - timeSeconds);

  return Math.min(1000, Math.round(coverage + lifeBonus + speedBonus));
}

/* ================= COMPONENT ================= */

export default function CardHunterGame() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [round, setRound] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<Tile[]>([]);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  /* -------- FETCH DATA -------- */

  useEffect(() => {
    fetch("http://127.0.0.1:8000/flashcards")
      .then(res => res.json())
      .then((data: Flashcard[]) => setFlashcards(data));
  }, []);

  /* -------- TIMER -------- */

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  /* -------- BUILD ROUND -------- */

  function buildRound(currentRound: number) {
    const tileCount = BASE_TILE_COUNT + (currentRound - 1) * 2;
    const correct = shuffle(flashcards)[0];
    const distractors = shuffle(
      flashcards.filter(fc => fc.id !== correct.id)
    );

    const baseTiles: Tile[] = [
      {
        id: `term-${currentRound}`,
        text: correct.term,
        type: "term",
        isCorrect: true,
        status: "idle"
      },
      {
        id: `def-${currentRound}`,
        text: correct.definition,
        type: "definition",
        isCorrect: true,
        status: "idle"
      }
    ];

    const fillers = shuffle(
      distractors.flatMap(fc => [
        { text: fc.term, type: "term" as const },
        { text: fc.definition, type: "definition" as const }
      ])
    ).slice(0, tileCount - 2);

    fillers.forEach((f, i) => {
      baseTiles.push({
        id: `x-${currentRound}-${i}`,
        text: f.text,
        type: f.type,
        isCorrect: false,
        status: "idle"
      });
    });

    setTiles(shuffle(baseTiles));
    setSelected([]);
  }

  useEffect(() => {
    if (flashcards.length === 0 || round > MAX_ROUNDS) return;
    buildRound(round);
  }, [flashcards, round]);

  /* -------- CLICK LOGIC -------- */

  function handleClick(tile: Tile) {
    if (tile.status !== "idle") return;
    if (selected.length === 2) return;

    setTiles(prev =>
      prev.map(t =>
        t.id === tile.id ? { ...t, status: "selected" } : t
      )
    );

    const next = [...selected, tile];
    setSelected(next);

    if (next.length === 2) {
      const success = next.every(t => t.isCorrect);

      setTimeout(() => {
        revealResult(success, next);
      }, REVEAL_DELAY);
    }
  }

  function revealResult(success: boolean, picks: Tile[]) {
    setTiles(prev =>
      prev.map(t => {
        if (t.isCorrect) return { ...t, status: "correct" };
        if (!success && picks.some(p => p.id === t.id))
          return { ...t, status: "wrong" };
        return { ...t, status: "disabled" };
      })
    );

    setTimeout(() => {
      if (!success) {
        if (lives - 1 <= 0) {
          setGameOver(true);
        } else {
          setLives(l => l - 1);
          buildRound(round); // 🔑 stay in same round
        }
        return;
      }

      if (round === MAX_ROUNDS) {
        setGameOver(true);
      } else {
        setRound(r => r + 1);
      }
    }, ROUND_DELAY);
  }

  /* ================= GAME OVER ================= */

  if (gameOver) {
    const finalScore = computeFinalScore(
      round - 1,
      lives,
      elapsed
    );

    const stored = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    if (finalScore > stored) {
      localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
    }

    return (
      <div className="card-hunter game-over">
        <h2>Game Complete</h2>
        <p>Score: {finalScore}</p>
        <p>Time: {formatTime(elapsed)}</p>
        <p>{shuffle(END_MESSAGES)[0]}</p>
        <button onClick={() => window.location.reload()}>
          Start Again
        </button>
      </div>
    );
  }

  /* ================= GAME UI ================= */

  return (
    <div className="card-hunter">
      <div className="card-hunter-header">
        <span>Round {round}</span>
        <span>Lives: {"❤️".repeat(lives)}</span>
        <span>Score: {computeLiveScore(round)}</span>
        <span>Time: {formatTime(elapsed)}</span>
      </div>

      <div className="card-hunter-grid">
        {tiles.map(tile => (
          <button
            key={tile.id}
            className={`card-hunter-card ${tile.status}`}
            onClick={() => handleClick(tile)}
            disabled={tile.status === "disabled"}
          >
            {tile.text}
          </button>
        ))}
      </div>
    </div>
  );
}
