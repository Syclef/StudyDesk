import { CardTile } from "./CardTile";

type CardGridProps = {
  options: string[];
  correctAnswer: string;
  selected: string | null;
  showFeedback: boolean;
  onPick: (value: string) => void;
};

export function CardGrid({
  options,
  correctAnswer,
  selected,
  showFeedback,
  onPick,
}: CardGridProps) {
  return (
    <div className="card-grid">
      {options.map(option => {
        let state: "default" | "correct" | "wrong" = "default";

        if (showFeedback) {
          if (option === correctAnswer) state = "correct";
          else if (option === selected) state = "wrong";
        }

        return (
          <CardTile
            key={option}
            text={option}
            state={state}
            disabled={!!selected}
            onClick={() => onPick(option)}
          />
        );
      })}
    </div>
  );
}
