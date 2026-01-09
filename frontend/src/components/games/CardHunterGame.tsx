import { useEffect, useState } from "react";
import "../../styles/card-hunter.css";
import {
  fetchFlashcards,
  type Flashcard
} from "../../api/flashcards";

/* ================= TYPES ================= */

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

/* ================= HELPERS ================= */

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
  const [cardIndex, setCardIndex] = useState(0);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<Tile[]>([]);

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  /* -------- LOAD FLASHCARDS -------- */

  useEffect(() => {
    async function load() {
      const data = await fetchFlashcards();
      setFlashcards(shuffle(data));
      setCardIndex(0);
      setLoading(false);
    }
    load();
  }, []);

  /* -------- TIMER -------- */

  useEffect(() => {
    if (loading || gameOver) return;
    const id = setInterval(
      () => setElapsedSeconds(t => t + 1),
      1000
    );
    return () => clearInterval(id);
  }, [loading, gameOver]);

  /* -------- BUILD ROUND -------- */

  function buildRound(r: number, index: number) {
    const tileCount =
      BASE_TILE_COUNT + (r - 1) * 2;

    const correct =
      flashcards[index % flashcards.length];

    const distractors = flashcards.filter(
      fc => fc.id !== correct.id
    );

    const newTiles: Tile[] = [
      {
        id: `term-${r}`,
        text: correct.term,
        type: "term",
        isCorrect: true,
        status: "idle"
      },
      {
        id: `def-${r}`,
        text: correct.definition,
        type: "definition",
        isCorrect: true,
        status: "idle"
      }
    ];

    shuffle(
      distractors.flatMap(fc => [
        { text: fc.term, type: "term" as const },
        { text: fc.definition, type: "definition" as const }
      ])
    )
      .slice(0, tileCount - 2)
      .forEach((f, i) =>
        newTiles.push({
          id: `x-${r}-${i}`,
          text: f.text,
          type: f.type,
          isCorrect: false,
          status: "idle"
        })
      );

    setTiles(shuffle(newTiles));
    setSelected([]);
  }

  /* -------- INITIAL ROUND -------- */

  useEffect(() => {
    if (!loading && flashcards.length >= 2) {
      buildRound(1, 0);
    }
  }, [loading, flashcards]);

  /* -------- CLICK LOGIC -------- */

  function handleClick(tile: Tile) {
    if (tile.status !== "idle" || selected.length === 2) return;

    setTiles(t =>
      t.map(x =>
        x.id === tile.id
          ? { ...x, status: "selected" }
          : x
      )
    );

    const next = [...selected, tile];
    setSelected(next);

    if (next.length === 2) {
      const success = next.every(t => t.isCorrect);
      setTimeout(() => reveal(success), REVEAL_DELAY);
    }
  }

  /* -------- RESULT LOGIC (FIXED) -------- */

  function reveal(success: boolean) {
    setTiles(t =>
      t.map(x =>
        x.isCorrect
          ? { ...x, status: "correct" }
          : success
          ? { ...x, status: "disabled" }
          : { ...x, status: "wrong" }
      )
    );

    setTimeout(() => {
      /* ❌ WRONG ANSWER → LOSE LIFE, SAME ROUND */
      if (!success) {
        setLives(l => {
          const nextLives = l - 1;
          if (nextLives <= 0) {
            setGameOver(true);
            return 0;
          }
          buildRound(round, cardIndex);
          return nextLives;
        });
        return;
      }

      /* ✅ CORRECT ANSWER → ADVANCE */
      setScore(s => s + 100);

      if (round === MAX_ROUNDS) {
        setGameOver(true);
      } else {
        const nextRound = round + 1;
        const nextIndex = cardIndex + 1;

        setRound(nextRound);
        setCardIndex(nextIndex);
        buildRound(nextRound, nextIndex);
      }
    }, ROUND_DELAY);
  }

  /* ================= RENDER ================= */

  if (loading) return <div>Loading…</div>;

  if (gameOver) {
    saveHighScore(score);
    return (
      <div className="card-hunter game-over">
        <h2>Game Complete</h2>
        <p>Score: {score}</p>
        <p>Time: {formatTime(elapsedSeconds)}</p>
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
          >
            {tile.text}
          </button>
        ))}
      </div>
    </div>
  );
}
