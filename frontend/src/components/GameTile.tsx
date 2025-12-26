import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  highestScore: number;
  rank: number;
  to: string;
  lastPlayed?: string | null;
  onReset?: () => void;
};

export function GameTile({
  title,
  highestScore,
  rank,
  to,
  lastPlayed,
  onReset
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="game-tile">
      <h2>{title}</h2>

      <p><strong>Highest Score:</strong> {highestScore}</p>
      <p><strong>Your Rank:</strong> {rank}</p>

      {lastPlayed && (
        <p className="last-played">
          Last played: {new Date(lastPlayed).toLocaleString()}
        </p>
      )}

      <div className="tile-actions">
        <button onClick={() => navigate(to)}>Start Playing</button>
        {onReset && (
          <button className="danger" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
