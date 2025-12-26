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

function saveHighScore(score: number) {
  const stored = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  if (score > stored) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/* ================= COMPONENT ================= */

export default function CardHunterGame() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [round, setRound] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<Tile[]>([]);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  /* -------- FETCH DATA -------- */

  useEffect(() => {
    fetch("http://127.0.0.1:8000/flashcards")
      .then(res => res.json())
      .then((data: Flashcard[]) => setFlashcards(data));
  }, []);

  /* -------- TIMER -------- */

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
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
      setTimeout(() => revealResult(success, next), REVEAL_DELAY);
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

    if (success) setScore(s => s + 100);
    else setLives(l => l - 1);

    setTimeout(() => {
      if (!success) {
        if (lives - 1 <= 0) setGameOver(true);
        else buildRound(round);
        return;
      }

      if (round === MAX_ROUNDS) setGameOver(true);
      else setRound(r => r + 1);
    }, ROUND_DELAY);
  }

  /* ================= RENDER ================= */

  if (gameOver) {
    saveHighScore(score);
    const message = shuffle(END_MESSAGES)[0];

    return (
      <div className="card-hunter game-over">
        <h2>Game Complete</h2>
        <p>Score: {score}</p>
        <p>Time: {formatTime(elapsedSeconds)}</p>
        <p>{message}</p>
        <button onClick={() => window.location.reload()}>
          Start Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-hunter">
      <div className="card-hunter-header">
        <span>Round {round}</span>
        <span>Lives: {"❤️".repeat(lives)}</span>
        <span>Score: {score}</span>
        <span>Time: {formatTime(elapsedSeconds)}</span>
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
