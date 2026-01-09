interface Props {
  lives: number;
  score: number;
  streak: number;
  started: boolean;
  onStart: () => void;
  onRestart: () => void;
}

export function GameHeader({
  lives,
  score,
  streak,
  started,
  onStart,
  onRestart
}: Props) {
  return (
    <div className="game-header">
      <div className="stats">
        <span>Lives: {"❤️".repeat(lives)}</span>
        <span>Win streak: {streak}</span>
        <span>Score: {score}</span>
      </div>

      <div className="controls">
        {!started && (
          <button className="btn start" onClick={onStart}>
            Start
          </button>
        )}

        <button className="btn restart" onClick={onRestart}>
          Restart
        </button>
      </div>
    </div>
  );
}
