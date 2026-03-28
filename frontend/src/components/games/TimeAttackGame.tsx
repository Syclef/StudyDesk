import { useEffect, useMemo, useRef, useState } from "react";
import { CardGrid } from "../CardGrid";
// This import ensures Time Attack styles do not bleed into Card Picker
import "../../styles/time-attack.css"; 

/* ================= CONFIG ================= */
const FEEDBACK_DELAY = 450;
const DISTRACTOR_COUNT = 5;

const DURATIONS = [
  { label: "3m", value: 180, className: "btn-easy" }, 
  { label: "1m", value: 60, className: "btn-med" },  
  { label: "30s", value: 30, className: "btn-hard" }, 
];

type Flashcard = { id: number; term: string; definition: string };
type Props = { onExit: () => void };

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function TimeAttackGame({ onExit }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load cards from API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/flashcards")
      .then(res => res.json())
      .then(data => {
        setCards(shuffle(data));
        setLoading(false);
      });
  }, []);

  // Start 3-2-1 Countdown
  const startSequence = (seconds: number) => {
    setTimeLeft(seconds);
    setIsCountingDown(true);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setIsCountingDown(false);
        setGameStarted(true);
      }
      setCountdown(count);
    }, 800);
  };

  // Game Timer Logic
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStarted, gameOver]);

  const current = cards[index];

  // Memoize options to prevent shuffling on every re-render
  const options = useMemo(() => {
    if (!current || !cards.length) return [];
    return shuffle([
      current.definition,
      ...shuffle(cards.filter(c => c.id !== current.id).map(c => c.definition)).slice(0, DISTRACTOR_COUNT),
    ]);
  }, [cards, index, current]);

  function handlePick(value: string) {
    if (!current || selected || gameOver || isCountingDown) return;
    setSelected(value);
    setShowFeedback(true);

    if (value === current.definition) {
      setCorrect(c => c + 1);
      setStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        // Bonus time for streak
        if (next > 0 && next % 5 === 0) setTimeLeft(t => t + 2);
        return next;
      });
    } else {
      setStreak(0);
      // Penalty time for wrong answer
      setTimeLeft(t => Math.max(0, t - 2));
    }

    setTimeout(() => {
      setIndex(i => (cards.length ? (i + 1) % cards.length : 0));
      setSelected(null);
      setShowFeedback(false);
    }, FEEDBACK_DELAY);
  }

  if (loading) return <div className="time-attack-container">Loading...</div>;

  // 1️⃣ INSTRUCTIONS PAGE
  if (!gameStarted && !isCountingDown) {
    return (
      <div className="time-attack-container">
        <div className="onboarding-card">
          <h2 className="title-gradient">Time Attack</h2>
          <p className="subtitle">Master speed and accuracy. How fast can you recall?</p>

          <div className="instructions-list">
            <div className="inst-item">🚀 <span>Speed is rewarded with bonus time</span></div>
            <div className="inst-item">🔥 <span>5-Streak = <strong>+2 Seconds</strong></span></div>
            <div className="inst-item">⚠️ <span>Wrong answers cost <strong>2 seconds</strong></span></div>
          </div>

          <p className="select-label">Choose challenge intensity:</p>
          <div className="duration-buttons">
            {DURATIONS.map(d => (
              <button 
                key={d.value} 
                className={`btn-time ${d.className}`}
                onClick={() => startSequence(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="action-area">
            <button className="btn btn-secondary" onClick={onExit}>
              Back to Game Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2️⃣ COUNTDOWN OVERLAY
  if (isCountingDown) {
    return (
      <div className="time-attack-container">
        <div className="countdown-overlay">
          <div key={countdown} className="zoom-text">{countdown}</div>
        </div>
      </div>
    );
  }

  // 3️⃣ GAME OVER SCREEN
  if (gameOver) {
    return (
      <div className="time-attack-container">
        <div className="onboarding-card">
          <h2 className="title-gradient">Time’s Up!</h2>
          <div className="stats-display">
            <div className="stat-box"><p>{correct}</p><small>Correct</small></div>
            <div className="stat-box"><p>{maxStreak}</p><small>Max Streak</small></div>
          </div>
          <button className="btn-time btn-easy btn-full-width" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <div className="action-area">
            <button className="btn-secondary" onClick={onExit}>
              Back to Game Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4️⃣ ACTIVE GAMEPLAY
  return (
    <div className="time-attack-container">
      <div className="game-header">
        <div className={`timer-display ${timeLeft <= 10 ? 'timer-urgent' : ''}`}>{timeLeft}s</div>
        <div className="badge-group">
          <span className="badge">Score: {correct}</span>
          <span className="badge">🔥 {streak}</span>
        </div>
        <button className="btn-exit" onClick={onExit}>Exit</button>
      </div>

      <div className="main-card">
        <h2>{current?.term}</h2>
      </div>

      <div className="game-content">
        <CardGrid 
          options={options} 
          correctAnswer={current?.definition} 
          selected={selected} 
          showFeedback={showFeedback} 
          onPick={handlePick} 
        />
      </div>
    </div>
  );
}