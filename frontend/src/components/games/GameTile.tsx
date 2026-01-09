import { Link } from "react-router-dom";

interface Props {
  title: string;
  description?: string;
  highestScore: number | null;
  rank: number | null;          // ✅ allow null
  to: string;
  disabled?: boolean;
  badge?: string;
}

export function GameTile({
  title,
  description,
  highestScore,
  rank,
  to,
  disabled = false,
  badge,
}: Props) {
  const content = (
    <div
      className={`game-tile ${disabled ? "disabled" : ""}`}
      {...(disabled ? { "aria-disabled": "true" } : {})}
    >
      {/* Title + Description */}
      <div className="game-tile-header">
        <h3 className="game-tile-title">{title}</h3>

        {description && (
          <p className="game-tile-description">
            {description}
          </p>
        )}
      </div>

      {/* High Score */}
      <div>
        <span className="label">High Score: </span>{" "}
        <span className="value">
          {highestScore === null ? "—" : highestScore}
        </span>
      </div>

      {/* Rank */}
      <div>
        <span className="label">Rank: </span>{" "}
        <span className="value">
          {rank === null ? "—" : rank}
        </span>
      </div>

      {/* Badge */}
      {badge && (
        <div className="game-tile-badge">
          {badge}
        </div>
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return (
    <Link to={to} className="game-tile-link">
      {content}
    </Link>
  );
}
