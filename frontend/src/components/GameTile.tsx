import { Link } from "react-router-dom";

interface Props {
  title: string;
  highestScore: number;
  rank: number;
  to: string;
  disabled?: boolean;
  badge?: string;
}

export function GameTile({
  title,
  highestScore,
  rank,
  to,
  disabled = false,
  badge
}: Props) {
  const content = (
    <div
      className={`game-tile ${disabled ? "disabled" : ""}`}
      {...(disabled ? { "aria-disabled": "true" } : {})}
    >
      {badge && <div className="game-tile-badge">{badge}</div>}

      <h3 className="game-tile-title">{title}</h3>

      <div className="game-tile-stats">
        <div>
          <span className="label">High Score</span>
          <span className="value">{highestScore}</span>
        </div>
        <div>
          <span className="label">Rank</span>
          <span className="value">{rank}</span>
        </div>
      </div>
    </div>
  );

  // 🔒 Disabled tiles are NOT interactive (mouse or keyboard)
  if (disabled) {
    return content;
  }

  return (
    <Link to={to} className="game-tile-link">
      {content}
    </Link>
  );
}
